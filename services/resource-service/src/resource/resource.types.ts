export type ResourceCategoryCode =
  | 'PLANNING'
  | 'STUDY_HABITS'
  | 'ACADEMIC_SUPPORT'
  | 'WELLBEING_BALANCE'
  | 'CAMPUS_INTEGRATION';

export type ResourceLifecycleStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'NEEDS_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'ARCHIVED';

export type ResourceSourceType =
  | 'OFFICIAL_INSTITUTIONAL_PORTAL'
  | 'INSTITUTIONAL_STAFF_ADMIN'
  | 'VERIFIED_PROFESSOR'
  | 'INSTITUTIONAL_EMAIL_VERIFIED_SENDER'
  | 'UNVERIFIED_MANUAL_SUBMISSION';

export type ContributorTrustLevel =
  | 'STANDARD_CONTRIBUTOR'
  | 'VERIFIED'
  | 'INSTITUTIONAL_EDITOR';

export interface InstitutionalResourceEntity {
  resourceId: string;
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
  tags: string[];
  status: ResourceLifecycleStatus;
  sourceType: ResourceSourceType;
  sourceOriginUrlOrMailbox: string;
  contributorUserId: string;
  contributorRole: 'PROFESSOR' | 'ADMIN';
  contributorTrustLevel: ContributorTrustLevel;
  extractionConfidenceScore: number;
  humanReviewed: boolean;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  validFrom: string;
  validUntil: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceVersionRecordEntity {
  versionId: string;
  resourceCode: string;
  versionNumber: number;
  changedByUserId: string;
  changeReason: string;
  snapshotStatus: ResourceLifecycleStatus;
  createdAt: string;
}

export interface SubmitResourceProposalInput {
  code?: string;
  title: string;
  category: ResourceCategoryCode;
  summary: string;
  targetAudience: string;
  modality: string;
  scheduleInfo: string;
  locationOrLink: string;
  contactInfo: string;
  organizerUnit: string;
  tags?: string[];
  validUntil?: string | null;
}

export interface DomainEventRecord {
  eventId: string;
  eventType: string;
  occurredAt: string;
  actorId: string;
  subjectId: string;
  correlationId: string;
  schemaVersion: number;
  payload: Record<string, unknown>;
}

