export const RESOURCE_SOURCE_TYPES = [
  'WEB_OFFICIAL',
  'MAIL_AUTHORIZED',
  'MANUAL_PROFESSOR',
  'MANUAL_ADMIN',
  'MANUAL_RESEARCHER',
  'OTHER_AUTHORIZED',
] as const;
export type ResourceSourceType = (typeof RESOURCE_SOURCE_TYPES)[number];

export const RESOURCE_LIFECYCLE_STATUSES = [
  'DRAFT',
  'PENDING_REVIEW',
  'NEEDS_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'REJECTED',
  'EXPIRED',
  'ARCHIVED',
] as const;
export type ResourceLifecycleStatus =
  (typeof RESOURCE_LIFECYCLE_STATUSES)[number];

export const CONTRIBUTOR_TRUST_LEVELS = [
  'STANDARD_CONTRIBUTOR',
  'TRUSTED_CONTRIBUTOR',
] as const;
export type ContributorTrustLevel = (typeof CONTRIBUTOR_TRUST_LEVELS)[number];

export const STUDENT_RECOMMENDATION_ACTIONS = [
  'ACCEPT',
  'REJECT',
  'POSTPONE',
  'EDIT',
  'DISMISS_SIMILAR',
] as const;
export type StudentRecommendationAction =
  (typeof STUDENT_RECOMMENDATION_ACTIONS)[number];

export const TELEMETRY_EVENT_TYPES = [
  'SESSION_STARTED',
  'MISSION_SHOWN',
  'MISSION_ACCEPTED',
  'MISSION_REJECTED',
  'MISSION_COMPLETED',
  'MISSION_POSTPONED',
  'RECOVERY_MODE_ACTIVATED',
  'RECOMMENDATION_SHOWN',
  'RECOMMENDATION_ACCEPTED',
  'RECOMMENDATION_REJECTED',
  'RESOURCE_OPENED',
  'RESOURCE_REPORTED_USED',
  'LLM_REQUESTED',
  'LLM_FALLBACK',
  'ERROR_OCCURRED',
  'SESSION_ENDED',
] as const;
export type TelemetryEventType = (typeof TELEMETRY_EVENT_TYPES)[number];

export const DEFAULT_SOURCE_PRIORITY_HIERARCHY: readonly ResourceSourceType[] =
  [
    'MANUAL_ADMIN',
    'MANUAL_PROFESSOR',
    'WEB_OFFICIAL',
    'MAIL_AUTHORIZED',
    'MANUAL_RESEARCHER',
    'OTHER_AUTHORIZED',
  ] as const;

export interface InstitutionalResourceDto {
  resourceId: string;
  title: string;
  category: string;
  description: string;
  targetPopulation: string;
  eligibility: string;
  programs: string[];
  semesters: number[];
  startDate?: string;
  endDate?: string;
  schedule: string;
  location: string;
  modality: 'PRESENTIAL' | 'VIRTUAL' | 'HYBRID';
  contact: string;
  registrationUrl?: string;
  sourceUrl?: string;
  sourceMessageId?: string;
  sourceType: ResourceSourceType;
  sourceName: string;
  ownerUnit: string;
  createdAt: string;
  updatedAt: string;
  fetchedAt?: string;
  lastVerifiedAt?: string;
  status: ResourceLifecycleStatus;
  createdBy: string;
  verifiedBy?: string;
  publishedBy?: string;
  version: number;
}

export interface ResourceVersionRecordDto {
  versionId: string;
  resourceId: string;
  previousValue: Record<string, unknown>;
  newValue: Record<string, unknown>;
  changedBy: string;
  changedAt: string;
  reason: string;
}

export interface LlmExtractedResourcePayload {
  title: string;
  category: string;
  target_population: string;
  eligibility: string;
  start_date: string;
  end_date: string;
  schedule: string;
  location: string;
  contact: string;
  registration_url: string;
  institution: string;
  source: string;
}

export interface RecommendationTraceRecordDto {
  recommendationId: string;
  participantIdPseudonym: string;
  resourceId: string | null;
  missionId: string | null;
  reasonCode: string;
  ruleVersion: string;
  promptVersion: string | null;
  modelVersion: string | null;
  shownAt: string;
  studentAction: StudentRecommendationAction | null;
}

export interface TelemetryEventRecordDto {
  eventId: string;
  participantIdPseudonym: string;
  timestamp: string;
  sessionId: string;
  eventType: TelemetryEventType;
  missionId?: string | null;
  recommendationId?: string | null;
  resourceId?: string | null;
  action?: string | null;
  status: 'SUCCESS' | 'FALLBACK' | 'ERROR' | 'TIMEOUT';
  latencyMs?: number | null;
  modelVersion?: string | null;
  promptVersion?: string | null;
}

export function canRecommendInstitutionalResource(
  resource: Pick<InstitutionalResourceDto, 'resourceId' | 'status'> | null | undefined,
): boolean {
  if (!resource || !resource.resourceId.trim()) {
    return false;
  }
  return resource.status === 'PUBLISHED';
}

export function sanitizeEmailContentBeforeLlm(rawText: string): string {
  return rawText
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]')
    .replace(/\b(?:\+?57\s?)?(?:3\d{2}[\s-]?\d{3}[\s-]?\d{4})\b/g, '[PHONE_REDACTED]')
    .replace(/\b(?:CC|TI|CE|Doc(?:umento)?)\s*[:#.]?\s*\d{6,12}\b/gi, '[ID_REDACTED]')
    .replace(/^(?:>|On .* wrote:|El .* escribió:).*$/gm, '')
    .trim();
}

