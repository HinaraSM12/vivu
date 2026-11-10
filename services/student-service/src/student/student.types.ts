export type ConsentStatus = 'pending' | 'accepted' | 'withdrawn';
export type PerceivedLoad = 'low' | 'moderate' | 'high';
export type PreferredTone = 'warm' | 'neutral' | 'concise';

export const CURRENT_CONSENT_VERSION = '1.0';
export const FORBIDDEN_PROFILE_FIELDS = [
  'gpa',
  'grades',
  'academicHistory',
  'institutionalIdNumber',
  'clinicalDiagnosis',
] as const;

export interface ConsentRecordEntity {
  id: string;
  studentId: string;
  consentVersion: string;
  status: ConsentStatus;
  acceptedAt?: string;
  withdrawnAt?: string;
}

export interface PersonalizationPreferencesEntity {
  studentId: string;
  allowPersonalization: boolean;
  allowOptionalWellbeingContext: boolean;
  preferredTone: PreferredTone;
  updatedAt: string;
}

export interface WellbeingInputs {
  motivationLevel?: 1 | 2 | 3 | 4 | 5;
  stressPerception?: PerceivedLoad;
  preferredSupportGoal?: string;
}

export interface StudentProfileEntity {
  studentId: string;
  analyticsSubjectId: string;
  engineeringProgram: string;
  semester: number;
  perceivedLoad: PerceivedLoad;
  difficultSubjects: string[];
  weeklyAvailabilityMinutes: number;
  externalResponsibilities: string[];
  studyPractices: string[];
  interests: string[];
  wellbeingInputs: WellbeingInputs | null;
  onboardingCompleted: boolean;
  version: number;
  updatedAt: string;
}

export interface StudentProfileResponseDto {
  studentId: string;
  engineeringProgram: string;
  semester: number;
  perceivedLoad: PerceivedLoad;
  difficultSubjects: string[];
  weeklyAvailabilityMinutes: number;
  externalResponsibilities: string[];
  studyPractices: string[];
  interests: string[];
  wellbeingInputs: WellbeingInputs | null;
  onboardingCompleted: boolean;
  version: number;
  updatedAt: string;
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

