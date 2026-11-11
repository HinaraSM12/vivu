import { describe, expect, it } from 'vitest';
import {
  computeProgressLevel,
  findForbiddenCompetitiveFields,
  MISSION_CATEGORY_CODES,
} from './gamification-contracts';

describe('gamification-contracts', () => {
  it('computes non-competitive personal progress levels according to ruleVersion 1.0.0', () => {
    expect(computeProgressLevel(0)).toEqual({
      levelNumber: 1,
      levelCode: 'EXPLORATION',
      levelTitle: 'Exploración',
      nextLevelTargetMissions: 3,
    });
    expect(computeProgressLevel(2).levelNumber).toBe(1);
    expect(computeProgressLevel(3)).toEqual({
      levelNumber: 2,
      levelCode: 'INITIAL_CONSISTENCY',
      levelTitle: 'Constancia inicial',
      nextLevelTargetMissions: 7,
    });
    expect(computeProgressLevel(7).levelNumber).toBe(3);
    expect(computeProgressLevel(13)).toEqual({
      levelNumber: 4,
      levelCode: 'CONSOLIDATED_SELF_REGULATION',
      levelTitle: 'Autorregulación consolidada',
      nextLevelTargetMissions: null,
    });
  });

  it('exposes the 5 approved mission categories and detects forbidden competitive ranking fields', () => {
    expect(MISSION_CATEGORY_CODES).toEqual([
      'PLANNING',
      'STUDY_HABITS',
      'ACADEMIC_SUPPORT',
      'WELLBEING_BALANCE',
      'CAMPUS_INTEGRATION',
    ]);

    expect(
      findForbiddenCompetitiveFields({
        levelNumber: 2,
        leaderboardPosition: 4,
        percentile: 85,
      }),
    ).toEqual(['leaderboardPosition', 'percentile']);
  });
});

