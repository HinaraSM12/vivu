export type MissionCategoryCode =
  | 'PLANNING'
  | 'STUDY_HABITS'
  | 'ACADEMIC_SUPPORT'
  | 'WELLBEING_BALANCE'
  | 'CAMPUS_INTEGRATION';

export type MissionEffortLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type MissionAssignmentStatus =
  | 'available'
  | 'accepted'
  | 'in_progress'
  | 'paused'
  | 'skipped'
  | 'completed';

export type MissionListFilter = 'today' | 'week' | 'all' | 'completed';

export type ProgressLevelCode =
  | 'EXPLORATION'
  | 'INITIAL_CONSISTENCY'
  | 'AUTONOMOUS_PACE'
  | 'CONSOLIDATED_SELF_REGULATION';

export type ContinuitySignal = 'active' | 'gentle_pause' | 'recovery_suggested';

export interface MissionTemplateView {
  code: string;
  version: number;
  title: string;
  category: MissionCategoryCode;
  summary: string;
  whyItHelps: string;
  steps: string[];
  whatYouNeed: string;
  relatedResourceCode?: string;
  relatedResourceTitle?: string;
  durationMinutes: number;
  effort: MissionEffortLevel;
  isRecoveryEligible: boolean;
  ruleVersion: string;
}

export interface MissionAssignmentView {
  assignmentId: string;
  studentId: string;
  missionCode: string;
  missionVersion: number;
  status: MissionAssignmentStatus;
  isRecommended: boolean;
  recommendationReason?: string;
  acceptedAt: string | null;
  startedAt: string | null;
  pausedAt: string | null;
  completedAt: string | null;
  skippedAt: string | null;
  skipReason?: string;
  reflectionNote?: string;
  lastClientEventId?: string;
  ruleVersion: string;
  updatedAt: string;
}

export interface StudentMissionView {
  template: MissionTemplateView;
  assignment: MissionAssignmentView;
}

export interface PersonalAchievementView {
  achievementCode: string;
  title: string;
  description: string;
  unlockedAt: string;
}

export interface StudentProgressSummaryView {
  studentId: string;
  ruleVersion: string;
  levelNumber: 1 | 2 | 3 | 4;
  levelCode: ProgressLevelCode;
  levelTitle: string;
  completedMissionsCount: number;
  acceptedMissionsCount: number;
  inProgressMissionsCount: number;
  nextLevelTargetMissions: number | null;
  weeklyActiveDays: number;
  weeklyCompletedMissions: number;
  continuitySignal: ContinuitySignal;
  continuityMessage: string;
  workedCategories: MissionCategoryCode[];
  achievements: PersonalAchievementView[];
  supportiveFeedback: string;
  lastInteractionAt: string | null;
}

export interface MissionFeedbackBannerView {
  missionCode: string;
  missionTitle: string;
  encouragingMessage: string;
  levelProgressSummary: string;
  unlockedAchievement?: PersonalAchievementView;
}

export interface MissionTransitionResultView {
  mission: StudentMissionView;
  progress: StudentProgressSummaryView;
  feedback?: MissionFeedbackBannerView;
  idempotentReplay: boolean;
}

const RULE_VERSION = '1.0.0';

const SEED_TEMPLATES: MissionTemplateView[] = [
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
    ruleVersion: RULE_VERSION,
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
    ruleVersion: RULE_VERSION,
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
    ruleVersion: RULE_VERSION,
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
    ruleVersion: RULE_VERSION,
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
    ruleVersion: RULE_VERSION,
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
    ruleVersion: RULE_VERSION,
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
    ruleVersion: RULE_VERSION,
  },
];

function computeLevel(completedCount: number): {
  levelNumber: 1 | 2 | 3 | 4;
  levelCode: ProgressLevelCode;
  levelTitle: string;
  nextLevelTargetMissions: number | null;
} {
  const safe = Math.max(0, Math.floor(completedCount));
  if (safe <= 2) {
    return {
      levelNumber: 1,
      levelCode: 'EXPLORATION',
      levelTitle: 'Exploración',
      nextLevelTargetMissions: 3,
    };
  }
  if (safe <= 6) {
    return {
      levelNumber: 2,
      levelCode: 'INITIAL_CONSISTENCY',
      levelTitle: 'Constancia inicial',
      nextLevelTargetMissions: 7,
    };
  }
  if (safe <= 12) {
    return {
      levelNumber: 3,
      levelCode: 'AUTONOMOUS_PACE',
      levelTitle: 'Ritmo autónomo',
      nextLevelTargetMissions: 13,
    };
  }
  return {
    levelNumber: 4,
    levelCode: 'CONSOLIDATED_SELF_REGULATION',
    levelTitle: 'Autorregulación consolidada',
    nextLevelTargetMissions: null,
  };
}

