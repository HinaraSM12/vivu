import { describe, expect, it } from 'vitest';
import { DEFAULT_RECOMMENDATION_WEIGHT_CONFIG } from '../recommendation/recommendation-contracts';
import {
  findForbiddenPiiKeysInExport,
  validateRecommenderWeightsSum,
} from './admin-contracts';

describe('admin-contracts', () => {
  it('validates that recommender weights sum to 1.00', () => {
    expect(
      validateRecommenderWeightsSum(DEFAULT_RECOMMENDATION_WEIGHT_CONFIG),
    ).toEqual({
      valid: true,
      total: 1,
    });
    expect(
      validateRecommenderWeightsSum({
        ...DEFAULT_RECOMMENDATION_WEIGHT_CONFIG,
        needFit: 0.6,
      }).valid,
    ).toBe(false);
  });

  it('detects any forbidden PII fields in research dataset exports', () => {
    expect(
      findForbiddenPiiKeysInExport([
        {
          participantIdPseudonym: 'pseudo-stu-001',
          completedMissionsCount: 3,
        },
      ]),
    ).toEqual([]);

    expect(
      findForbiddenPiiKeysInExport([
        {
          participantIdPseudonym: 'pseudo-stu-001',
          email: 'est.activo@vivu.local',
        },
      ]),
    ).toEqual(['email']);
  });
});

