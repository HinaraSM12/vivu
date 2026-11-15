import type { RecommendationWeightConfigDto } from '../recommendation/recommendation-contracts';

export interface PilotFeatureFlagsDto {
  llmContextualizationEnabled: boolean;
  offlineSyncEnabled: boolean;
  recoveryModeEnabled: boolean;
  weeklyMicroSurveyEnabled: boolean;
}

export interface AdminAuditLogEntryDto {
  auditId: string;
  adminUserId: string;
  action: string;
  targetEntity: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface AnonymizedParticipantRowDto {
  participantIdPseudonym: string;
  cohortSemester: number;
  completedMissionsCount: number;
  acceptedRecommendationsCount: number;
  recoveryActivationsCount: number;
  weeklySurveysCompletedCount: number;
}

export interface AnonymizedResearchExportDto {
  exportId: string;
  generatedAt: string;
  generatedByAdminId: string;
  schemaVersion: '1.0.0';
  containsPii: false;
  participantCount: number;
  records: AnonymizedParticipantRowDto[];
}

export const FORBIDDEN_PII_EXPORT_KEYS = [
  'email',
  'fullName',
  'firstName',
  'lastName',
  'phone',
  'institutionalIdNumber',
  'documentNumber',
  'passwordHash',
] as const;

export function validateRecommenderWeightsSum(
  weights: Pick<
    RecommendationWeightConfigDto,
    | 'needFit'
    | 'timeFit'
    | 'difficultyFit'
    | 'continuityFit'
    | 'resourceFit'
    | 'diversityFit'
  >,
): { valid: boolean; total: number } {
  const total =
    Math.round(
      (weights.needFit +
        weights.timeFit +
        weights.difficultyFit +
        weights.continuityFit +
        weights.resourceFit +
        weights.diversityFit) *
        1000,
    ) / 1000;
  return {
    valid: Math.abs(total - 1.0) <= 0.001,
    total,
  };
}

export function findForbiddenPiiKeysInExport(
  records: readonly Record<string, unknown>[],
): string[] {
  const found = new Set<string>();
  for (const row of records) {
    for (const key of Object.keys(row)) {
      if (
        (FORBIDDEN_PII_EXPORT_KEYS as readonly string[]).includes(key)
      ) {
        found.add(key);
      }
    }
  }
  return Array.from(found);
}

