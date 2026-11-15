import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GatewayFacilitatorService } from '../facilitator/gateway-facilitator.service';
import { GatewayResourceService } from '../resource/gateway-resource.service';

export interface GatewayRecommenderWeightConfig {
  version: string;
  needFit: number;
  timeFit: number;
  difficultyFit: number;
  continuityFit: number;
  resourceFit: number;
  diversityFit: number;
}

export interface GatewayPilotFeatureFlags {
  llmContextualizationEnabled: boolean;
  offlineSyncEnabled: boolean;
  recoveryModeEnabled: boolean;
  weeklyMicroSurveyEnabled: boolean;
}

export interface GatewayAdminAuditLogEntry {
  auditId: string;
  adminUserId: string;
  action: string;
  targetEntity: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface GatewayAnonymizedParticipantRow {
  participantIdPseudonym: string;
  cohortSemester: number;
  completedMissionsCount: number;
  acceptedRecommendationsCount: number;
  recoveryActivationsCount: number;
  weeklySurveysCompletedCount: number;
}

export interface GatewayAnonymizedResearchExport {
  exportId: string;
  generatedAt: string;
  generatedByAdminId: string;
  schemaVersion: '1.0.0';
  containsPii: false;
  participantCount: number;
  records: GatewayAnonymizedParticipantRow[];
}

export interface GatewayAdminOverview {
  totalUsersCount: number;
  activeMissionsCount: number;
  publishedResourcesCount: number;
  pendingModerationResourcesCount: number;
  recommenderWeights: GatewayRecommenderWeightConfig;
  featureFlags: GatewayPilotFeatureFlags;
  recentAuditLogsCount: number;
}

@Injectable()
export class GatewayAdminService {
  private recommenderWeights: GatewayRecommenderWeightConfig = {
    version: '1.0.0',
    needFit: 0.3,
    timeFit: 0.2,
    difficultyFit: 0.15,
    continuityFit: 0.15,
    resourceFit: 0.15,
    diversityFit: 0.05,
  };

  private featureFlags: GatewayPilotFeatureFlags = {
    llmContextualizationEnabled: true,
    offlineSyncEnabled: true,
    recoveryModeEnabled: true,
    weeklyMicroSurveyEnabled: true,
  };

  private readonly auditLogs: GatewayAdminAuditLogEntry[] = [
    {
      auditId: 'aud-seed-001',
      adminUserId: '00000000-0000-4000-8000-000000000001',
      action: 'INITIALIZE_PILOT_DEFAULTS',
      targetEntity: 'recommender-config',
      details: { version: '1.0.0' },
      createdAt: '2026-11-01T10:00:00.000Z',
    },
  ];

  constructor(
    @Inject(GatewayResourceService)
    private readonly resourceService: GatewayResourceService,
    @Inject(GatewayFacilitatorService)
    private readonly facilitatorService: GatewayFacilitatorService,
  ) {}

  assertOnlineAdminMutation(connectivityHeader?: string): void {
    if (connectivityHeader?.trim().toUpperCase() === 'OFFLINE') {
      throw new ConflictException({
        code: 'ADMIN_OFFLINE_MUTATION_FORBIDDEN',
        message:
          'Las mutaciones administrativas requieren conexión activa (ADR-005).',
      });
    }
  }

  getOverview(): GatewayAdminOverview {
    const allResources = this.resourceService.listForModeration();
    const publishedCount = allResources.filter(
      (r) => r.status === 'PUBLISHED',
    ).length;
    const pendingCount = allResources.filter(
      (r) => r.status === 'PENDING_REVIEW' || r.status === 'NEEDS_REVIEW',
    ).length;

    return {
      totalUsersCount: 8,
      activeMissionsCount: 8,
      publishedResourcesCount: publishedCount,
      pendingModerationResourcesCount: pendingCount,
      recommenderWeights: { ...this.recommenderWeights },
      featureFlags: { ...this.featureFlags },
      recentAuditLogsCount: this.auditLogs.length,
    };
  }

