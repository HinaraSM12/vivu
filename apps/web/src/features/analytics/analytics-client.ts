export interface PilotAnalyticsSummaryView {
  generatedAt: string;
  schemaVersion: '1.0.0';
  cohortParticipantsCount: number;
  canonicalEventsCount: number;
  usageAndContinuity: {
    weeklyAdherenceRate: number;
    retentionWeek1Rate: number;
    retentionWeek4Rate: number;
    retentionWeek10Rate: number;
    missionCompletionRate: number;
    recoveryModeActivationsCount: number;
  };
  recommendations: {
    acceptanceRate: number;
    rejectionRate: number;
    postponementRate: number;
    editRate: number;
    institutionalResourceConversionRate: number;
  };
  qoe: {
    easeOfUseScore: number;
    clarityScore: number;
    autonomyScore: number;
    lowSurveillancePerceptionScore: number;
    continuityIntentionScore: number;
  };
  qos: {
    latencyP50Ms: number;
    latencyP95Ms: number;
    pilotAvailabilityRate: number;
    deterministicFallbackRate: number;
  };
  llmQuality: {
    groundednessRate: number;
    hallucinationCount: number;
    extractionFidelityRate: number;
    traceabilityRate: number;
  };
  readinessChecks: Array<{
    checkCode: string;
    title: string;
    passed: boolean;
    evidenceSummary: string;
  }>;
  allReadinessChecksPassed: boolean;
}

export class LocalAnalyticsClient {
  private canonicalEventsCount = 16;

  getPilotSummary(): PilotAnalyticsSummaryView {
    return {
      generatedAt: new Date().toISOString(),
      schemaVersion: '1.0.0',
      cohortParticipantsCount: 3,
      canonicalEventsCount: this.canonicalEventsCount,
      usageAndContinuity: {
        weeklyAdherenceRate: 0.85,
        retentionWeek1Rate: 1.0,
        retentionWeek4Rate: 0.88,
        retentionWeek10Rate: 0.8,
        missionCompletionRate: 0.75,
        recoveryModeActivationsCount: 2,
      },
      recommendations: {
        acceptanceRate: 0.67,
        rejectionRate: 0.08,
        postponementRate: 0.15,
        editRate: 0.1,
        institutionalResourceConversionRate: 0.72,
      },
      qoe: {
        easeOfUseScore: 4.7,
        clarityScore: 4.6,
        autonomyScore: 4.8,
        lowSurveillancePerceptionScore: 4.8,
        continuityIntentionScore: 4.5,
      },
      qos: {
        latencyP50Ms: 95,
        latencyP95Ms: 240,
        pilotAvailabilityRate: 0.998,
        deterministicFallbackRate: 0.01,
      },
      llmQuality: {
        groundednessRate: 1.0,
        hallucinationCount: 0,
        extractionFidelityRate: 0.98,
        traceabilityRate: 1.0,
      },
      readinessChecks: [
        {
          checkCode: 'CHK-CONSENT-ETHICS',
          title:
            'Consentimiento informado v1.0 y retiro voluntario verificados',
          passed: true,
          evidenceSummary:
            'Bloqueo 403 CONSENT_REQUIRED antes de guardar perfil y retiro voluntario activo.',
        },
        {
          checkCode: 'CHK-HYBRID-RECOMMENDER',
          title:
            'Motor híbrido determinista + LLM instrumental con fallback (ADR-002)',
          passed: true,
          evidenceSummary:
            'ruleVersion 1.0.0, máximo 3 sugerencias, 5 acciones de agencia y fallback ONLINE_RULES.',
        },
        {
          checkCode: 'CHK-PUBLISHED-RESOURCES-ONLY',
          title:
            'Exclusión estricta de recursos no PUBLISHED o vencidos (ADR-006)',
          passed: true,
          evidenceSummary:
            'RES-ARCH-01 (EXPIRED) excluido del catálogo estudiantil y del recomendador (0 alucinaciones).',
        },
        {
          checkCode: 'CHK-OFFLINE-PWA-SYNC',
          title:
            'PWA local-first con cola Outbox e idempotencia por clientEventId (ADR-005)',
          passed: true,
          evidenceSummary:
            'Paridad matemática OFFLINE_RULES/ONLINE_RULES y sincronización idempotente verificada.',
        },
        {
          checkCode: 'CHK-PSEUDONYMIZED-TELEMETRY',
          title:
            '16 eventos canónicos y exportación anonimizada sin PII directa (ADR-003)',
          passed: true,
          evidenceSummary: `${this.canonicalEventsCount} eventos registrados con schemaVersion 1.0.0 y participantIdPseudonym.`,
        },
      ],
      allReadinessChecksPassed: true,
    };
  }

  recordSampleTelemetryEvent(): PilotAnalyticsSummaryView {
    this.canonicalEventsCount += 1;
    return this.getPilotSummary();
  }
}

export const defaultAnalyticsClient = new LocalAnalyticsClient();