export class GamificationClient {
  private assignmentsByStudent = new Map<
    string,
    Map<string, MissionAssignmentView>
  >();
  private achievementsByStudent = new Map<string, PersonalAchievementView[]>();
  private continuityByStudent = new Map<
    string,
    {
      weeklyActiveDays: number;
      continuitySignal: ContinuitySignal;
      lastInteractionAt: string | null;
    }
  >();

  constructor() {
    this.reset();
  }

  reset(): void {
    this.assignmentsByStudent.clear();
    this.achievementsByStudent.clear();
    this.continuityByStudent.clear();

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

  private ensureStudentInitialized(studentId: string): void {
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
      const map = new Map<string, MissionAssignmentView>();
      for (const template of SEED_TEMPLATES) {
        const isRecommended =
          template.code === 'MIS-PLAN-01' || template.code === 'MIS-HAB-02';
        map.set(template.code, {
          assignmentId: `asg-${studentId}-${template.code.toLowerCase()}`,
          studentId,
          missionCode: template.code,
          missionVersion: template.version,
          status: 'available',
          isRecommended,
          recommendationReason: isRecommended
            ? 'Acción breve sugerida para organizar tu semana con baja carga.'
            : undefined,
          acceptedAt: null,
          startedAt: null,
          pausedAt: null,
          completedAt: null,
          skippedAt: null,
          ruleVersion: RULE_VERSION,
          updatedAt: now,
        });
      }
      this.assignmentsByStudent.set(studentId, map);
    }
  }

  listStudentMissions(
    studentId: string,
    filter: MissionListFilter = 'all',
    category?: MissionCategoryCode | 'ALL',
  ): StudentMissionView[] {
    this.ensureStudentInitialized(studentId);
    const map = this.assignmentsByStudent.get(studentId)!;
    const views = SEED_TEMPLATES.map((template) => ({
      template: { ...template, steps: [...template.steps] },
      assignment: { ...map.get(template.code)! },
    }));

    return views.filter(({ template, assignment }) => {
      if (category && category !== 'ALL' && template.category !== category) {
        return false;
      }
      if (filter === 'completed') {
        return assignment.status === 'completed';
      }
      if (filter === 'today') {
        return (
          assignment.status === 'in_progress' ||
          assignment.status === 'accepted' ||
          (assignment.status === 'available' &&
            (assignment.isRecommended || template.effort === 'LOW'))
        );
      }
      if (filter === 'week') {
        return assignment.status !== 'completed';
      }
      return true;
    });
  }

  getMissionDetail(studentId: string, missionCode: string): StudentMissionView {
    this.ensureStudentInitialized(studentId);
    const template = SEED_TEMPLATES.find((t) => t.code === missionCode);
    const assignment = this.assignmentsByStudent
      .get(studentId)!
      .get(missionCode);
    if (!template || !assignment) {
      throw new Error(`No se encontró la misión ${missionCode}.`);
    }
    return {
      template: { ...template, steps: [...template.steps] },
      assignment: { ...assignment },
    };
  }

  acceptMission(
    studentId: string,
    missionCode: string,
  ): MissionTransitionResultView {
    const { template, assignment } = this.getMissionDetail(
      studentId,
      missionCode,
    );
    const now = new Date().toISOString();
    const updated: MissionAssignmentView = {
      ...assignment,
      status:
        assignment.status === 'in_progress' ? 'in_progress' : 'accepted',
      acceptedAt: assignment.acceptedAt ?? now,
      updatedAt: now,
    };
    this.assignmentsByStudent.get(studentId)!.set(missionCode, updated);
    return {
      mission: { template, assignment: updated },
      progress: this.getStudentProgress(studentId),
      idempotentReplay: false,
    };
  }

