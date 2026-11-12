import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GamificationRepository } from './gamification.repository';
import {
  CURRENT_GAMIFICATION_RULE_VERSION,
  type MissionAssignmentEntity,
  type MissionCategoryCode,
  type MissionFeedbackBannerDto,
  type MissionListFilter,
  type MissionTemplateEntity,
  type MissionTransitionResponseDto,
  type PersonalAchievementEntity,
  type ProgressLevelCode,
  type RecoveryChoiceCode,
  type RecoveryStateDto,
  type StudentMissionViewDto,
  type StudentProgressSummaryDto,
} from './gamification.types';

function computeLevelDescriptor(completedMissionsCount: number): {
  levelNumber: 1 | 2 | 3 | 4;
  levelCode: ProgressLevelCode;
  levelTitle: string;
  nextLevelTargetMissions: number | null;
} {
  const safeCount = Math.max(0, Math.floor(completedMissionsCount));

  if (safeCount <= 2) {
    return {
      levelNumber: 1,
      levelCode: 'EXPLORATION',
      levelTitle: 'Exploración',
      nextLevelTargetMissions: 3,
    };
  }

  if (safeCount <= 6) {
    return {
      levelNumber: 2,
      levelCode: 'INITIAL_CONSISTENCY',
      levelTitle: 'Constancia inicial',
      nextLevelTargetMissions: 7,
    };
  }

  if (safeCount <= 12) {
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

@Injectable()
export class GamificationService {
  constructor(
    @Inject(GamificationRepository)
    private readonly repository: GamificationRepository,
  ) {}

  listCatalog(): MissionTemplateEntity[] {
    return this.repository.getAllTemplates();
  }

  listStudentMissions(
    studentId: string,
    options?: {
      filter?: MissionListFilter;
      category?: MissionCategoryCode;
    },
  ): StudentMissionViewDto[] {
    const templates = this.repository.getAllTemplates();
    const assignments = new Map(
      this.repository
        .getStudentAssignments(studentId)
        .map((item) => [item.missionCode, item]),
    );

    const combined: StudentMissionViewDto[] = templates.map((template) => {
      const assignment = assignments.get(template.code)!;
      return {
        template,
        assignment,
      };
    });

    return combined.filter(({ template, assignment }) => {
      if (options?.category && template.category !== options.category) {
        return false;
      }

      const filter = options?.filter ?? 'all';
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

  getStudentMissionDetail(
    studentId: string,
    missionCode: string,
  ): StudentMissionViewDto {
    const template = this.repository.getTemplateByCode(missionCode);
    const assignment = this.repository.getStudentAssignment(
      studentId,
      missionCode,
    );

    if (!template || !assignment) {
      throw new NotFoundException({
        code: 'MISSION_NOT_FOUND',
        message: `No se encontró la misión solicitada (${missionCode}).`,
      });
    }

    return {
      template,
      assignment,
    };
  }

  acceptMission(
    studentId: string,
    missionCode: string,
    options?: {
      clientEventId?: string;
      correlationId?: string;
    },
  ): MissionTransitionResponseDto {
    const replay = this.repository.getIdempotentTransition(
      studentId,
      options?.clientEventId,
    );
    if (replay) {
      return replay;
    }

    const { template, assignment } = this.getStudentMissionDetail(
      studentId,
      missionCode,
    );

    if (assignment.status === 'completed') {
      throw new BadRequestException({
        code: 'MISSION_ALREADY_COMPLETED',
        message: 'Esta misión ya fue completada previamente.',
      });
    }

    const now = new Date().toISOString();
    const updated: MissionAssignmentEntity = {
      ...assignment,
      status:
        assignment.status === 'in_progress' ? 'in_progress' : 'accepted',
      acceptedAt: assignment.acceptedAt ?? now,
      lastClientEventId: options?.clientEventId ?? assignment.lastClientEventId,
      updatedAt: now,
    };

    this.repository.saveStudentAssignment(updated);
    this.emitLifecycleEvent(
      'mission.accepted.v1',
      studentId,
      template,
      updated,
      options?.correlationId,
      options?.clientEventId,
    );

    const response: MissionTransitionResponseDto = {
      mission: { template, assignment: updated },
      progress: this.getStudentProgress(studentId),
      idempotentReplay: false,
    };

    this.repository.saveIdempotentTransition(
      studentId,
      options?.clientEventId,
      response,
    );

    return response;
  }

  startMission(
    studentId: string,
    missionCode: string,
    options?: {
      clientEventId?: string;
      correlationId?: string;
    },
  ): MissionTransitionResponseDto {
    const replay = this.repository.getIdempotentTransition(
      studentId,
      options?.clientEventId,
    );
    if (replay) {
      return replay;
    }

    const { template, assignment } = this.getStudentMissionDetail(
      studentId,
      missionCode,
    );

    if (assignment.status === 'completed') {
      throw new BadRequestException({
        code: 'MISSION_ALREADY_COMPLETED',
        message: 'Esta misión ya fue completada previamente.',
      });
    }

    const now = new Date().toISOString();
    const updated: MissionAssignmentEntity = {
      ...assignment,
      status: 'in_progress',
      acceptedAt: assignment.acceptedAt ?? now,
      startedAt: assignment.startedAt ?? now,
      pausedAt: null,
      lastClientEventId: options?.clientEventId ?? assignment.lastClientEventId,
      updatedAt: now,
    };

    this.repository.saveStudentAssignment(updated);

    const response: MissionTransitionResponseDto = {
      mission: { template, assignment: updated },
      progress: this.getStudentProgress(studentId),
      idempotentReplay: false,
    };

    this.repository.saveIdempotentTransition(
      studentId,
      options?.clientEventId,
      response,
    );

    return response;
  }

  pauseMission(
    studentId: string,
    missionCode: string,
    options?: {
      clientEventId?: string;
    },
  ): MissionTransitionResponseDto {
    const { template, assignment } = this.getStudentMissionDetail(
      studentId,
      missionCode,
    );

    if (assignment.status === 'completed') {
      throw new BadRequestException({
        code: 'MISSION_ALREADY_COMPLETED',
        message: 'No es posible pausar una misión que ya fue completada.',
      });
    }

    const now = new Date().toISOString();
    const updated: MissionAssignmentEntity = {
      ...assignment,
      status: 'paused',
      pausedAt: now,
      lastClientEventId: options?.clientEventId ?? assignment.lastClientEventId,
      updatedAt: now,
    };

    this.repository.saveStudentAssignment(updated);

    return {
      mission: { template, assignment: updated },
      progress: this.getStudentProgress(studentId),
      idempotentReplay: false,
    };
  }

  skipMission(
    studentId: string,
    missionCode: string,
    options?: {
      reason?: string;
      clientEventId?: string;
      correlationId?: string;
    },
  ): MissionTransitionResponseDto {
    const replay = this.repository.getIdempotentTransition(
      studentId,
      options?.clientEventId,
    );
    if (replay) {
      return replay;
    }

    const { template, assignment } = this.getStudentMissionDetail(
      studentId,
      missionCode,
    );

    if (assignment.status === 'completed') {
      throw new BadRequestException({
        code: 'MISSION_ALREADY_COMPLETED',
        message: 'Esta misión ya fue completada previamente.',
      });
    }

    const now = new Date().toISOString();
    const updated: MissionAssignmentEntity = {
      ...assignment,
      status: 'skipped',
      skippedAt: now,
      skipReason: options?.reason?.trim() || 'Pospuesta para otro momento',
      lastClientEventId: options?.clientEventId ?? assignment.lastClientEventId,
      updatedAt: now,
    };

    this.repository.saveStudentAssignment(updated);
    this.emitLifecycleEvent(
      'mission.skipped.v1',
      studentId,
      template,
      updated,
      options?.correlationId,
      options?.clientEventId,
    );

    const response: MissionTransitionResponseDto = {
      mission: { template, assignment: updated },
      progress: this.getStudentProgress(studentId),
      idempotentReplay: false,
    };

    this.repository.saveIdempotentTransition(
      studentId,
      options?.clientEventId,
      response,
    );

    return response;
  }

  completeMission(
    studentId: string,
    missionCode: string,
    options?: {
      reflectionNote?: string;
      clientEventId?: string;
      correlationId?: string;
    },
  ): MissionTransitionResponseDto {
    const replay = this.repository.getIdempotentTransition(
      studentId,
      options?.clientEventId,
    );
    if (replay) {
      return replay;
    }

    const { template, assignment } = this.getStudentMissionDetail(
      studentId,
      missionCode,
    );

    if (assignment.status === 'completed') {
      const existingProgress = this.getStudentProgress(studentId);
      return {
        mission: { template, assignment },
        progress: existingProgress,
        feedback: this.buildCompletionFeedback(
          template,
          existingProgress,
          undefined,
        ),
        idempotentReplay: true,
      };
    }

    const now = new Date().toISOString();
    const updated: MissionAssignmentEntity = {
      ...assignment,
      status: 'completed',
      acceptedAt: assignment.acceptedAt ?? now,
      startedAt: assignment.startedAt ?? now,
      pausedAt: null,
      completedAt: now,
      reflectionNote:
        options?.reflectionNote?.trim() || assignment.reflectionNote,
      lastClientEventId: options?.clientEventId ?? assignment.lastClientEventId,
      updatedAt: now,
    };

    this.repository.saveStudentAssignment(updated);
    this.repository.recordPositiveInteraction(studentId, now);

    const unlockedAchievement = this.evaluateAndUnlockAchievements(
      studentId,
      now,
    );

    this.emitLifecycleEvent(
      'mission.completed.v1',
      studentId,
      template,
      updated,
      options?.correlationId,
      options?.clientEventId,
    );

    const progress = this.getStudentProgress(studentId);
    const feedback = this.buildCompletionFeedback(
      template,
      progress,
      unlockedAchievement,
    );

    const response: MissionTransitionResponseDto = {
      mission: { template, assignment: updated },
      progress,
      feedback,
      idempotentReplay: false,
    };

    this.repository.saveIdempotentTransition(
      studentId,
      options?.clientEventId,
      response,
    );

    return response;
  }

  getStudentProgress(studentId: string): StudentProgressSummaryDto {
    const assignments = this.repository.getStudentAssignments(studentId);
    const templatesByCode = new Map(
      this.repository.getAllTemplates().map((t) => [t.code, t]),
    );

    const completedAssignments = assignments.filter(
      (a) => a.status === 'completed',
    );
    const acceptedAssignments = assignments.filter(
      (a) =>
        a.status === 'accepted' ||
        a.status === 'in_progress' ||
        a.status === 'paused' ||
        a.status === 'completed',
    );
    const inProgressAssignments = assignments.filter(
      (a) => a.status === 'in_progress' || a.status === 'paused',
    );

    const workedCategoriesSet = new Set<MissionCategoryCode>();
    for (const completed of completedAssignments) {
      const tpl = templatesByCode.get(completed.missionCode);
      if (tpl) {
        workedCategoriesSet.add(tpl.category);
      }
    }

    const level = computeLevelDescriptor(completedAssignments.length);
    const continuity = this.repository.getStudentContinuity(studentId);
    const achievements = this.repository.getStudentAchievements(studentId);

    const continuityMessage =
      continuity.continuitySignal === 'recovery_suggested'
        ? 'Tu semana puede haber estado cargada. Retomar con una microacción de 5 minutos también cuenta.'
        : continuity.continuitySignal === 'gentle_pause'
          ? 'Puedes retomar a tu ritmo cuando lo decidas, sin perder ningún avance previo.'
          : 'Mantienes una continuidad saludable esta semana. Avanza paso a paso según tu disponibilidad.';

    const supportiveFeedback =
      completedAssignments.length === 0
        ? 'Elige una misión breve de 5 a 10 minutos para dar tu primer paso de la semana.'
        : `Has completado ${completedAssignments.length} ${
            completedAssignments.length === 1 ? 'misión' : 'misiones'
          } a tu propio ritmo en el nivel "${level.levelTitle}".`;

    return {
      studentId,
      ruleVersion: CURRENT_GAMIFICATION_RULE_VERSION,
      levelNumber: level.levelNumber,
      levelCode: level.levelCode,
      levelTitle: level.levelTitle,
      completedMissionsCount: completedAssignments.length,
      acceptedMissionsCount: acceptedAssignments.length,
      inProgressMissionsCount: inProgressAssignments.length,
      nextLevelTargetMissions: level.nextLevelTargetMissions,
      weeklyActiveDays: continuity.weeklyActiveDays,
      weeklyCompletedMissions: completedAssignments.length,
      continuitySignal: continuity.continuitySignal,
      continuityMessage,
      workedCategories: Array.from(workedCategoriesSet),
      achievements,
      supportiveFeedback,
      lastInteractionAt: continuity.lastInteractionAt,
    };
  }

  getRecoveryState(studentId: string): RecoveryStateDto {
    const continuity = this.repository.getStudentContinuity(studentId);
    const eligibleMissions = this.repository
      .getAllTemplates()
      .filter((t) => t.isRecoveryEligible && t.effort === 'LOW')
      .map((t) => t.code);

    return {
      studentId,
      isRecoveryActive: continuity.isRecoveryActive,
      continuitySignal: continuity.continuitySignal,
      headline: '¿Cómo quieres retomar hoy?',
      supportiveCopy:
        'Retomar con algo pequeño también cuenta. Elige una opción breve sin perder ningún nivel ni logro previo.',
      lastActivatedAt: continuity.lastRecoveryActivatedAt,
      selectedChoice: continuity.selectedRecoveryChoice,
      recommendedRecoveryMissionCodes: eligibleMissions,
      recommendedResourceCodes: ['RES-ACA-03', 'RES-WEL-01', 'RES-ACAD-01'],
    };
  }

  activateRecovery(
    studentId: string,
    choice: RecoveryChoiceCode,
    options?: {
      clientEventId?: string;
      correlationId?: string;
    },
  ): RecoveryStateDto {
    const now = new Date().toISOString();
    this.repository.activateRecoveryMode(studentId, choice, now);

    const analyticsSubjectId =
      this.repository.getAnalyticsSubjectId(studentId);
    this.repository.recordDomainEvent({
      eventId: randomUUID(),
      eventType: 'recovery.activated.v1',
      occurredAt: now,
      actorId: analyticsSubjectId,
      subjectId: analyticsSubjectId,
      correlationId: options?.correlationId ?? randomUUID(),
      schemaVersion: 1,
      clientEventId: options?.clientEventId,
      payload: {
        choice,
        ruleVersion: CURRENT_GAMIFICATION_RULE_VERSION,
      },
    });

    return this.getRecoveryState(studentId);
  }

  private evaluateAndUnlockAchievements(
    studentId: string,
    unlockedAt: string,
  ): PersonalAchievementEntity | undefined {
    const assignments = this.repository.getStudentAssignments(studentId);
    const completed = assignments.filter((a) => a.status === 'completed');
    const templatesByCode = new Map(
      this.repository.getAllTemplates().map((t) => [t.code, t]),
    );
    const existing = this.repository.getStudentAchievements(studentId);
    const existingCodes = new Set(existing.map((a) => a.achievementCode));

    let newlyUnlocked: PersonalAchievementEntity | undefined;

    if (completed.length >= 1 && !existingCodes.has('ACH-FIRST-STEP')) {
      newlyUnlocked = {
        achievementCode: 'ACH-FIRST-STEP',
        title: 'Primer paso autónomo',
        description:
          'Completaste tu primera misión de autorregulación académica en Vivu.',
        unlockedAt,
      };
      existing.push(newlyUnlocked);
    }

    if (completed.length >= 3 && !existingCodes.has('ACH-INITIAL-CONSISTENCY')) {
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
        .map((c) => templatesByCode.get(c.missionCode)?.category)
        .filter(Boolean),
    );
    if (categories.size >= 3 && !existingCodes.has('ACH-BALANCED-EXPLORER')) {
      newlyUnlocked = {
        achievementCode: 'ACH-BALANCED-EXPLORER',
        title: 'Equilibrio de estrategias',
        description:
          'Trabajaste al menos 3 dimensiones distintas de autorregulación y apoyo.',
        unlockedAt,
      };
      existing.push(newlyUnlocked);
    }

    this.repository.saveStudentAchievements(studentId, existing);
    return newlyUnlocked;
  }

  private buildCompletionFeedback(
    template: MissionTemplateEntity,
    progress: StudentProgressSummaryDto,
    unlockedAchievement?: PersonalAchievementEntity,
  ): MissionFeedbackBannerDto {
    const remainingForNextLevel =
      progress.nextLevelTargetMissions !== null
        ? Math.max(
            0,
            progress.nextLevelTargetMissions - progress.completedMissionsCount,
          )
        : 0;

    const levelProgressSummary =
      progress.nextLevelTargetMissions === null
        ? `Nivel ${progress.levelNumber} (${progress.levelTitle}) consolidado.`
        : remainingForNextLevel === 0
          ? `¡Alcanzaste el Nivel ${progress.levelNumber} (${progress.levelTitle})!`
          : `Nivel ${progress.levelNumber} (${progress.levelTitle}) · Te ${
              remainingForNextLevel === 1 ? 'falta 1 misión' : `faltan ${remainingForNextLevel} misiones`
            } para pasar al siguiente nivel personal.`;

    return {
      missionCode: template.code,
      missionTitle: template.title,
      encouragingMessage:
        '¡Paso completado! Cada acción concreta fortalece tu organización y autonomía esta semana.',
      levelProgressSummary,
      unlockedAchievement,
    };
  }

  private emitLifecycleEvent(
    eventType:
      | 'mission.assigned.v1'
      | 'mission.accepted.v1'
      | 'mission.completed.v1'
      | 'mission.skipped.v1',
    studentId: string,
    template: MissionTemplateEntity,
    assignment: MissionAssignmentEntity,
    correlationId?: string,
    clientEventId?: string,
  ): void {
    const analyticsSubjectId =
      this.repository.getAnalyticsSubjectId(studentId);

    this.repository.recordDomainEvent({
      eventId: randomUUID(),
      eventType,
      occurredAt: new Date().toISOString(),
      actorId: analyticsSubjectId,
      subjectId: analyticsSubjectId,
      correlationId: correlationId ?? randomUUID(),
      schemaVersion: 1,
      clientEventId,
      payload: {
        missionCode: template.code,
        missionVersion: template.version,
        category: template.category,
        status: assignment.status,
        ruleVersion: assignment.ruleVersion,
        isRecoveryEligible: template.isRecoveryEligible,
      },
    });
  }
}

