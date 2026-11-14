export type ResourceCategoryCode =
  | 'PLANNING'
  | 'STUDY_HABITS'
  | 'ACADEMIC_SUPPORT'
  | 'WELLBEING_BALANCE'
  | 'CAMPUS_INTEGRATION';

export type RecoveryChoiceCode =
  | 'MICRO_MISSION_5M'
  | 'REORGANIZE_PRIORITY'
  | 'CONSULT_RESOURCE'
  | 'REQUEST_SUPPORT'
  | 'LATER';

export interface InstitutionalResourceView {
  code: string;
  title: string;
  category: ResourceCategoryCode;
  summary: string;
  targetAudience: string;
  modality: string;
  scheduleInfo: string;
  locationOrLink: string;
  contactInfo: string;
  organizerUnit: string;
  status: 'PENDING_REVIEW' | 'PUBLISHED' | 'EXPIRED';
  version: number;
}

export interface SurveyQuestionView {
  questionId: string;
  prompt: string;
  kind: 'likert_1_5' | 'single_choice' | 'optional_text';
  required: boolean;
  options?: string[];
}

export interface SurveyDefinitionView {
  code: 'SUR-WEEKLY-V1' | 'SUR-RECOVERY-V1';
  version: number;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  questions: SurveyQuestionView[];
}

export interface RecoveryStateView {
  studentId: string;
  isRecoveryActive: boolean;
  headline: string;
  supportiveCopy: string;
  selectedChoice: RecoveryChoiceCode | null;
  recommendedRecoveryMissionCodes: string[];
  recommendedResourceCodes: string[];
}

const INITIAL_RESOURCES: InstitutionalResourceView[] = [
  {
    code: 'RES-ACAD-01',
    title:
      'Programa de Monitorías y Tutorías Académicas — Ciencias Básicas e Ingeniería',
    category: 'ACADEMIC_SUPPORT',
    summary:
      'Espacios de acompañamiento grupal e individual para resolver dudas en Cálculo, Física, Ecuaciones Diferenciales y Programación.',
    targetAudience:
      'Estudiantes de pregrado con asignaturas de alta demanda o dificultad',
    modality: 'Presencial / Virtual',
    scheduleInfo: 'Lunes a viernes, bloques de 10:00 a 18:00 según asignatura',
    locationOrLink: 'Bloque M3 / Portal Académico Facultad de Minas',
    contactInfo: 'acompanamiento.minas@vivu.local',
    organizerUnit: 'Vicedecanatura Académica — Facultad de Minas',
    status: 'PUBLISHED',
    version: 1,
  },
  {
    code: 'RES-ACAD-02',
    title: 'Talleres de Estrategias de Estudio y Gestión del Tiempo',
    category: 'STUDY_HABITS',
    summary:
      'Talleres prácticos sobre planificación semanal, preparación de parciales, estudio activo y manejo de carga académica.',
    targetAudience:
      'Estudiantes de todos los semestres que buscan mejorar organización',
    modality: 'Grupal / Taller',
    scheduleInfo: 'Miércoles 14:00–16:00 y Viernes 10:00–12:00',
    locationOrLink: 'Aula M8-102 y sala virtual autorizada',
    contactInfo: 'orientacion.minas@vivu.local',
    organizerUnit: 'Dirección de Bienestar Universitario — Facultad de Minas',
    status: 'PUBLISHED',
    version: 1,
  },
  {
    code: 'RES-ACA-03',
    title: 'Acompañamiento Estudiantil y Consejería Académica de Facultad',
    category: 'PLANNING',
    summary:
      'Orientación individual para organizar carga del semestre, priorizar asignaturas y trazar rutas de avance realistas.',
    targetAudience:
      'Estudiantes que requieren orientación sobre carga académica y ruta curricular',
    modality: 'Cita previa',
    scheduleInfo: 'Agenda abierta lunes a viernes',
    locationOrLink: 'Oficina de Acompañamiento Estudiantil — Bloque M5',
    contactInfo: 'consejeria.minas@vivu.local',
    organizerUnit: 'Escuela de Pregrado — Facultad de Minas',
    status: 'PUBLISHED',
    version: 1,
  },
  {
    code: 'RES-WEL-01',
    title: 'Orientación y Acompañamiento en Bienestar Universitario',
    category: 'WELLBEING_BALANCE',
    summary:
      'Espacios de escucha, regulación de sobrecarga académica y orientación preventiva para el equilibrio universitario.',
    targetAudience:
      'Estudiantes que reportan sobrecarga o necesidad de orientación en bienestar',
    modality: 'Presencial / Virtual',
    scheduleInfo: 'Lunes a viernes 08:00–17:00',
    locationOrLink: 'Dirección de Bienestar — Bloque M3',
    contactInfo: 'bienestar.minas@vivu.local',
    organizerUnit: 'Bienestar Universitario — Facultad de Minas',
    status: 'PUBLISHED',
    version: 1,
  },
  {
    code: 'RES-INT-01',
    title:
      'Guía de Servicios Universitarios y Grupos Estudiantiles — Facultad de Minas',
    category: 'CAMPUS_INTEGRATION',
    summary:
      'Directorio verificado de semilleros, capítulos estudiantiles, bibliotecas y servicios de campus para fortalecer integración.',
    targetAudience:
      'Estudiantes de primeros semestres o en proceso de integración universitaria',
    modality: 'Catálogo digital',
    scheduleInfo: 'Consulta permanente 24/7',
    locationOrLink: 'Portal de Integración Estudiantil — Facultad de Minas',
    contactInfo: 'integracion.minas@vivu.local',
    organizerUnit: 'Bienestar Universitario y Representación Estudiantil',
    status: 'PUBLISHED',
    version: 1,
  },
  {
    code: 'RES-ARCH-01',
    title:
      'Convocatoria Histórica Semestre Anterior (Seed para probar filtro de inactivos)',
    category: 'CAMPUS_INTEGRATION',
    summary:
      'Recurso vencido/inactivo que nunca se muestra a estudiantes ni entra al recomendador.',
    targetAudience: 'Prueba automatizada',
    modality: 'N/A',
    scheduleInfo: 'Cerrada',
    locationOrLink: 'Archivo histórico',
    contactInfo: 'archivo.minas@vivu.local',
    organizerUnit: 'Archivo Facultad',
    status: 'EXPIRED',
    version: 1,
  },
];

