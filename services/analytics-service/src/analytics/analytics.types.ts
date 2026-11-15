export const CANONICAL_TELEMETRY_EVENT_NAMES = [
  'user.registered.v1',
  'consent.updated.v1',
  'student.profile_updated.v1',
  'mission.assigned.v1',
  'mission.accepted.v1',
  'mission.completed.v1',
  'mission.skipped.v1',
  'recovery.activated.v1',
  'resource.viewed.v1',
  'resource.submitted.v1',
  'resource.moderated.v1',
  'survey.submitted.v1',
  'recommendation.generated.v1',
  'recommendation.feedback_submitted.v1',
  'facilitator.note_created.v1',
  'commitment.updated.v1',
] as const;

export type CanonicalTelemetryEventName =
  (typeof CANONICAL_TELEMETRY_EVENT_NAMES)[number];

export interface TelemetryEnvelopeRecord {
  eventId: string;
  eventName: CanonicalTelemetryEventName;
  schemaVersion: '1.0.0';
  occurredAt: string;
  correlationId: string;
  participantIdPseudonym: string;
  payload: Record<string, unknown>;
}

export interface PilotEvaluationDashboard {
  generatedAt: string;
  schemaVersion: '1.0.0';
  cohortParticipantsCount: number;
  canonicalEventsCount: number;
  usageAndContinuity: {
    weeklyAdherenceRate: number;
    retentionWeek1Rate: number;
    retentionWeek4Rate: number;
    retentionWeek10Rate: number;
    missionsShownCount: number;
    missionsAcceptedCount: number;
    missionsCompletedCount: number;
    missionCompletionRate: number;
    returnAfterInterruptionRate: number;
    recoveryModeActivationsCount: number;
    selfRegulationContinuityRate: number;
  };
  recommendations: {
    acceptanceRate: number;
    rejectionRate: number;
    postponementRate: number;
    editRate: number;
    perceivedRelevanceScore: number;
    perceivedUsefulnessScore: number;
    institutionalResourceConversionRate: number;
    reportedResourceUseRate: number;
  };
  qoe: {
    easeOfUseScore: number;
    clarityScore: number;
    perceivedEffortScore: number;
    satisfactionScore: number;
    usefulnessScore: number;
    relevanceScore: number;
    trustScore: number;
    autonomyScore: number;
    comprehensionScore: number;
    lowFrustrationScore: number;
    lowPressureScore: number;
    lowSaturationScore: number;
    lowSurveillancePerceptionScore: number;
    continuityIntentionScore: number;
  };
  qos: {
    latencyP50Ms: number;
    latencyP95Ms: number;
    errorRate: number;
    timeoutRate: number;
    pilotAvailabilityRate: number;
    llmErrorRate: number;
    deterministicFallbackRate: number;
    resourceUpdateMedianHours: number;
  };
  llmQuality: {
    groundednessRate: number;
    hallucinationCount: number;
    invalidRecommendationCount: number;
    extractionFidelityRate: number;
    clarityScore: number;
    relevanceScore: number;
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

