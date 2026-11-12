export type SurveyCode = 'SUR-WEEKLY-V1' | 'SUR-RECOVERY-V1';

export interface SurveyQuestionEntity {
  questionId: string;
  prompt: string;
  kind: 'likert_1_5' | 'single_choice' | 'optional_text';
  required: boolean;
  options?: string[];
}

export interface SurveyDefinitionEntity {
  code: SurveyCode;
  version: number;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  questions: SurveyQuestionEntity[];
}

export interface SurveyAnswerInput {
  questionId: string;
  numericValue?: 1 | 2 | 3 | 4 | 5;
  choiceValue?: string;
  textValue?: string;
}

export interface SurveyResponseEntity {
  responseId: string;
  studentId: string;
  surveyCode: SurveyCode;
  surveyVersion: number;
  answers: SurveyAnswerInput[];
  submittedAt: string;
  clientEventId?: string;
  idempotentReplay: boolean;
}

export interface DomainEventRecord {
  eventId: string;
  eventType: string;
  occurredAt: string;
  actorId: string;
  subjectId: string;
  correlationId: string;
  schemaVersion: number;
  clientEventId?: string;
  payload: Record<string, unknown>;
}