  startMission(
    studentId: string,
    missionCode: string,
  ): MissionTransitionResultView {
    const { template, assignment } = this.getMissionDetail(
      studentId,
      missionCode,
    );
    const now = new Date().toISOString();
    const updated: MissionAssignmentView = {
      ...assignment,
      status: 'in_progress',
      acceptedAt: assignment.acceptedAt ?? now,
      startedAt: assignment.startedAt ?? now,
      pausedAt: null,
      updatedAt: now,
    };
    this.assignmentsByStudent.get(studentId)!.set(missionCode, updated);
    return {
      mission: { template, assignment: updated },
      progress: this.getStudentProgress(studentId),
      idempotentReplay: false,
    };
  }

  pauseMission(
    studentId: string,
    missionCode: string,
  ): MissionTransitionResultView {
    const { template, assignment } = this.getMissionDetail(
      studentId,
      missionCode,
    );
    const now = new Date().toISOString();
    const updated: MissionAssignmentView = {
      ...assignment,
      status: 'paused',
      pausedAt: now,
      updatedAt: now,
    };
    this.assignmentsByStudent.get(studentId)!.set(missionCode, updated);
    return {
      mission: { template, assignment: updated },
      progress: this.getStudentProgress(studentId),
      idempotentReplay: false,
    };
  }

  skipMission(
    studentId: string,
    missionCode: string,
    reason?: string,
  ): MissionTransitionResultView {
    const { template, assignment } = this.getMissionDetail(
      studentId,
      missionCode,
    );
    const now = new Date().toISOString();
    const updated: MissionAssignmentView = {
      ...assignment,
      status: 'skipped',
      skippedAt: now,
      skipReason: reason?.trim() || 'Pospuesta para otro momento',
      updatedAt: now,
    };
    this.assignmentsByStudent.get(studentId)!.set(missionCode, updated);
    return {
      mission: { template, assignment: updated },
      progress: this.getStudentProgress(studentId),
      idempotentReplay: false,
    };
  }

  completeMission(
    studentId: string,
    missionCode: string,
    reflectionNote?: string,
  ): MissionTransitionResultView {
    const { template, assignment } = this.getMissionDetail(
      studentId,
      missionCode,
    );
    const now = new Date().toISOString();
    const updated: MissionAssignmentView = {
      ...assignment,
      status: 'completed',
      acceptedAt: assignment.acceptedAt ?? now,
      startedAt: assignment.startedAt ?? now,
      pausedAt: null,
      completedAt: now,
      reflectionNote: reflectionNote?.trim() || assignment.reflectionNote,
      updatedAt: now,
    };
    this.assignmentsByStudent.get(studentId)!.set(missionCode, updated);

    const currentContinuity = this.continuityByStudent.get(studentId)!;
    this.continuityByStudent.set(studentId, {
      weeklyActiveDays: Math.min(
        7,
        Math.max(1, currentContinuity.weeklyActiveDays + 1),
      ),
      continuitySignal: 'active',
      lastInteractionAt: now,
    });

    const unlockedAchievement = this.evaluateAndUnlockAchievements(
      studentId,
      now,
    );
    const progress = this.getStudentProgress(studentId);
    const remaining =
      progress.nextLevelTargetMissions !== null
        ? Math.max(
            0,
            progress.nextLevelTargetMissions - progress.completedMissionsCount,
          )
        : 0;

    const levelProgressSummary =
      progress.nextLevelTargetMissions === null
        ? `Nivel ${progress.levelNumber} (${progress.levelTitle}) consolidado.`
        : remaining === 0
          ? `¡Alcanzaste el Nivel ${progress.levelNumber} (${progress.levelTitle})!`
          : `Nivel ${progress.levelNumber} (${progress.levelTitle}) · Te ${
              remaining === 1 ? 'falta 1 misión' : `faltan ${remaining} misiones`
            } para pasar al siguiente nivel personal.`;

    return {
      mission: { template, assignment: updated },
      progress,
      feedback: {
        missionCode: template.code,
        missionTitle: template.title,
        encouragingMessage:
          '¡Paso completado! Cada acción concreta fortalece tu organización y autonomía esta semana.',
        levelProgressSummary,
        unlockedAchievement,
      },
      idempotentReplay: false,
    };
  }

