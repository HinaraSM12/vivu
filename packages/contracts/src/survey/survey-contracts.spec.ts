import { describe, expect, it } from 'vitest';
import {
  RECOVERY_CHOICE_CODES,
  SURVEY_CODES,
  validateSurveyQuestionsCount,
} from './survey-contracts';

describe('survey-contracts & recovery choices', () => {
  it('exposes the approved micro-survey codes and non-punitive recovery choices', () => {
    expect(SURVEY_CODES).toEqual(['SUR-WEEKLY-V1', 'SUR-RECOVERY-V1']);
    expect(RECOVERY_CHOICE_CODES).toEqual([
      'MICRO_MISSION_5M',
      'REORGANIZE_PRIORITY',
      'CONSULT_RESOURCE',
      'REQUEST_SUPPORT',
      'LATER',
    ]);
  });

  it('enforces micro-surveys to contain between 1 and 5 questions maximum', () => {
    expect(validateSurveyQuestionsCount([])).toBe(false);
    expect(
      validateSurveyQuestionsCount([
        {
          questionId: 'q1',
          prompt: '¿Qué tan manejable sientes tu carga académica esta semana?',
          kind: 'likert_1_5',
          required: true,
        },
      ]),
    ).toBe(true);
    expect(
      validateSurveyQuestionsCount(
        Array.from({ length: 6 }, (_, idx) => ({
          questionId: `q${idx}`,
          prompt: 'Item',
          kind: 'likert_1_5' as const,
          required: true,
        })),
      ),
    ).toBe(false);
  });
});

