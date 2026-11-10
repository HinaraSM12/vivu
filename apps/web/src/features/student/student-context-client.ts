export type ConsentStatus = 'pending' | 'accepted' | 'withdrawn';
export type PerceivedLoad = 'low' | 'moderate' | 'high';
export type PreferredTone = 'warm' | 'neutral' | 'concise';

export interface StudentConsentRecord {
  studentId: string;
  consentVersion: string;
  status: ConsentStatus;
  acceptedAt?: string;
  withdrawnAt?: string;
}

export interface StudentPersonalizationPreferences {
  studentId: string;
  allowPersonalization: boolean;
  allowOptionalWellbeingContext: boolean;
  preferredTone: PreferredTone;
  updatedAt: string;
}

export interface StudentWellbeingInputs {
  motivationLevel?: 1 | 2 | 3 | 4 | 5;
  stressPerception?: PerceivedLoad;
  preferredSupportGoal?: string;
}

export interface StudentProfileRecord {
  studentId: string;
  engineeringProgram: string;
  semester: number;
  perceivedLoad: PerceivedLoad;
  difficultSubjects: string[];
  weeklyAvailabilityMinutes: number;
  externalResponsibilities: string[];
  studyPractices: string[];
  interests: string[];
  wellbeingInputs: StudentWellbeingInputs | null;
  onboardingCompleted: boolean;
  version: number;
  updatedAt: string;
}

const ACTIVE_STUDENT_ID = '00000000-0000-4000-8000-000000000004';
const RECOVERY_STUDENT_ID = '00000000-0000-4000-8000-000000000005';

export class StudentContextClient {
  private readonly consents = new Map<string, StudentConsentRecord>();
  private readonly preferences = new Map<
    string,
    StudentPersonalizationPreferences
  >();
  private readonly profiles = new Map<string, StudentProfileRecord>();

  constructor() {
    this.reset();
  }

  reset(): void {
    this.consents.clear();
    this.preferences.clear();
    this.profiles.clear();

    const nowIso = new Date().toISOString();

    this.consents.set(ACTIVE_STUDENT_ID, {
      studentId: ACTIVE_STUDENT_ID,
      consentVersion: '1.0',
      status: 'accepted',
      acceptedAt: nowIso,
    });
    this.preferences.set(ACTIVE_STUDENT_ID, {
      studentId: ACTIVE_STUDENT_ID,
      allowPersonalization: true,
      allowOptionalWellbeingContext: true,
      preferredTone: 'warm',
      updatedAt: nowIso,
    });
    this.profiles.set(ACTIVE_STUDENT_ID, {
      studentId: ACTIVE_STUDENT_ID,
      engineeringProgram: 'Ingeniería de Sistemas e Informática',
      semester: 3,
      perceivedLoad: 'moderate',
      difficultSubjects: [
        'Cálculo en Varias Variables',
        'Física de Oscilaciones',
      ],
      weeklyAvailabilityMinutes: 180,
      externalResponsibilities: ['familia'],
      studyPractices: ['planificacion_semanal', 'bloques_cortos'],
      interests: ['programacion', 'organizacion'],
      wellbeingInputs: {
        motivationLevel: 4,
        stressPerception: 'moderate',
        preferredSupportGoal: 'Sostener constancia semanal sin saturarme',
      },
      onboardingCompleted: true,
      version: 1,
      updatedAt: nowIso,
    });

    this.consents.set(RECOVERY_STUDENT_ID, {
      studentId: RECOVERY_STUDENT_ID,
      consentVersion: '1.0',
      status: 'accepted',
      acceptedAt: nowIso,
    });
    this.preferences.set(RECOVERY_STUDENT_ID, {
      studentId: RECOVERY_STUDENT_ID,
      allowPersonalization: true,
      allowOptionalWellbeingContext: true,
      preferredTone: 'warm',
      updatedAt: nowIso,
    });
    this.profiles.set(RECOVERY_STUDENT_ID, {
      studentId: RECOVERY_STUDENT_ID,
      engineeringProgram: 'Ingeniería Civil',
      semester: 2,
      perceivedLoad: 'high',
      difficultSubjects: ['Estática', 'Cálculo Integral'],
      weeklyAvailabilityMinutes: 90,
      externalResponsibilities: ['trabajo_parcial'],
      studyPractices: ['repaso_previo_parcial'],
      interests: ['monitorias', 'gestion_tiempo'],
      wellbeingInputs: {
        motivationLevel: 3,
        stressPerception: 'high',
        preferredSupportGoal: 'Retomar con pasos pequeños esta semana',
      },
      onboardingCompleted: true,
      version: 1,
      updatedAt: nowIso,
    });
  }

  getConsent(studentId: string): StudentConsentRecord {
    const existing = this.consents.get(studentId);
    if (existing) {
      return { ...existing };
    }
    return {
      studentId,
      consentVersion: '1.0',
      status: 'pending',
    };
  }

  acceptConsent(
    studentId: string,
    options?: {
      allowPersonalization?: boolean;
      allowOptionalWellbeingContext?: boolean;
      preferredTone?: PreferredTone;
    },
  ): {
    consent: StudentConsentRecord;
    preferences: StudentPersonalizationPreferences;
  } {
    const nowIso = new Date().toISOString();
    const consent: StudentConsentRecord = {
      studentId,
      consentVersion: '1.0',
      status: 'accepted',
      acceptedAt: nowIso,
    };
    this.consents.set(studentId, consent);

    const prefs: StudentPersonalizationPreferences = {
      studentId,
      allowPersonalization: options?.allowPersonalization ?? true,
      allowOptionalWellbeingContext:
        options?.allowOptionalWellbeingContext ?? true,
      preferredTone: options?.preferredTone ?? 'warm',
      updatedAt: nowIso,
    };
    this.preferences.set(studentId, prefs);

    return { consent: { ...consent }, preferences: { ...prefs } };
  }

