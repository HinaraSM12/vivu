import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GatewayGamificationService } from '../gamification/gateway-gamification.service';
import { GatewayRecommendationService } from '../recommendation/gateway-recommendation.service';
import { GatewayResourceService } from '../resource/gateway-resource.service';
import { GatewayStudentService } from '../student/gateway-student.service';
import {
  type GatewaySurveyAnswer,
  type GatewaySurveyCode,
  GatewaySurveyService,
} from '../survey/gateway-survey.service';

export type GatewayOfflineActionType =
  | 'MISSION_ACCEPT'
  | 'MISSION_START'
  | 'MISSION_PAUSE'
  | 'MISSION_SKIP'
  | 'MISSION_COMPLETE'
  | 'SURVEY_SUBMIT'
  | 'RECOVERY_ACTIVATE'
  | 'RECOMMENDATION_ACTION'
  | 'PROFILE_UPDATE';

export interface GatewayOutboxItem {
  clientEventId: string;
  studentId?: string;
  actionType: GatewayOfflineActionType;
  occurredAt: string;
  payload: Record<string, unknown>;
}

export interface GatewaySyncActionResult {
  clientEventId: string;
  actionType: GatewayOfflineActionType;
  status: 'APPLIED' | 'IDEMPOTENT_DUPLICATE' | 'CONFLICT_RESOLVED';
  serverTimestamp: string;
}

export interface GatewaySyncBatchResponse {
  processedCount: number;
  serverCursor: string;
  results: GatewaySyncActionResult[];
}

export interface GatewaySyncBootstrapResponse {
  studentId: string;
  serverCursor: string;
  bootstrappedAt: string;
  missionsCount: number;
  publishedResourcesCount: number;
  recommendationsCount: number;
  recoveryActive: boolean;
}

export interface GatewaySyncPullResponse {
  studentId: string;
  serverCursor: string;
  pulledAt: string;
  changesCount: number;
}

@Injectable()
export class GatewaySyncService {
  private readonly processedClientEvents = new Map<
    string,
    GatewaySyncActionResult
  >();
  private cursorSeq = 1;

  constructor(
    @Inject(GatewayGamificationService)
    private readonly gamificationService: GatewayGamificationService,
    @Inject(GatewayResourceService)
    private readonly resourceService: GatewayResourceService,
    @Inject(GatewayRecommendationService)
    private readonly recommendationService: GatewayRecommendationService,
    @Inject(GatewayStudentService)
    private readonly studentService: GatewayStudentService,
    @Inject(GatewaySurveyService)
    private readonly surveyService: GatewaySurveyService,
  ) {}

  bootstrap(studentId: string): GatewaySyncBootstrapResponse {
    this.studentService.getProfile(studentId);
    const missions = this.gamificationService.listStudentMissions(studentId, {
      filter: 'all',
    });
    const published = this.resourceService.listPublished();
    const recommendations =
      this.recommendationService.listForStudent(studentId);
    const recovery = this.gamificationService.getRecoveryState(studentId);
    const nowIso = new Date().toISOString();

    return {
      studentId,
      serverCursor: `cursor-v1-${this.cursorSeq}`,
      bootstrappedAt: nowIso,
      missionsCount: missions.length,
      publishedResourcesCount: published.length,
      recommendationsCount: recommendations.length,
      recoveryActive: recovery.isRecoveryActive,
    };
  }

  pull(studentId: string, sinceCursor?: string): GatewaySyncPullResponse {
    const nowIso = new Date().toISOString();
    const currentCursor = `cursor-v1-${this.cursorSeq}`;
    return {
      studentId,
      serverCursor: currentCursor,
      pulledAt: nowIso,
      changesCount: sinceCursor === currentCursor ? 0 : 1,
    };
  }

  syncActions(
    studentId: string,
    actions: GatewayOutboxItem[],
  ): GatewaySyncBatchResponse {
    if (!Array.isArray(actions)) {
      throw new BadRequestException(
        'El lote de sincronización debe incluir un arreglo de acciones.',
      );
    }

    const results: GatewaySyncActionResult[] = [];
    for (const item of actions) {
      if (!item.clientEventId || !item.clientEventId.trim()) {
        throw new BadRequestException(
          'Cada acción offline debe incluir un clientEventId único.',
        );
      }
      const key = `${studentId}:${item.clientEventId}`;
      const existing = this.processedClientEvents.get(key);
      if (existing) {
        results.push({
          ...existing,
          status: 'IDEMPOTENT_DUPLICATE',
        });
        continue;
      }

      const nowIso = new Date().toISOString();
      let status: 'APPLIED' | 'CONFLICT_RESOLVED' = 'APPLIED';
      const missionCode = String(item.payload?.missionCode ?? 'MIS-PLAN-01');

      if (item.actionType === 'MISSION_ACCEPT') {
        this.gamificationService.acceptMission(
          studentId,
          missionCode,
          item.clientEventId,
        );
      } else if (item.actionType === 'MISSION_START') {
        this.gamificationService.startMission(
          studentId,
          missionCode,
          item.clientEventId,
        );
      } else if (item.actionType === 'MISSION_PAUSE') {
        this.gamificationService.pauseMission(
          studentId,
          missionCode,
          item.clientEventId,
        );
      } else if (item.actionType === 'MISSION_SKIP') {
        this.gamificationService.skipMission(
          studentId,
          missionCode,
          String(item.payload?.reason ?? 'Pospuesta offline'),
          item.clientEventId,
        );
      } else if (item.actionType === 'MISSION_COMPLETE') {
        const res = this.gamificationService.completeMission(
          studentId,
          missionCode,
          String(item.payload?.reflectionNote ?? ''),
          item.clientEventId,
        );
        if (res.idempotentReplay) {
          status = 'CONFLICT_RESOLVED';
        }
      } else if (item.actionType === 'SURVEY_SUBMIT') {
        const surveyCode = (item.payload?.surveyCode ??
          'SUR-WEEKLY-V1') as GatewaySurveyCode;
        const answers = (item.payload?.answers ?? [
          { questionId: 'weekly_load_manageable', numericValue: 4 },
          { questionId: 'weekly_missions_helpful', numericValue: 4 },
          {
            questionId: 'weekly_main_obstacle',
            choiceValue: 'ORGANIZACION_TIEMPO',
          },
        ]) as GatewaySurveyAnswer[];
        this.surveyService.submitResponse(
          studentId,
          surveyCode,
          answers,
          item.clientEventId,
        );
      } else if (item.actionType === 'RECOVERY_ACTIVATE') {
        this.gamificationService.activateRecovery(
          studentId,
          'MICRO_MISSION_5M',
        );
      }

      const applied: GatewaySyncActionResult = {
        clientEventId: item.clientEventId,
        actionType: item.actionType,
        status,
        serverTimestamp: nowIso,
      };
      this.processedClientEvents.set(key, applied);
      results.push(applied);
    }

    this.cursorSeq += 1;
    return {
      processedCount: results.length,
      serverCursor: `cursor-v1-${this.cursorSeq}`,
      results,
    };
  }
}
