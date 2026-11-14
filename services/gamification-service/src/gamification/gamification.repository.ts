import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import {
  type ContinuitySignal,
  CURRENT_GAMIFICATION_RULE_VERSION,
  type DomainEventRecord,
  type MissionAssignmentEntity,
  type MissionTemplateEntity,
  type MissionTransitionResponseDto,
  type PersonalAchievementEntity,
  type RecoveryChoiceCode,
} from './gamification.types';

const SEED_MISSION_TEMPLATES: MissionTemplateEntity[] = [
  {
    code: 'MIS-PLAN-01',
    version: 1,
    title: 'Prioriza tus 3 entregas clave de la semana',
    category: 'PLANNING',
    summary:
      'Identifica las 3 actividades académicas más importantes de los próximos 7 días para reducir la sensación de saturación.',
    whyItHelps:
      'Cuando todo parece urgente, elegir tres prioridades concretas disminuye la sobrecarga mental y facilita dar el primer paso.',
    steps: [
      'Anota todas las entregas, quices o talleres de los próximos 7 días.',
      'Marca únicamente las 3 que tienen fecha más cercana o mayor peso para ti.',
      'Elige cuál de las 3 abordarás primero con un bloque corto de trabajo.',
    ],
    whatYouNeed: 'Tu calendario o lista de materias y 10 minutos sin interrupciones.',
    relatedResourceCode: 'RES-ACA-03',
    relatedResourceTitle:
      'Acompañamiento Estudiantil y Consejería Académica de Facultad',
    durationMinutes: 10,
    effort: 'LOW',
    isRecoveryEligible: true,
    ruleVersion: CURRENT_GAMIFICATION_RULE_VERSION,
  },
  {
    code: 'MIS-PLAN-02',
    version: 1,
    title: 'Diseña dos bloques de estudio de 45 minutos',
    category: 'PLANNING',
    summary:
      'Reserva en tu semana dos espacios realistas de 45 minutos dedicados a tu asignatura de mayor dificultad.',
    whyItHelps:
      'Separar bloques breves y realistas sostiene la continuidad mejor que intentar maratones de última hora.',
    steps: [
      'Revisa tus huecos reales entre clases o en casa durante esta semana.',
      'Reserva dos bloques de 45 minutos en días distintos.',
      'Escribe qué tema o ejercicio específico trabajarás en el primer bloque.',
    ],
    whatYouNeed: 'Tu horario semanal de clases y compromisos personales.',
    relatedResourceCode: 'RES-ACAD-02',
    relatedResourceTitle:
      'Talleres de Estrategias de Estudio y Gestión del Tiempo',
    durationMinutes: 15,
    effort: 'MEDIUM',
    isRecoveryEligible: false,
    ruleVersion: CURRENT_GAMIFICATION_RULE_VERSION,
  },
  {
    code: 'MIS-HAB-01',
    version: 1,
    title: 'Sesión de estudio enfocado de 25 minutos',
    category: 'STUDY_HABITS',
    summary:
      'Completa un bloque corto de práctica activa o lectura sin distracciones sobre un tema puntual.',
    whyItHelps:
      'Un bloque de 25 minutos con objetivo concreto reduce la procrastinación y fortalece tu percepción de avance.',
    steps: [
      'Elige un único ejercicio, sección o concepto de una materia.',
      'Silencia notificaciones durante 25 minutos.',
      'Al terminar, escribe en una frase la idea principal o el punto donde quedaste.',
    ],
    whatYouNeed: 'Material de la materia elegida y un temporizador de 25 minutos.',
    relatedResourceCode: 'RES-ACAD-02',
    relatedResourceTitle:
      'Talleres de Estrategias de Estudio y Gestión del Tiempo',
    durationMinutes: 25,
    effort: 'MEDIUM',
    isRecoveryEligible: false,
    ruleVersion: CURRENT_GAMIFICATION_RULE_VERSION,
  },
  {
    code: 'MIS-HAB-02',
    version: 1,
    title: 'Prepara 2 dudas puntuales antes de clase o monitoría',
    category: 'STUDY_HABITS',
    summary:
      'Transforma un bloqueo general en dos preguntas concretas para aprovechar tu próxima clase o asesoría.',
    whyItHelps:
      'Formular la duda con precisión aclara el problema incluso antes de consultar al docente o monitor.',
    steps: [
      'Identifica el ejercicio o concepto que más te costó esta semana.',
      'Escribe exactamente en qué paso aparece la confusión.',
      'Formula dos preguntas breves para llevar a clase o monitoría.',
    ],
    whatYouNeed: 'Tus apuntes recientes o taller en curso.',
    relatedResourceCode: 'RES-ACAD-01',
    relatedResourceTitle:
      'Programa de Monitorías y Tutorías Académicas — Ciencias Básicas e Ingeniería',
    durationMinutes: 10,
    effort: 'LOW',
    isRecoveryEligible: true,
    ruleVersion: CURRENT_GAMIFICATION_RULE_VERSION,
  },
  {
    code: 'MIS-SUP-01',
    version: 1,
    title: 'Explora una monitoría o tutoría para tu materia retadora',
    category: 'ACADEMIC_SUPPORT',
    summary:
      'Consulta los horarios y modalidad de apoyo académico autorizado en la Facultad de Minas para tu asignatura.',
    whyItHelps:
      'Pedir apoyo a tiempo es una estrategia de autorregulación académica, no una señal de debilidad.',
    steps: [
      'Ubica tu asignatura más retadora del semestre.',
      'Consulta horarios y lugar/enlace del Programa de Monitorías y Tutorías.',
      'Anota el horario al que podrías asistir esta o la próxima semana.',
    ],
    whatYouNeed: 'Nombre de la asignatura y disponibilidad semanal.',
    relatedResourceCode: 'RES-ACAD-01',
    relatedResourceTitle:
      'Programa de Monitorías y Tutorías Académicas — Ciencias Básicas e Ingeniería',
    durationMinutes: 10,
    effort: 'LOW',
    isRecoveryEligible: true,
    ruleVersion: CURRENT_GAMIFICATION_RULE_VERSION,
  },
  {
    code: 'MIS-WEL-01',
    version: 1,
    title: 'Pausa consciente y ajuste de carga de hoy',
    category: 'WELLBEING_BALANCE',
    summary:
      'Haz una pausa breve de 5 minutos, revisa si tu meta de hoy es realista y pospón sin culpa lo no urgente.',
    whyItHelps:
      'Regular la carga diaria previene el agotamiento y protege tu continuidad a lo largo del semestre.',
    steps: [
      'Detén la pantalla por 2 minutos y respira con calma.',
      'Revisa qué única tarea de hoy realmente necesitas cerrar.',
      'Mueve el resto a otro día sin reprocharte.',
    ],
    whatYouNeed: '5 minutos de pausa tranquila.',
    relatedResourceCode: 'RES-WEL-01',
    relatedResourceTitle:
      'Orientación y Acompañamiento en Bienestar Universitario',
    durationMinutes: 5,
    effort: 'LOW',
    isRecoveryEligible: true,
    ruleVersion: CURRENT_GAMIFICATION_RULE_VERSION,
  },
  {
    code: 'MIS-REC-01',
    version: 1,
    title: 'Retoma el ritmo: elige una sola microacción de 5 minutos',
    category: 'PLANNING',
    summary:
      'Meta mínima viable para semanas exigentes o tras una pausa: retomar con un paso pequeño sin ninguna penalización.',
    whyItHelps:
      'Retomar con algo pequeño también cuenta. Una acción de 5 minutos reactiva la autonomía sin agobiarte.',
    steps: [
      'Abre tu cuaderno o carpeta de la materia que quieres retomar.',
      'Dedica 5 minutos únicamente a ordenar qué tema estás viendo.',
      'Registra ese pequeño paso como tu punto de partida de la semana.',
    ],
    whatYouNeed: '5 minutos y disposición para dar un solo paso pequeño.',
    relatedResourceCode: 'RES-ACA-03',
    relatedResourceTitle:
      'Acompañamiento Estudiantil y Consejería Académica de Facultad',
    durationMinutes: 5,
    effort: 'LOW',
    isRecoveryEligible: true,
    ruleVersion: CURRENT_GAMIFICATION_RULE_VERSION,
  },
];

