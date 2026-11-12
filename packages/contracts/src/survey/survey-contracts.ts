export const SURVEY_CODES = ['SUR-WEEKLY-V1', 'SUR-RECOVERY-V1'] as const;

export type SurveyCode = (typeof SURVEY_CODES)[number];

export const RECOVERY_CHOICE_CODES = [
  'MICRO_MISSION_5M',
  'REORGANIZE_PRIORITY',
  'CONSULT_RESOURCE',
  'REQUEST_SUPPORT',
  'LATER',
] as const;

export type RecoveryChoiceCode = (typeof RECOVERY_CHOICE_CODES)[number];

export interface SurveyQuestionDto {
  questionId: string;
  prompt: string;
  kind: 'likert_1_5' | 'single_choice' | 'optional_text';
  required: boolean;
  options?: string[];
}

export interface SurveyDefinitionDto {
  code: SurveyCode;
  version: number;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  questions: SurveyQuestionDto[];
}

export interface SurveyAnswerDto {
  questionId: string;
  numericValue?: 1 | 2 | 3 | 4 | 5;
  choiceValue?: string;
  textValue?: string;
}

export interface SubmitSurveyRequest {
  answers: SurveyAnswerDto[];
  clientEventId?: string;
}

export interface SurveyResponseRecordDto {
  responseId: string;
  studentId: string;
  surveyCode: SurveyCode;
  surveyVersion: number;
  answers: SurveyAnswerDto[];
  submittedAt: string;
  clientEventId?: string;
  idempotentReplay: boolean;
}

export interface RecoveryStateDto {
  studentId: string;
  isRecoveryActive: boolean;
  continuitySignal: 'active' | 'gentle_pause' | 'recovery_suggested';
  headline: string;
  supportiveCopy: string;
  lastActivatedAt: string | null;
  selectedChoice: RecoveryChoiceCode | null;
  recommendedRecoveryMissionCodes: string[];
  recommendedResourceCodes: string[];
}

export interface ActivateRecoveryRequest {
  choice: RecoveryChoiceCode;
  note?: string;
  clientEventId?: string;
}

export function validateSurveyQuestionsCount(
  questions: readonly SurveyQuestionDto[],
): boolean {
  return questions.length >= 1 && questions.length <= 5;
}

