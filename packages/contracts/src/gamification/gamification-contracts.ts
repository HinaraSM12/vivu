export const MISSION_CATEGORY_CODES = [
  'PLANNING',
  'STUDY_HABITS',
  'ACADEMIC_SUPPORT',
  'WELLBEING_BALANCE',
  'CAMPUS_INTEGRATION',
] as const;

export type MissionCategoryCode = (typeof MISSION_CATEGORY_CODES)[number];

export const MISSION_EFFORT_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const;

export type MissionEffortLevel = (typeof MISSION_EFFORT_LEVELS)[number];

export const MISSION_ASSIGNMENT_STATUSES = [
  'available',
  'accepted',
  'in_progress',
  'paused',
  'skipped',
  'completed',
] as const;

export type MissionAssignmentStatus =
  (typeof MISSION_ASSIGNMENT_STATUSES)[number];

export const MISSION_LIST_FILTERS = [
  'today',
  'week',
  'all',
  'completed',
] as const;

export type MissionListFilter = (typeof MISSION_LIST_FILTERS)[number];

export const PROGRESS_LEVEL_CODES = [
  'EXPLORATION',
  'INITIAL_CONSISTENCY',
  'AUTONOMOUS_PACE',
  'CONSOLIDATED_SELF_REGULATION',
] as const;

export type ProgressLevelCode = (typeof PROGRESS_LEVEL_CODES)[number];

export const CONTINUITY_SIGNALS = [
  'active',
  'gentle_pause',
  'recovery_suggested',
] as const;

export type ContinuitySignal = (typeof CONTINUITY_SIGNALS)[number];

export const FORBIDDEN_COMPETITIVE_RANKING_FIELDS = [
  'publicRank',
  'leaderboardPosition',
  'percentile',
  'socialComparisonScore',
  'streakPenaltyPoints',
] as const;

export interface MissionTemplateDto {
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

export interface MissionAssignmentDto {
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

export interface StudentMissionViewDto {
  template: MissionTemplateDto;
  assignment: MissionAssignmentDto;
}

export interface PersonalAchievementDto {
  achievementCode: string;
  title: string;
  description: string;
  unlockedAt: string;
}

export interface StudentProgressSummaryDto {
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
  achievements: PersonalAchievementDto[];
  supportiveFeedback: string;
  lastInteractionAt: string | null;
}

export interface MissionFeedbackBannerDto {
  missionCode: string;
  missionTitle: string;
  encouragingMessage: string;
  levelProgressSummary: string;
  unlockedAchievement?: PersonalAchievementDto;
}

export interface MissionTransitionResponseDto {
  mission: StudentMissionViewDto;
  progress: StudentProgressSummaryDto;
  feedback?: MissionFeedbackBannerDto;
  idempotentReplay: boolean;
}

export interface AcceptMissionRequest {
  clientEventId?: string;
}

export interface StartMissionRequest {
  clientEventId?: string;
}

export interface PauseMissionRequest {
  clientEventId?: string;
}

export interface SkipMissionRequest {
  reason?: string;
  clientEventId?: string;
}

export interface CompleteMissionRequest {
  reflectionNote?: string;
  clientEventId?: string;
}

export interface MissionLifecycleEventPayload {
  missionCode: string;
  missionVersion: number;
  category: MissionCategoryCode;
  status: MissionAssignmentStatus;
  ruleVersion: string;
  isRecoveryEligible: boolean;
}

export interface ProgressLevelDescriptor {
  levelNumber: 1 | 2 | 3 | 4;
  levelCode: ProgressLevelCode;
  levelTitle: string;
  nextLevelTargetMissions: number | null;
}

export function computeProgressLevel(
  completedMissionsCount: number,
): ProgressLevelDescriptor {
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

export function findForbiddenCompetitiveFields(
  payload: Record<string, unknown>,
): string[] {
  const forbiddenSet = new Set<string>(FORBIDDEN_COMPETITIVE_RANKING_FIELDS);
  return Object.keys(payload).filter((key) => forbiddenSet.has(key));
}

