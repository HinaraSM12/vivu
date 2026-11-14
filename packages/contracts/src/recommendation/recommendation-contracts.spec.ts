import { describe, expect, it } from 'vitest';
import {
  computeDeterministicRecommendationScore,
  DEFAULT_RECOMMENDATION_WEIGHT_CONFIG,
  RECOMMENDATION_REASON_CODES,
  RECOMMENDATION_SOURCES,
  validateNonStigmatizingRationale,
} from './recommendation-contracts';

describe('recommendation-contracts', () => {
  it('computes deterministic score using ruleVersion 1.0.0 weights', () => {
    const score = computeDeterministicRecommendationScore({
      needFit: 1.0,
      timeFit: 0.9,
      difficultyFit: 1.0,
      continuityFit: 0.8,
      resourceFit: 1.0,
      diversityFit: 0.8,
    });
    expect(DEFAULT_RECOMMENDATION_WEIGHT_CONFIG.version).toBe('1.0.0');
    expect(DEFAULT_RECOMMENDATION_WEIGHT_CONFIG.maxRecommendationsPerRun).toBe(
      3,
    );
    expect(score).toBeCloseTo(0.94, 3);
  });

  it('validates non-stigmatizing rationale and rejects dropout-labeling language', () => {
    expect(
      validateNonStigmatizingRationale(
        'Te sugerimos esta misión porque coincide con tu prioridad de organización del tiempo y tu disponibilidad de 15 minutos.',
      ),
    ).toEqual({ valid: true, matchedForbiddenTerm: null });

    expect(
      validateNonStigmatizingRationale(
        'Fuiste clasificado como estudiante en riesgo con deserción inminente.',
      ).valid,
    ).toBe(false);
  });

  it('exposes canonical sources and reason codes', () => {
    expect(RECOMMENDATION_SOURCES).toEqual([
      'ONLINE_RULES',
      'ONLINE_AI',
      'OFFLINE_RULES',
    ]);
    expect(RECOMMENDATION_REASON_CODES).toContain('RECOVERY_LIGHT_LOAD');
  });
});
