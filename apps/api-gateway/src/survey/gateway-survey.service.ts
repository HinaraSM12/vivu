import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

export type GatewaySurveyCode = 'SUR-WEEKLY-V1' | 'SUR-RECOVERY-V1';

export interface GatewaySurveyQuestion {
  questionId: string;
  prompt: string;
  kind: 'likert_1_5' | 'single_choice' | 'optional_text';
  required: boolean;
  options?: string[];
}

export interface GatewaySurveyDefinition {
  code: GatewaySurveyCode;
  version: number;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  questions: GatewaySurveyQuestion[];
}

export interface GatewaySurveyAnswer {
  questionId: string;
  numericValue?: 1 | 2 | 3 | 4 | 5;
  choiceValue?: string;
  textValue?: string;
}

export interface GatewaySurveyResponseRecord {
  responseId: string;
  studentId: string;
  surveyCode: GatewaySurveyCode;
  surveyVersion: number;
  answers: GatewaySurveyAnswer[];
  submittedAt: string;
  clientEventId?: string;
  idempotentReplay: boolean;
}

const SEED_GATEWAY_SURVEYS: GatewaySurveyDefinition[] = [
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
        prompt: '2. ¿Qué tipo de apoyo te resultaría más útil esta semana?',
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
export class GatewaySurveyService {
  private readonly definitions = new Map<string, GatewaySurveyDefinition>();
  private readonly responsesByStudent = new Map<
    string,
    GatewaySurveyResponseRecord[]
  >();
  private readonly idempotentByKey = new Map<
    string,
    GatewaySurveyResponseRecord
  >();

  constructor() {
    for (const def of SEED_GATEWAY_SURVEYS) {
      this.definitions.set(def.code, {
        ...def,
        questions: def.questions.map((q) => ({ ...q })),
      });
    }
  }

  listDefinitions(): GatewaySurveyDefinition[] {
    return Array.from(this.definitions.values()).map((d) => ({
      ...d,
      questions: d.questions.map((q) => ({ ...q })),
    }));
  }

  getDefinition(code: string): GatewaySurveyDefinition {
    const found = this.definitions.get(code);
    if (!found) {
      throw new NotFoundException({
        code: 'SURVEY_NOT_FOUND',
        message: `No se encontró el microcuestionario (${code}).`,
      });
    }
    return {
      ...found,
      questions: found.questions.map((q) => ({ ...q })),
    };
  }

  submitResponse(
    studentId: string,
    code: string,
    answers: GatewaySurveyAnswer[],
    clientEventId?: string,
  ): GatewaySurveyResponseRecord {
    if (clientEventId) {
      const replay = this.idempotentByKey.get(`${studentId}:${clientEventId}`);
      if (replay) {
        return { ...replay, idempotentReplay: true };
      }
    }

    const def = this.getDefinition(code);
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new BadRequestException({
        code: 'SURVEY_ANSWERS_REQUIRED',
        message: 'Debes responder las preguntas obligatorias del microcuestionario.',
      });
    }

    const record: GatewaySurveyResponseRecord = {
      responseId: randomUUID(),
      studentId,
      surveyCode: def.code,
      surveyVersion: def.version,
      answers,
      submittedAt: new Date().toISOString(),
      clientEventId,
      idempotentReplay: false,
    };

    const list = this.responsesByStudent.get(studentId) ?? [];
    list.push(record);
    this.responsesByStudent.set(studentId, list);
    if (clientEventId) {
      this.idempotentByKey.set(`${studentId}:${clientEventId}`, record);
    }

    return record;
  }

  listStudentResponses(studentId: string): GatewaySurveyResponseRecord[] {
    return [...(this.responsesByStudent.get(studentId) ?? [])];
  }
}

