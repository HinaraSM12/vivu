import { describe, expect, it } from 'vitest';
import {
  evaluateOfflineRuleRecommendationParity,
  OFFLINE_ACTION_TYPES,
  OUTBOX_ACTION_STATUSES,
} from './sync-contracts';

describe('sync-contracts', () => {
  it('maintains exact mathematical parity between OFFLINE_RULES and Python ONLINE_RULES v1.0.0', () => {
    const result = evaluateOfflineRuleRecommendationParity({
      needFit: 1.0,
      timeFit: 1.0,
      difficultyFit: 1.0,
      continuityFit: 0.85,
      resourceFit: 1.0,
      diversityFit: 0.9,
    });
    expect(result.source).toBe('OFFLINE_RULES');
    expect(result.ruleVersion).toBe('1.0.0');
    expect(result.score).toBeCloseTo(0.973, 3);
  });

  it('defines canonical offline action types and outbox statuses', () => {
    expect(OFFLINE_ACTION_TYPES).toContain('MISSION_COMPLETE');
    expect(OFFLINE_ACTION_TYPES).toContain('SURVEY_SUBMIT');
    expect(OUTBOX_ACTION_STATUSES).toEqual([
      'PENDING',
      'SYNCING',
      'SYNCED',
      'CONFLICT_RESOLVED',
      'FAILED',
    ]);
  });
});