@Injectable()
export class GamificationRepository {
  private readonly templates = new Map<string, MissionTemplateEntity>();
  private readonly assignmentsByStudent = new Map<
    string,
    Map<string, MissionAssignmentEntity>
  >();
  private readonly achievementsByStudent = new Map<
    string,
    PersonalAchievementEntity[]
  >();
  private readonly continuityByStudent = new Map<
    string,
    {
      weeklyActiveDays: number;
      continuitySignal: ContinuitySignal;
      lastInteractionAt: string | null;
      isRecoveryActive?: boolean;
      lastRecoveryActivatedAt?: string | null;
      selectedRecoveryChoice?: RecoveryChoiceCode | null;
    }
  >();
  private readonly analyticsSubjectIds = new Map<string, string>();
  private readonly idempotentTransitions = new Map<
    string,
    MissionTransitionResponseDto
  >();
  private readonly emittedEvents: DomainEventRecord[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults(): void {
    for (const template of SEED_MISSION_TEMPLATES) {
      this.templates.set(template.code, {
        ...template,
        steps: [...template.steps],
      });
    }

    // Seed Analytics Subject Pseudonymous IDs matching student-service
    this.analyticsSubjectIds.set('usr-stu-001', 'sub-anon-stu-001');
    this.analyticsSubjectIds.set('usr-stu-002', 'sub-anon-stu-002');
    this.analyticsSubjectIds.set('usr-stu-003', 'sub-anon-stu-003');

    // Seed assignments for usr-stu-001 / 00000000-0000-4000-8000-000000000004 (est.activo@vivu.local)
    for (const activeId of [
      'usr-stu-001',
      '00000000-0000-4000-8000-000000000004',
    ]) {
      this.ensureStudentInitialized(activeId);
      const stu1Map = this.assignmentsByStudent.get(activeId)!;
      stu1Map.set('MIS-PLAN-01', {
        ...stu1Map.get('MIS-PLAN-01')!,
        status: 'completed',
        acceptedAt: '2026-11-03T14:00:00.000Z',
        startedAt: '2026-11-03T14:02:00.000Z',
        completedAt: '2026-11-03T14:15:00.000Z',
        reflectionNote: 'Prioricé Cálculo, Física y Programación.',
        updatedAt: '2026-11-03T14:15:00.000Z',
      });
      stu1Map.set('MIS-HAB-02', {
        ...stu1Map.get('MIS-HAB-02')!,
        status: 'completed',
        acceptedAt: '2026-11-06T16:00:00.000Z',
        startedAt: '2026-11-06T16:01:00.000Z',
        completedAt: '2026-11-06T16:12:00.000Z',
        reflectionNote: 'Llevé dos preguntas sobre integrales a monitoría.',
        updatedAt: '2026-11-06T16:12:00.000Z',
      });
      stu1Map.set('MIS-PLAN-02', {
        ...stu1Map.get('MIS-PLAN-02')!,
        status: 'accepted',
        isRecommended: true,
        recommendationReason:
          'Se adapta a tu disponibilidad semanal y te ayuda a organizar Ecuaciones Diferenciales.',
        acceptedAt: '2026-11-10T10:00:00.000Z',
        updatedAt: '2026-11-10T10:00:00.000Z',
      });
      this.continuityByStudent.set(activeId, {
        weeklyActiveDays: 3,
        continuitySignal: 'active',
        lastInteractionAt: '2026-11-10T10:00:00.000Z',
      });
      this.achievementsByStudent.set(activeId, [
        {
          achievementCode: 'ACH-FIRST-STEP',
          title: 'Primer paso autónomo',
          description:
            'Completaste tu primera misión de autorregulación en Vivu.',
          unlockedAt: '2026-11-03T14:15:00.000Z',
        },
      ]);
    }

    // Seed assignments for usr-stu-002 / 00000000-0000-4000-8000-000000000005 (est.recuperacion@vivu.local)
    for (const recoveryId of [
      'usr-stu-002',
      '00000000-0000-4000-8000-000000000005',
    ]) {
      this.ensureStudentInitialized(recoveryId);
      const stu2Map = this.assignmentsByStudent.get(recoveryId)!;
      stu2Map.set('MIS-WEL-01', {
        ...stu2Map.get('MIS-WEL-01')!,
        status: 'completed',
        acceptedAt: '2026-10-28T09:00:00.000Z',
        startedAt: '2026-10-28T09:01:00.000Z',
        completedAt: '2026-10-28T09:08:00.000Z',
        updatedAt: '2026-10-28T09:08:00.000Z',
      });
      stu2Map.set('MIS-REC-01', {
        ...stu2Map.get('MIS-REC-01')!,
        isRecommended: true,
        recommendationReason:
          'Una microacción de 5 minutos para retomar a tu ritmo sin presión adicional.',
      });
      this.continuityByStudent.set(recoveryId, {
        weeklyActiveDays: 1,
        continuitySignal: 'recovery_suggested',
        lastInteractionAt: '2026-10-28T09:08:00.000Z',
      });
      this.achievementsByStudent.set(recoveryId, [
        {
          achievementCode: 'ACH-FIRST-STEP',
          title: 'Primer paso autónomo',
          description:
            'Completaste tu primera misión de autorregulación en Vivu.',
          unlockedAt: '2026-10-28T09:08:00.000Z',
        },
      ]);
    }
  }

  ensureStudentInitialized(studentId: string): void {
    if (!this.analyticsSubjectIds.has(studentId)) {
      this.analyticsSubjectIds.set(studentId, `sub-anon-${randomUUID()}`);
    }

    if (!this.continuityByStudent.has(studentId)) {
      this.continuityByStudent.set(studentId, {
        weeklyActiveDays: 1,
        continuitySignal: 'active',
        lastInteractionAt: null,
      });
    }

    if (!this.achievementsByStudent.has(studentId)) {
      this.achievementsByStudent.set(studentId, []);
    }

    if (!this.assignmentsByStudent.has(studentId)) {
      const now = new Date().toISOString();
      const studentAssignments = new Map<string, MissionAssignmentEntity>();

      for (const template of SEED_MISSION_TEMPLATES) {
        const isDefaultRecommended =
          template.code === 'MIS-PLAN-01' || template.code === 'MIS-HAB-02';
        studentAssignments.set(template.code, {
          assignmentId: `asg-${studentId}-${template.code.toLowerCase()}`,
          studentId,
          missionCode: template.code,
          missionVersion: template.version,
          status: 'available',
          isRecommended: isDefaultRecommended,
          recommendationReason: isDefaultRecommended
            ? 'Acción breve sugerida para organizar tu semana con baja carga.'
            : undefined,
          acceptedAt: null,
          startedAt: null,
          pausedAt: null,
          completedAt: null,
          skippedAt: null,
          ruleVersion: CURRENT_GAMIFICATION_RULE_VERSION,
          updatedAt: now,
        });
      }

      this.assignmentsByStudent.set(studentId, studentAssignments);
    }
  }

  getAllTemplates(): MissionTemplateEntity[] {
    return Array.from(this.templates.values()).map((t) => ({
      ...t,
      steps: [...t.steps],
    }));
  }

  getTemplateByCode(missionCode: string): MissionTemplateEntity | null {
    const found = this.templates.get(missionCode);
    if (!found) {
      return null;
    }
    return {
      ...found,
      steps: [...found.steps],
    };
  }

  getStudentAssignments(studentId: string): MissionAssignmentEntity[] {
    this.ensureStudentInitialized(studentId);
    return Array.from(this.assignmentsByStudent.get(studentId)!.values()).map(
      (a) => ({ ...a }),
    );
  }

  getStudentAssignment(
    studentId: string,
    missionCode: string,
  ): MissionAssignmentEntity | null {
    this.ensureStudentInitialized(studentId);
    const found = this.assignmentsByStudent.get(studentId)!.get(missionCode);
    return found ? { ...found } : null;
  }

  saveStudentAssignment(assignment: MissionAssignmentEntity): void {
    this.ensureStudentInitialized(assignment.studentId);
    this.assignmentsByStudent
      .get(assignment.studentId)!
      .set(assignment.missionCode, { ...assignment });
  }

  getStudentAchievements(studentId: string): PersonalAchievementEntity[] {
    this.ensureStudentInitialized(studentId);
    return [...(this.achievementsByStudent.get(studentId) ?? [])];
  }

  saveStudentAchievements(
    studentId: string,
    achievements: PersonalAchievementEntity[],
  ): void {
    this.ensureStudentInitialized(studentId);
    this.achievementsByStudent.set(studentId, [...achievements]);
  }

  getStudentContinuity(studentId: string): {
    weeklyActiveDays: number;
    continuitySignal: ContinuitySignal;
    lastInteractionAt: string | null;
    isRecoveryActive: boolean;
    lastRecoveryActivatedAt: string | null;
    selectedRecoveryChoice: RecoveryChoiceCode | null;
  } {
    this.ensureStudentInitialized(studentId);
    const current = this.continuityByStudent.get(studentId)!;
    return {
      weeklyActiveDays: current.weeklyActiveDays,
      continuitySignal: current.continuitySignal,
      lastInteractionAt: current.lastInteractionAt,
      isRecoveryActive: current.isRecoveryActive ?? false,
      lastRecoveryActivatedAt: current.lastRecoveryActivatedAt ?? null,
      selectedRecoveryChoice: current.selectedRecoveryChoice ?? null,
    };
  }

  activateRecoveryMode(
    studentId: string,
    choice: RecoveryChoiceCode,
    occurredAt: string,
  ): void {
    this.ensureStudentInitialized(studentId);
    const current = this.continuityByStudent.get(studentId)!;
    this.continuityByStudent.set(studentId, {
      ...current,
      isRecoveryActive: true,
      lastRecoveryActivatedAt: occurredAt,
      selectedRecoveryChoice: choice,
      lastInteractionAt: occurredAt,
    });
  }

  recordPositiveInteraction(studentId: string, occurredAt: string): void {
    this.ensureStudentInitialized(studentId);
    const current = this.continuityByStudent.get(studentId)!;
    this.continuityByStudent.set(studentId, {
      weeklyActiveDays: Math.min(7, Math.max(1, current.weeklyActiveDays + 1)),
      continuitySignal: 'active',
      lastInteractionAt: occurredAt,
    });
  }

  getAnalyticsSubjectId(studentId: string): string {
    this.ensureStudentInitialized(studentId);
    return this.analyticsSubjectIds.get(studentId)!;
  }

  getIdempotentTransition(
    studentId: string,
    clientEventId?: string,
  ): MissionTransitionResponseDto | null {
    if (!clientEventId) {
      return null;
    }
    const key = `${studentId}:${clientEventId}`;
    const cached = this.idempotentTransitions.get(key);
    if (!cached) {
      return null;
    }
    return {
      ...cached,
      idempotentReplay: true,
    };
  }

  saveIdempotentTransition(
    studentId: string,
    clientEventId: string | undefined,
    response: MissionTransitionResponseDto,
  ): void {
    if (!clientEventId) {
      return;
    }
    const key = `${studentId}:${clientEventId}`;
    this.idempotentTransitions.set(key, response);
  }

  recordDomainEvent(event: DomainEventRecord): void {
    this.emittedEvents.push(event);
  }

  getEmittedEvents(): DomainEventRecord[] {
    return [...this.emittedEvents];
  }
}

