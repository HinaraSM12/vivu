export const CONSENT_STATUSES = ['pending', 'accepted', 'withdrawn'] as const;
export type ConsentStatus = (typeof CONSENT_STATUSES)[number];

export const PERCEIVED_LOAD_LEVELS = ['low', 'moderate', 'high'] as const;
export type PerceivedLoad = (typeof PERCEIVED_LOAD_LEVELS)[number];

export const PREFERRED_TONES = ['warm', 'neutral', 'concise'] as const;
export type PreferredTone = (typeof PREFERRED_TONES)[number];

export const CURRENT_CONSENT_VERSION = '1.0';

export const FORBIDDEN_SENSITIVE_PROFILE_FIELDS = [
  'gpa',
  'grades',
  'academicHistory',
  'institutionalIdNumber',
  'clinicalDiagnosis',
  'clinicalStressDiagnosis',
  'mentalHealthDiagnosis',
] as const;

export interface ConsentRecordDto {
  studentId: string;
  consentVersion: string;
  status: ConsentStatus;
  acceptedAt?: string;
  withdrawnAt?: string;
}

export interface PersonalizationPreferencesDto {
  studentId: string;
  allowPersonalization: boolean;
  allowOptionalWellbeingContext: boolean;
  preferredTone: PreferredTone;
  updatedAt: string;
}

export interface WellbeingInputsDto {
  motivationLevel?: 1 | 2 | 3 | 4 | 5;
  organizationDifficulty?: PerceivedLoad;
  stressPerception?: PerceivedLoad;
  preferredSupportGoal?: string;
}

export interface StudentProfileDto {
  studentId: string;
  engineeringProgram: string;
  semester: number;
  perceivedLoad: PerceivedLoad;
  difficultSubjects: string[];
  weeklyAvailabilityMinutes: number;
  externalResponsibilities: string[];
  studyPractices: string[];
  interests: string[];
  wellbeingInputs: WellbeingInputsDto | null;
  onboardingCompleted: boolean;
  version: number;
  updatedAt: string;
}

export interface UpdateStudentProfileInput {
  engineeringProgram: string;
  semester: number;
  perceivedLoad: PerceivedLoad;
  difficultSubjects: string[];
  weeklyAvailabilityMinutes: number;
  externalResponsibilities: string[];
  studyPractices: string[];
  interests: string[];
  wellbeingInputs?: WellbeingInputsDto | null;
}

export interface ConsentUpdatedEventPayload extends Record<string, unknown> {
  status: ConsentStatus;
  consentVersion: string;
}

export interface StudentProfileUpdatedEventPayload
  extends Record<string, unknown> {
  changedFieldCodes: string[];
}

export function findForbiddenProfileFields(
  input: Record<string, unknown>,
): string[] {
  return FORBIDDEN_SENSITIVE_PROFILE_FIELDS.filter(
    (field) => field in input && input[field] !== undefined,
  );
}