  updateRecommenderConfig(
    adminUserId: string,
    input: {
      weights?: Partial<Omit<GatewayRecommenderWeightConfig, 'version'>>;
      featureFlags?: Partial<GatewayPilotFeatureFlags>;
    },
    connectivityHeader?: string,
  ): {
    recommenderWeights: GatewayRecommenderWeightConfig;
    featureFlags: GatewayPilotFeatureFlags;
  } {
    this.assertOnlineAdminMutation(connectivityHeader);

    if (input.weights) {
      const candidate: Omit<GatewayRecommenderWeightConfig, 'version'> = {
        needFit: input.weights.needFit ?? this.recommenderWeights.needFit,
        timeFit: input.weights.timeFit ?? this.recommenderWeights.timeFit,
        difficultyFit:
          input.weights.difficultyFit ?? this.recommenderWeights.difficultyFit,
        continuityFit:
          input.weights.continuityFit ?? this.recommenderWeights.continuityFit,
        resourceFit:
          input.weights.resourceFit ?? this.recommenderWeights.resourceFit,
        diversityFit:
          input.weights.diversityFit ?? this.recommenderWeights.diversityFit,
      };

      const total =
        Math.round(
          (candidate.needFit +
            candidate.timeFit +
            candidate.difficultyFit +
            candidate.continuityFit +
            candidate.resourceFit +
            candidate.diversityFit) *
            1000,
        ) / 1000;

      if (Math.abs(total - 1.0) > 0.001) {
        throw new BadRequestException({
          code: 'INVALID_RECOMMENDER_WEIGHTS_SUM',
          message: `La suma de los pesos del recomendador debe ser 1.00 (actual: ${total}).`,
        });
      }

      this.recommenderWeights = {
        version: `1.0.${this.auditLogs.length}`,
        ...candidate,
      };
    }

    if (input.featureFlags) {
      this.featureFlags = {
        ...this.featureFlags,
        ...input.featureFlags,
      };
    }

    this.recordAudit(adminUserId, 'UPDATE_RECOMMENDER_CONFIG', 'recommender', {
      weightsVersion: this.recommenderWeights.version,
      featureFlags: this.featureFlags,
    });

    return {
      recommenderWeights: { ...this.recommenderWeights },
      featureFlags: { ...this.featureFlags },
    };
  }

  assignFacilitator(
    adminUserId: string,
    input: { facilitatorId: string; studentId: string },
    connectivityHeader?: string,
  ) {
    this.assertOnlineAdminMutation(connectivityHeader);

    if (!input.facilitatorId?.trim() || !input.studentId?.trim()) {
      throw new BadRequestException({
        code: 'ASSIGNMENT_IDS_REQUIRED',
        message: 'Debes indicar facilitatorId y studentId.',
      });
    }

    const updated = this.facilitatorService.assignFacilitatorToStudent(
      input.facilitatorId.trim(),
      input.studentId.trim(),
    );

    this.recordAudit(
      adminUserId,
      'ASSIGN_FACILITATOR_COHORT',
      `student:${updated.participantIdPseudonym}`,
      {
        facilitatorId: input.facilitatorId.trim(),
        participantIdPseudonym: updated.participantIdPseudonym,
      },
    );

    return updated;
  }

  listAuditLogs(): GatewayAdminAuditLogEntry[] {
    return [...this.auditLogs];
  }

  generateAnonymizedExport(
    adminUserId: string,
    connectivityHeader?: string,
  ): GatewayAnonymizedResearchExport {
    this.assertOnlineAdminMutation(connectivityHeader);

    const students = this.facilitatorService.listAssignedStudents(
      adminUserId,
      true,
    );
    const records: GatewayAnonymizedParticipantRow[] = students.map(
      (stu, idx) => ({
        participantIdPseudonym: stu.participantIdPseudonym,
        cohortSemester: stu.semester,
        completedMissionsCount: stu.weeklyCompletedMissions,
        acceptedRecommendationsCount: idx === 0 ? 2 : 1,
        recoveryActivationsCount: stu.recoveryActive ? 1 : 0,
        weeklySurveysCompletedCount: 1,
      }),
    );

    const exportPayload: GatewayAnonymizedResearchExport = {
      exportId: randomUUID(),
      generatedAt: new Date().toISOString(),
      generatedByAdminId: adminUserId,
      schemaVersion: '1.0.0',
      containsPii: false,
      participantCount: records.length,
      records,
    };

    this.recordAudit(
      adminUserId,
      'EXPORT_ANONYMIZED_RESEARCH_DATASET',
      `export:${exportPayload.exportId}`,
      {
        participantCount: exportPayload.participantCount,
        containsPii: false,
      },
    );

    return exportPayload;
  }

  private recordAudit(
    adminUserId: string,
    action: string,
    targetEntity: string,
    details: Record<string, unknown>,
  ): void {
    this.auditLogs.unshift({
      auditId: randomUUID(),
      adminUserId,
      action,
      targetEntity,
      details,
      createdAt: new Date().toISOString(),
    });
  }
}

