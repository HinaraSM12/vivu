import {
  computeDeterministicRecommendationScore,
  DEFAULT_RECOMMENDATION_WEIGHT_CONFIG,
  type RecommendationScoreBreakdownDto,
} from '../recommendation/recommendation-contracts';

export const OFFLINE_ACTION_TYPES = [
  'MISSION_ACCEPT',
  'MISSION_START',
  'MISSION_PAUSE',
  'MISSION_SKIP',
  'MISSION_COMPLETE',
  'SURVEY_SUBMIT',
  'RECOVERY_ACTIVATE',
  'RECOMMENDATION_ACTION',
  'PROFILE_UPDATE',
] as const;
export type OfflineActionType = (typeof OFFLINE_ACTION_TYPES)[number];

export const OUTBOX_ACTION_STATUSES = [
  'PENDING',
  'SYNCING',
  'SYNCED',
  'CONFLICT_RESOLVED',
  'FAILED',
] as const;
export type OutboxActionStatus = (typeof OUTBOX_ACTION_STATUSES)[number];

export interface OutboxItemDto {
  clientEventId: string;
  studentId: string;
  actionType: OfflineActionType;
  occurredAt: string;
  payload: Record<string, unknown>;
  status: OutboxActionStatus;
  retryCount: number;
  lastError?: string | null;
}

export interface SyncActionResultDto {
  clientEventId: string;
  actionType: OfflineActionType;
  status: 'APPLIED' | 'IDEMPOTENT_DUPLICATE' | 'CONFLICT_RESOLVED';
  serverTimestamp: string;
}

export interface SyncActionsBatchRequestDto {
  actions: OutboxItemDto[];
}

export interface SyncActionsBatchResponseDto {
  processedCount: number;
  serverCursor: string;
  results: SyncActionResultDto[];
}

export interface SyncBootstrapResponseDto {
  studentId: string;
  serverCursor: string;
  bootstrappedAt: string;
  missionsCount: number;
  publishedResourcesCount: number;
  recommendationsCount: number;
  recoveryActive: boolean;
}

export interface SyncPullResponseDto {
  studentId: string;
  serverCursor: string;
  pulledAt: string;
  changesCount: number;
}

export function evaluateOfflineRuleRecommendationParity(
  breakdown: RecommendationScoreBreakdownDto,
): {
  score: number;
  source: 'OFFLINE_RULES';
  ruleVersion: string;
} {
  return {
    score: computeDeterministicRecommendationScore(
      breakdown,
      DEFAULT_RECOMMENDATION_WEIGHT_CONFIG,
    ),
    source: 'OFFLINE_RULES',
    ruleVersion: DEFAULT_RECOMMENDATION_WEIGHT_CONFIG.version,
  };
}

