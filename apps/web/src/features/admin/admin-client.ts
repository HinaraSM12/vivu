export interface AdminRecommenderWeightsView {
  version: string;
  needFit: number;
  timeFit: number;
  difficultyFit: number;
  continuityFit: number;
  resourceFit: number;
  diversityFit: number;
}

export interface AdminPilotFeatureFlagsView {
  llmContextualizationEnabled: boolean;
  offlineSyncEnabled: boolean;
  recoveryModeEnabled: boolean;
  weeklyMicroSurveyEnabled: boolean;
}

export interface AdminAuditLogView {
  auditId: string;
  adminUserId: string;
  action: string;
  targetEntity: string;
  createdAt: string;
}

export interface AdminAnonymizedExportView {
  exportId: string;
  generatedAt: string;
  schemaVersion: '1.0.0';
  containsPii: false;
  participantCount: number;
  records: Array<{
    participantIdPseudonym: string;
    cohortSemester: number;
    completedMissionsCount: number;
    acceptedRecommendationsCount: number;
    recoveryActivationsCount: number;
    weeklySurveysCompletedCount: number;
  }>;
}

export class LocalAdminClient {
  private weights: AdminRecommenderWeightsView = {
    version: '1.0.0',
    needFit: 0.3,
    timeFit: 0.2,
    difficultyFit: 0.15,
    continuityFit: 0.15,
    resourceFit: 0.15,
    diversityFit: 0.05,
  };

  private flags: AdminPilotFeatureFlagsView = {
    llmContextualizationEnabled: true,
    offlineSyncEnabled: true,
    recoveryModeEnabled: true,
    weeklyMicroSurveyEnabled: true,
  };

  private auditLogs: AdminAuditLogView[] = [
    {
      auditId: 'aud-seed-001',
      adminUserId: '00000000-0000-4000-8000-000000000001',
      action: 'INITIALIZE_PILOT_DEFAULTS',
      targetEntity: 'recommender-config',
      createdAt: '2026-11-01T10:00:00.000Z',
    },
  ];

  private lastExport: AdminAnonymizedExportView | null = null;

  getState() {
    return {
      weights: { ...this.weights },
      flags: { ...this.flags },
      auditLogs: [...this.auditLogs],
      lastExport: this.lastExport,
    };
  }

  updateWeights(
    adminUserId: string,
    next: Omit<AdminRecommenderWeightsView, 'version'>,
  ) {
    const total =
      Math.round(
        (next.needFit +
          next.timeFit +
          next.difficultyFit +
          next.continuityFit +
          next.resourceFit +
          next.diversityFit) *
          1000,
      ) / 1000;

    if (Math.abs(total - 1.0) > 0.001) {
      throw new Error(
        `La suma de los pesos del recomendador debe ser 1.00 (actual: ${total}).`,
      );
    }

    this.weights = {
      version: `1.0.${this.auditLogs.length}`,
      ...next,
    };

    this.auditLogs.unshift({
      auditId: `aud-${Date.now()}`,
      adminUserId,
      action: 'UPDATE_RECOMMENDER_CONFIG',
      targetEntity: `recommender:${this.weights.version}`,
      createdAt: new Date().toISOString(),
    });

    return this.getState();
  }

  generateExport(adminUserId: string): AdminAnonymizedExportView {
    const created: AdminAnonymizedExportView = {
      exportId: `exp-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      schemaVersion: '1.0.0',
      containsPii: false,
      participantCount: 3,
      records: [
        {
          participantIdPseudonym: 'pseudo-stu-001',
          cohortSemester: 3,
          completedMissionsCount: 2,
          acceptedRecommendationsCount: 2,
          recoveryActivationsCount: 0,
          weeklySurveysCompletedCount: 1,
        },
        {
          participantIdPseudonym: 'pseudo-stu-002',
          cohortSemester: 4,
          completedMissionsCount: 1,
          acceptedRecommendationsCount: 1,
          recoveryActivationsCount: 1,
          weeklySurveysCompletedCount: 1,
        },
        {
          participantIdPseudonym: 'pseudo-stu-003',
          cohortSemester: 1,
          completedMissionsCount: 0,
          acceptedRecommendationsCount: 1,
          recoveryActivationsCount: 0,
          weeklySurveysCompletedCount: 1,
        },
      ],
    };

    this.lastExport = created;
    this.auditLogs.unshift({
      auditId: `aud-${Date.now()}`,
      adminUserId,
      action: 'EXPORT_ANONYMIZED_RESEARCH_DATASET',
      targetEntity: `export:${created.exportId}`,
      createdAt: created.generatedAt,
    });

    return created;
  }
}

export const defaultAdminClient = new LocalAdminClient();