  withdrawConsent(studentId: string): {
    consent: StudentConsentRecord;
    preferences: StudentPersonalizationPreferences;
  } {
    const nowIso = new Date().toISOString();
    const current = this.getConsent(studentId);
    const consent: StudentConsentRecord = {
      ...current,
      status: 'withdrawn',
      withdrawnAt: nowIso,
    };
    this.consents.set(studentId, consent);

    const prefs: StudentPersonalizationPreferences = {
      studentId,
      allowPersonalization: false,
      allowOptionalWellbeingContext: false,
      preferredTone: 'neutral',
      updatedAt: nowIso,
    };
    this.preferences.set(studentId, prefs);

    const profile = this.getProfile(studentId);
    if (profile.wellbeingInputs !== null) {
      this.profiles.set(studentId, {
        ...profile,
        wellbeingInputs: null,
        version: profile.version + 1,
        updatedAt: nowIso,
      });
    }

    return { consent: { ...consent }, preferences: { ...prefs } };
  }

  getPreferences(studentId: string): StudentPersonalizationPreferences {
    const existing = this.preferences.get(studentId);
    if (existing) {
      return { ...existing };
    }
    return {
      studentId,
      allowPersonalization: true,
      allowOptionalWellbeingContext: false,
      preferredTone: 'warm',
      updatedAt: new Date().toISOString(),
    };
  }

  updatePreferences(
    studentId: string,
    input: Partial<
      Pick<
        StudentPersonalizationPreferences,
        | 'allowPersonalization'
        | 'allowOptionalWellbeingContext'
        | 'preferredTone'
      >
    >,
  ): StudentPersonalizationPreferences {
    const current = this.getPreferences(studentId);
    const nextWellbeing =
      input.allowOptionalWellbeingContext ??
      current.allowOptionalWellbeingContext;

    const updated: StudentPersonalizationPreferences = {
      studentId,
      allowPersonalization:
        input.allowPersonalization ?? current.allowPersonalization,
      allowOptionalWellbeingContext: nextWellbeing,
      preferredTone: input.preferredTone ?? current.preferredTone,
      updatedAt: new Date().toISOString(),
    };
    this.preferences.set(studentId, updated);

    if (!nextWellbeing) {
      const profile = this.getProfile(studentId);
      if (profile.wellbeingInputs !== null) {
        this.profiles.set(studentId, {
          ...profile,
          wellbeingInputs: null,
          version: profile.version + 1,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return { ...updated };
  }

  getProfile(studentId: string): StudentProfileRecord {
    const existing = this.profiles.get(studentId);
    if (existing) {
      return {
        ...existing,
        difficultSubjects: [...existing.difficultSubjects],
        externalResponsibilities: [...existing.externalResponsibilities],
        studyPractices: [...existing.studyPractices],
        interests: [...existing.interests],
        wellbeingInputs: existing.wellbeingInputs
          ? { ...existing.wellbeingInputs }
          : null,
      };
    }

    return {
      studentId,
      engineeringProgram: 'Ingeniería de Sistemas e Informática',
      semester: 1,
      perceivedLoad: 'moderate',
      difficultSubjects: [],
      weeklyAvailabilityMinutes: 120,
      externalResponsibilities: [],
      studyPractices: [],
      interests: [],
      wellbeingInputs: null,
      onboardingCompleted: false,
      version: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  saveProfile(
    studentId: string,
    input: {
      engineeringProgram: string;
      semester: number;
      perceivedLoad: PerceivedLoad;
      difficultSubjects: string[];
      weeklyAvailabilityMinutes: number;
      externalResponsibilities: string[];
      studyPractices: string[];
      interests: string[];
      wellbeingInputs: StudentWellbeingInputs | null;
    },
  ): StudentProfileRecord {
    const consent = this.getConsent(studentId);
    if (consent.status !== 'accepted') {
      throw new Error(
        'Debes aceptar el consentimiento informado vigente antes de guardar tu perfil.',
      );
    }

    const prefs = this.getPreferences(studentId);
    const current = this.getProfile(studentId);
    const nowIso = new Date().toISOString();

    const updated: StudentProfileRecord = {
      studentId,
      engineeringProgram: input.engineeringProgram.trim(),
      semester: input.semester,
      perceivedLoad: input.perceivedLoad,
      difficultSubjects: input.difficultSubjects
        .map((s) => s.trim())
        .filter(Boolean),
      weeklyAvailabilityMinutes: input.weeklyAvailabilityMinutes,
      externalResponsibilities: input.externalResponsibilities
        .map((s) => s.trim())
        .filter(Boolean),
      studyPractices: input.studyPractices.map((s) => s.trim()).filter(Boolean),
      interests: input.interests.map((s) => s.trim()).filter(Boolean),
      wellbeingInputs: prefs.allowOptionalWellbeingContext
        ? input.wellbeingInputs
        : null,
      onboardingCompleted: true,
      version: current.version + 1,
      updatedAt: nowIso,
    };

    this.profiles.set(studentId, updated);
    return this.getProfile(studentId);
  }
}

export const defaultStudentContextClient = new StudentContextClient();

