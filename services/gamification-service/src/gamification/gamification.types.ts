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

export type RecoveryChoiceCode =
  | 'MICRO_MISSION_5M'
  | 'REORGANIZE_PRIORITY'
  | 'CONSULT_RESOURCE'
  | 'REQUEST_SUPPORT'
  | 'LATER';

export interface RecoveryStateDto {
  studentId: string;
  isRecoveryActive: boolean;
  continuitySignal: ContinuitySignal;
  headline: string;
  supportiveCopy: string;
  lastActivatedAt: string | null;
  selectedChoice: RecoveryChoiceCode | null;
  recommendedRecoveryMissionCodes: string[];
  recommendedResourceCodes: string[];
}

export const CURRENT_GAMIFICATION_RULE_VERSION = '1.0.0';

export interface MissionTemplateEntity {
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

export interface MissionAssignmentEntity {
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

export interface PersonalAchievementEntity {
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
  achievements: PersonalAchievementEntity[];
  supportiveFeedback: string;
  lastInteractionAt: string | null;
}

export interface StudentMissionViewDto {
  template: MissionTemplateEntity;
  assignment: MissionAssignmentEntity;
}

export interface MissionFeedbackBannerDto {
  missionCode: string;
  missionTitle: string;
  encouragingMessage: string;
  levelProgressSummary: string;
  unlockedAchievement?: PersonalAchievementEntity;
}

export interface MissionTransitionResponseDto {
  mission: StudentMissionViewDto;
  progress: StudentProgressSummaryDto;
  feedback?: MissionFeedbackBannerDto;
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

