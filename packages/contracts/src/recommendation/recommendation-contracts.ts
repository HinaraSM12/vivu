import type { StudentRecommendationAction } from '../resource/resource-contracts';

export const RECOMMENDATION_SOURCES = [
  'ONLINE_RULES',
  'ONLINE_AI',
  'OFFLINE_RULES',
] as const;
export type RecommendationSource = (typeof RECOMMENDATION_SOURCES)[number];

export const RECOMMENDATION_REASON_CODES = [
  'PRIORITY_ALIGNMENT',
  'TIME_FIT',
  'RECOVERY_LIGHT_LOAD',
  'VERIFIED_RESOURCE_MATCH',
  'CONTINUITY_REENGAGEMENT',
] as const;
export type RecommendationReasonCode =
  (typeof RECOMMENDATION_REASON_CODES)[number];

export const FORBIDDEN_STIGMATIZING_TERMS = [
  'desertor',
  'deserción inminente',
  'alto riesgo de abandono',
  'estudiante en riesgo',
  'fracaso académico',
  'incapaz',
  'diagnóstico depresivo',
  'trastorno clínico',
] as const;

export interface RecommendationScoreBreakdownDto {
  needFit: number;
  timeFit: number;
  difficultyFit: number;
  continuityFit: number;
  resourceFit: number;
  diversityFit: number;
}

export interface RecommendationWeightConfigDto {
  version: string;
  needFit: number;
  timeFit: number;
  difficultyFit: number;
  continuityFit: number;
  resourceFit: number;
  diversityFit: number;
  maxRecommendationsPerRun: number;
}

export const DEFAULT_RECOMMENDATION_WEIGHT_CONFIG: RecommendationWeightConfigDto =
  {
    version: '1.0.0',
    needFit: 0.3,
    timeFit: 0.2,
    difficultyFit: 0.15,
    continuityFit: 0.15,
    resourceFit: 0.15,
    diversityFit: 0.05,
    maxRecommendationsPerRun: 3,
  };

export interface RecommendationItemDto {
  recommendationId: string;
  studentId: string;
  participantIdPseudonym: string;
  missionId: string;
  resourceId: string | null;
  resourceTitle: string | null;
  category: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  estimatedMinutes: number;
  title: string;
  summary: string;
  whyThisRecommendation: string;
  reasonCode: RecommendationReasonCode;
  score: number;
  scoreBreakdown: RecommendationScoreBreakdownDto;
  source: RecommendationSource;
  ruleVersion: string;
  promptVersion: string | null;
  modelVersion: string | null;
  fallbackUsed: boolean;
  studentAction: StudentRecommendationAction | null;
  editedNotes: string | null;
  postponedUntil: string | null;
  shownAt: string;
  actedAt: string | null;
}

export interface RecordRecommendationActionRequest {
  action: StudentRecommendationAction;
  editedNotes?: string;
  postponedUntil?: string;
  clientEventId?: string;
}

export function computeDeterministicRecommendationScore(
  breakdown: RecommendationScoreBreakdownDto,
  weights: RecommendationWeightConfigDto = DEFAULT_RECOMMENDATION_WEIGHT_CONFIG,
): number {
  const raw =
    weights.needFit * breakdown.needFit +
    weights.timeFit * breakdown.timeFit +
    weights.difficultyFit * breakdown.difficultyFit +
    weights.continuityFit * breakdown.continuityFit +
    weights.resourceFit * breakdown.resourceFit +
    weights.diversityFit * breakdown.diversityFit;
  return Math.round(raw * 1000) / 1000;
}

export function validateNonStigmatizingRationale(text: string): {
  valid: boolean;
  matchedForbiddenTerm: string | null;
} {
  const normalized = text.toLowerCase();
  for (const term of FORBIDDEN_STIGMATIZING_TERMS) {
    if (normalized.includes(term)) {
      return { valid: false, matchedForbiddenTerm: term };
    }
  }
  return { valid: true, matchedForbiddenTerm: null };
}