const INITIAL_SURVEYS: SurveyDefinitionView[] = [
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

export class Sprint4Client {
  private resources = new Map<string, InstitutionalResourceView>();
  private recoveryByStudent = new Map<string, RecoveryStateView>();
  private submittedSurveysByStudent = new Map<string, string[]>();

  constructor() {
    this.reset();
  }

  reset(): void {
    this.resources.clear();
    this.recoveryByStudent.clear();
    this.submittedSurveysByStudent.clear();

    for (const r of INITIAL_RESOURCES) {
      this.resources.set(r.code, { ...r });
    }
  }

  listPublishedResources(
    category?: ResourceCategoryCode | 'ALL',
  ): InstitutionalResourceView[] {
    return Array.from(this.resources.values())
      .filter((r) => {
        if (r.status !== 'PUBLISHED') return false;
        if (category && category !== 'ALL' && r.category !== category) {
          return false;
        }
        return true;
      })
      .map((r) => ({ ...r }));
  }

  listAllResources(): InstitutionalResourceView[] {
    return Array.from(this.resources.values()).map((r) => ({ ...r }));
  }

  submitResourceProposal(input: {
    code?: string;
    title: string;
    category: ResourceCategoryCode;
    summary: string;
    organizerUnit: string;
    isAdmin?: boolean;
  }): InstitutionalResourceView {
    const code =
      input.code?.trim().toUpperCase() ||
      `RES-CONTRIB-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const entity: InstitutionalResourceView = {
      code,
      title: input.title.trim(),
      category: input.category,
      summary: input.summary.trim(),
      targetAudience: 'Estudiantes de Ingeniería',
      modality: 'Presencial / Virtual',
      scheduleInfo: 'Por confirmar',
      locationOrLink: 'Facultad de Minas',
      contactInfo: 'acompanamiento.minas@vivu.local',
      organizerUnit: input.organizerUnit.trim() || 'Facultad de Minas',
      status: input.isAdmin ? 'PUBLISHED' : 'PENDING_REVIEW',
      version: 1,
    };
    this.resources.set(code, entity);
    return { ...entity };
  }

  approveResource(code: string): InstitutionalResourceView {
    const found = this.resources.get(code);
    if (!found) {
      throw new Error(`No existe el recurso ${code}`);
    }
    const updated: InstitutionalResourceView = {
      ...found,
      status: 'PUBLISHED',
      version: found.version + 1,
    };
    this.resources.set(code, updated);
    return { ...updated };
  }

  getSurveys(): SurveyDefinitionView[] {
    return INITIAL_SURVEYS.map((s) => ({
      ...s,
      questions: s.questions.map((q) => ({ ...q })),
    }));
  }

  submitSurvey(studentId: string, surveyCode: string): string[] {
    const current = this.submittedSurveysByStudent.get(studentId) ?? [];
    if (!current.includes(surveyCode)) {
      current.push(surveyCode);
      this.submittedSurveysByStudent.set(studentId, current);
    }
    return [...current];
  }

  getSubmittedSurveys(studentId: string): string[] {
    return [...(this.submittedSurveysByStudent.get(studentId) ?? [])];
  }

  getRecoveryState(studentId: string): RecoveryStateView {
    if (!this.recoveryByStudent.has(studentId)) {
      this.recoveryByStudent.set(studentId, {
        studentId,
        isRecoveryActive: false,
        headline: '¿Cómo quieres retomar hoy?',
        supportiveCopy:
          'Retomar con algo pequeño también cuenta. Elige una opción breve sin perder ningún nivel ni logro previo.',
        selectedChoice: null,
        recommendedRecoveryMissionCodes: [
          'MIS-REC-01',
          'MIS-PLAN-01',
          'MIS-WEL-01',
        ],
        recommendedResourceCodes: ['RES-ACA-03', 'RES-WEL-01', 'RES-ACAD-01'],
      });
    }
    return { ...this.recoveryByStudent.get(studentId)! };
  }

  activateRecovery(
    studentId: string,
    choice: RecoveryChoiceCode,
  ): RecoveryStateView {
    const current = this.getRecoveryState(studentId);
    const updated: RecoveryStateView = {
      ...current,
      isRecoveryActive: true,
      selectedChoice: choice,
    };
    this.recoveryByStudent.set(studentId, updated);
    return { ...updated };
  }
}

export const defaultSprint4Client = new Sprint4Client();

