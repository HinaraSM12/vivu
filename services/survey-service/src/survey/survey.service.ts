import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SurveyRepository } from './survey.repository';
import type {
  SurveyAnswerInput,
  SurveyDefinitionEntity,
  SurveyResponseEntity,
} from './survey.types';

@Injectable()
export class SurveyService {
  constructor(
    @Inject(SurveyRepository)
    private readonly repository: SurveyRepository,
  ) {}

  listDefinitions(): SurveyDefinitionEntity[] {
    return this.repository.getDefinitions();
  }

  getDefinition(code: string): SurveyDefinitionEntity {
    const found = this.repository.getDefinitionByCode(code);
    if (!found) {
      throw new NotFoundException({
        code: 'SURVEY_NOT_FOUND',
        message: `No se encontró el microcuestionario (${code}).`,
      });
    }
    return found;
  }

  submitResponse(
    studentId: string,
    code: string,
    answers: SurveyAnswerInput[],
    options?: {
      clientEventId?: string;
      correlationId?: string;
    },
  ): SurveyResponseEntity {
    const replay = this.repository.getIdempotentResponse(
      studentId,
      options?.clientEventId,
    );
    if (replay) {
      return replay;
    }

    const definition = this.getDefinition(code);
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new BadRequestException({
        code: 'SURVEY_ANSWERS_REQUIRED',
        message: 'Debes responder las preguntas obligatorias del microcuestionario.',
      });
    }

    const now = new Date().toISOString();
    const record: SurveyResponseEntity = {
      responseId: randomUUID(),
      studentId,
      surveyCode: definition.code,
      surveyVersion: definition.version,
      answers,
      submittedAt: now,
      clientEventId: options?.clientEventId,
      idempotentReplay: false,
    };

    this.repository.saveResponse(record);

    const subjectId = this.repository.getAnalyticsSubjectId(studentId);
    this.repository.recordDomainEvent({
      eventId: randomUUID(),
      eventType: 'survey.submitted.v1',
      occurredAt: now,
      actorId: subjectId,
      subjectId,
      correlationId: options?.correlationId ?? randomUUID(),
      schemaVersion: 1,
      clientEventId: options?.clientEventId,
      payload: {
        surveyCode: definition.code,
        surveyVersion: definition.version,
        answeredItemsCount: answers.length,
      },
    });

    return record;
  }

  listStudentResponses(studentId: string): SurveyResponseEntity[] {
    return this.repository.getStudentResponses(studentId);
  }
}