  getStudentProgress(studentId: string): StudentProgressSummaryView {
    this.ensureStudentInitialized(studentId);
    const assignments = Array.from(
      this.assignmentsByStudent.get(studentId)!.values(),
    );
    const completed = assignments.filter((a) => a.status === 'completed');
    const accepted = assignments.filter(
      (a) =>
        a.status === 'accepted' ||
        a.status === 'in_progress' ||
        a.status === 'paused' ||
        a.status === 'completed',
    );
    const inProgress = assignments.filter(
      (a) => a.status === 'in_progress' || a.status === 'paused',
    );

    const workedCategoriesSet = new Set<MissionCategoryCode>();
    for (const item of completed) {
      const tpl = SEED_TEMPLATES.find((t) => t.code === item.missionCode);
      if (tpl) {
        workedCategoriesSet.add(tpl.category);
      }
    }

    const level = computeLevel(completed.length);
    const continuity = this.continuityByStudent.get(studentId)!;
    const achievements = [...(this.achievementsByStudent.get(studentId) ?? [])];

    const continuityMessage =
      continuity.continuitySignal === 'recovery_suggested'
        ? 'Tu semana puede haber estado cargada. Retomar con una microacción de 5 minutos también cuenta.'
        : continuity.continuitySignal === 'gentle_pause'
          ? 'Puedes retomar a tu ritmo cuando lo decidas, sin perder ningún avance previo.'
          : 'Mantienes una continuidad saludable esta semana. Avanza paso a paso según tu disponibilidad.';

    const supportiveFeedback =
      completed.length === 0
        ? 'Elige una misión breve de 5 a 10 minutos para dar tu primer paso de la semana.'
        : `Has completado ${completed.length} ${
            completed.length === 1 ? 'misión' : 'misiones'
          } a tu propio ritmo en el nivel "${level.levelTitle}".`;

    return {
      studentId,
      ruleVersion: RULE_VERSION,
      levelNumber: level.levelNumber,
      levelCode: level.levelCode,
      levelTitle: level.levelTitle,
      completedMissionsCount: completed.length,
      acceptedMissionsCount: accepted.length,
      inProgressMissionsCount: inProgress.length,
      nextLevelTargetMissions: level.nextLevelTargetMissions,
      weeklyActiveDays: continuity.weeklyActiveDays,
      weeklyCompletedMissions: completed.length,
      continuitySignal: continuity.continuitySignal,
      continuityMessage,
      workedCategories: Array.from(workedCategoriesSet),
      achievements,
      supportiveFeedback,
      lastInteractionAt: continuity.lastInteractionAt,
    };
  }

  private evaluateAndUnlockAchievements(
    studentId: string,
    unlockedAt: string,
  ): PersonalAchievementView | undefined {
    const assignments = Array.from(
      this.assignmentsByStudent.get(studentId)!.values(),
    );
    const completed = assignments.filter((a) => a.status === 'completed');
    const existing = [...(this.achievementsByStudent.get(studentId) ?? [])];
    const codes = new Set(existing.map((a) => a.achievementCode));

    let newlyUnlocked: PersonalAchievementView | undefined;

    if (completed.length >= 1 && !codes.has('ACH-FIRST-STEP')) {
      newlyUnlocked = {
        achievementCode: 'ACH-FIRST-STEP',
        title: 'Primer paso autónomo',
        description:
          'Completaste tu primera misión de autorregulación académica en Vivu.',
        unlockedAt,
      };
      existing.push(newlyUnlocked);
    }

    if (completed.length >= 3 && !codes.has('ACH-INITIAL-CONSISTENCY')) {
      newlyUnlocked = {
        achievementCode: 'ACH-INITIAL-CONSISTENCY',
        title: 'Constancia inicial alcanzada',
        description:
          'Completaste 3 misiones construyendo hábitos sostenibles sin presión competitiva.',
        unlockedAt,
      };
      existing.push(newlyUnlocked);
    }

    const categories = new Set(
      completed
        .map(
          (c) =>
            SEED_TEMPLATES.find((t) => t.code === c.missionCode)?.category,
        )
        .filter(Boolean),
    );
    if (categories.size >= 3 && !codes.has('ACH-BALANCED-EXPLORER')) {
      newlyUnlocked = {
        achievementCode: 'ACH-BALANCED-EXPLORER',
        title: 'Equilibrio de estrategias',
        description:
          'Trabajaste al menos 3 dimensiones distintas de autorregulación y apoyo.',
        unlockedAt,
      };
      existing.push(newlyUnlocked);
    }

    this.achievementsByStudent.set(studentId, existing);
    return newlyUnlocked;
  }
}

export const defaultGamificationClient = new GamificationClient();

