import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type {
  DomainEventRecord,
  SurveyDefinitionEntity,
  SurveyResponseEntity,
} from './survey.types';

const SEED_SURVEYS: SurveyDefinitionEntity[] = [
  {
    code: 'SUR-WEEKLY-V1',
    version: 1,
    title: 'Check-in semanal de autorregulación y experiencia',
    description:
      'Instrumento breve de seguimiento longitudinal (máximo 4 ítems, < 2 minutos).',
    estimatedDurationMinutes: 2,
    questions: [
      {
        questionId: 'weekly_load_manageable',
        prompt:
          '1. ¿Qué tan manejable sientes tu carga académica esta semana? (1 = muy sobrecargada, 5 = muy manejable)',
        kind: 'likert_1_5',
        required: true,
      },
      {
        questionId: 'weekly_time_fit',
        prompt:
          '2. ¿Las misiones o sugerencias de Vivu se ajustaron a tu tiempo disponible? (1 = nada, 5 = totalmente)',
        kind: 'likert_1_5',
        required: true,
      },
      {
        questionId: 'weekly_concrete_step_low_pressure',
        prompt:
          '3. ¿Sentiste que la aplicación te ayudó a dar al menos un paso concreto sin generarte presión extra? (1 = nada, 5 = totalmente)',
        kind: 'likert_1_5',
        required: true,
      },
      {
        questionId: 'weekly_optional_comment',
        prompt: '4. (Opcional) ¿Qué fue lo más útil o qué cambiarías esta semana?',
        kind: 'optional_text',
        required: false,
      },
    ],
  },
  {
    code: 'SUR-RECOVERY-V1',
    version: 1,
    title: 'Pulso breve de retomada',
    description:
      'Opcional tras usar el modo recuperación (2 ítems, 1 minuto).',
    estimatedDurationMinutes: 1,
    questions: [
      {
        questionId: 'recovery_reachable',
        prompt:
          '1. ¿La opción de recuperación te pareció alcanzable para tu momento actual? (1 = nada, 5 = totalmente)',
        kind: 'likert_1_5',
        required: true,
      },
      {
        questionId: 'recovery_preferred_support',
        prompt:
          '2. ¿Qué tipo de apoyo te resultaría más útil esta semana?',
        kind: 'single_choice',
        required: true,
        options: [
          'Organización',
          'Monitoría',
          'Bienestar',
          'Ir a mi propio ritmo',
        ],
      },
    ],
  },
];

@Injectable()
export class SurveyRepository {
  private readonly definitions = new Map<string, SurveyDefinitionEntity>();
  private readonly responsesByStudent = new Map<
    string,
    SurveyResponseEntity[]
  >();
  private readonly idempotentByKey = new Map<string, SurveyResponseEntity>();
  private readonly analyticsSubjectIds = new Map<string, string>();
  private readonly emittedEvents: DomainEventRecord[] = [];

  constructor() {
    for (const def of SEED_SURVEYS) {
      this.definitions.set(def.code, {
        ...def,
        questions: def.questions.map((q) => ({ ...q })),
      });
    }
    this.analyticsSubjectIds.set('usr-stu-001', 'sub-anon-stu-001');
    this.analyticsSubjectIds.set(
      '00000000-0000-4000-8000-000000000004',
      'sub-anon-stu-001',
    );
    this.analyticsSubjectIds.set('usr-stu-002', 'sub-anon-stu-002');
    this.analyticsSubjectIds.set(
      '00000000-0000-4000-8000-000000000005',
      'sub-anon-stu-002',
    );
  }

  getDefinitions(): SurveyDefinitionEntity[] {
    return Array.from(this.definitions.values()).map((d) => ({
      ...d,
      questions: d.questions.map((q) => ({ ...q })),
    }));
  }

  getDefinitionByCode(code: string): SurveyDefinitionEntity | null {
    const found = this.definitions.get(code);
    return found
      ? { ...found, questions: found.questions.map((q) => ({ ...q })) }
      : null;
  }

  getIdempotentResponse(
    studentId: string,
    clientEventId?: string,
  ): SurveyResponseEntity | null {
    if (!clientEventId) {
      return null;
    }
    const found = this.idempotentByKey.get(`${studentId}:${clientEventId}`);
    return found ? { ...found, idempotentReplay: true } : null;
  }

  saveResponse(response: SurveyResponseEntity): void {
    const list = this.responsesByStudent.get(response.studentId) ?? [];
    list.push(response);
    this.responsesByStudent.set(response.studentId, list);
    if (response.clientEventId) {
      this.idempotentByKey.set(
        `${response.studentId}:${response.clientEventId}`,
        response,
      );
    }
  }

  getStudentResponses(studentId: string): SurveyResponseEntity[] {
    return [...(this.responsesByStudent.get(studentId) ?? [])];
  }

  getAnalyticsSubjectId(studentId: string): string {
    if (!this.analyticsSubjectIds.has(studentId)) {
      this.analyticsSubjectIds.set(studentId, `sub-anon-${randomUUID()}`);
    }
    return this.analyticsSubjectIds.get(studentId)!;
  }

  recordDomainEvent(event: DomainEventRecord): void {
    this.emittedEvents.push(event);
  }

  getEmittedEvents(): DomainEventRecord[] {
    return [...this.emittedEvents];
  }
}

