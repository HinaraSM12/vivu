import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

export type ConsentStatus = 'pending' | 'accepted' | 'withdrawn';
export type PerceivedLoad = 'low' | 'moderate' | 'high';
export type PreferredTone = 'warm' | 'neutral' | 'concise';

export const CURRENT_CONSENT_VERSION = '1.0';
const FORBIDDEN_PROFILE_FIELDS = [
  'gpa',
  'grades',
  'academicHistory',
  'institutionalIdNumber',
  'clinicalDiagnosis',
] as const;
const VALID_LOADS = new Set<PerceivedLoad>(['low', 'moderate', 'high']);
const VALID_TONES = new Set<PreferredTone>(['warm', 'neutral', 'concise']);

export interface GatewayConsentRecord {
  id: string;
  studentId: string;
  consentVersion: string;
  status: ConsentStatus;
  acceptedAt?: string;
  withdrawnAt?: string;
}

export interface GatewayPersonalizationPreferences {
  studentId: string;
  allowPersonalization: boolean;
  allowOptionalWellbeingContext: boolean;
  preferredTone: PreferredTone;
  updatedAt: string;
}

export interface GatewayWellbeingInputs {
  motivationLevel?: 1 | 2 | 3 | 4 | 5;
  stressPerception?: PerceivedLoad;
  preferredSupportGoal?: string;
}

export interface GatewayStudentProfile {
  studentId: string;
  engineeringProgram: string;
  semester: number;
  perceivedLoad: PerceivedLoad;
  difficultSubjects: string[];
  weeklyAvailabilityMinutes: number;
  externalResponsibilities: string[];
  studyPractices: string[];
  interests: string[];
  wellbeingInputs: GatewayWellbeingInputs | null;
  onboardingCompleted: boolean;
  version: number;
  updatedAt: string;
}

@Injectable()
export class GatewayStudentService {
  private readonly consents = new Map<string, GatewayConsentRecord>();
  private readonly preferences = new Map<
    string,
    GatewayPersonalizationPreferences
  >();
  private readonly profiles = new Map<string, GatewayStudentProfile>();

  constructor() {
    this.seedDefaults();
  }

  getConsent(studentId: string): GatewayConsentRecord {
    const existing = this.consents.get(studentId);
    if (existing) {
      return { ...existing };
    }
    return {
      id: randomUUID(),
      studentId,
      consentVersion: CURRENT_CONSENT_VERSION,
      status: 'pending',
    };
  }

  acceptConsent(
    studentId: string,
    body?: {
      consentVersion?: string;
      allowPersonalization?: boolean;
      allowOptionalWellbeingContext?: boolean;
      preferredTone?: PreferredTone;
    },
  ): {
    consent: GatewayConsentRecord;
    preferences: GatewayPersonalizationPreferences;
  } {
    const version = body?.consentVersion ?? CURRENT_CONSENT_VERSION;
    if (version !== CURRENT_CONSENT_VERSION) {
      throw new BadRequestException({
        code: 'UNSUPPORTED_CONSENT_VERSION',
        message: `La versión de consentimiento debe ser ${CURRENT_CONSENT_VERSION}.`,
      });
    }

    const nowIso = new Date().toISOString();
    const consent: GatewayConsentRecord = {
      id: randomUUID(),
      studentId,
      consentVersion: version,
      status: 'accepted',
      acceptedAt: nowIso,
    };
    this.consents.set(studentId, consent);

    const prevPrefs = this.getPreferences(studentId);
    const prefs: GatewayPersonalizationPreferences = {
      studentId,
      allowPersonalization: body?.allowPersonalization ?? true,
      allowOptionalWellbeingContext:
        body?.allowOptionalWellbeingContext ??
        prevPrefs.allowOptionalWellbeingContext,
      preferredTone:
        body?.preferredTone && VALID_TONES.has(body.preferredTone)
          ? body.preferredTone
          : prevPrefs.preferredTone,
      updatedAt: nowIso,
    };
    this.preferences.set(studentId, prefs);

    return { consent: { ...consent }, preferences: { ...prefs } };
  }

  withdrawConsent(studentId: string): {
    consent: GatewayConsentRecord;
    preferences: GatewayPersonalizationPreferences;
  } {
    const current = this.getConsent(studentId);
    const nowIso = new Date().toISOString();

    const consent: GatewayConsentRecord = {
      ...current,
      status: 'withdrawn',
      withdrawnAt: nowIso,
    };
    this.consents.set(studentId, consent);

    const prefs: GatewayPersonalizationPreferences = {
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

  getProfile(studentId: string): GatewayStudentProfile {
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
      engineeringProgram: '',
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

  updateProfile(
    studentId: string,
    payload: Record<string, unknown>,
  ): GatewayStudentProfile {
    const consent = this.getConsent(studentId);
    if (consent.status !== 'accepted') {
      throw new ForbiddenException({
        code: 'CONSENT_REQUIRED',
        message:
          'Debes aceptar el consentimiento informado vigente antes de guardar tu perfil.',
      });
    }

    const forbidden = FORBIDDEN_PROFILE_FIELDS.filter(
      (f) => f in payload && payload[f] !== undefined,
    );
    if (forbidden.length > 0) {
      throw new BadRequestException({
        code: 'UNSUPPORTED_SENSITIVE_FIELD',
        message: `No se permite almacenar calificaciones ni historia académica (${forbidden.join(', ')}).`,
        details: { forbiddenFields: forbidden },
      });
    }

    const engineeringProgram = String(
      payload.engineeringProgram ?? '',
    ).trim();
    if (!engineeringProgram) {
      throw new BadRequestException({
        code: 'INVALID_ENGINEERING_PROGRAM',
        message: 'El programa de ingeniería es obligatorio.',
      });
    }

    const semester = Number(payload.semester);
    if (!Number.isInteger(semester) || semester < 1 || semester > 12) {
      throw new BadRequestException({
        code: 'INVALID_SEMESTER',
        message: 'El semestre debe estar entre 1 y 12.',
      });
    }

    const perceivedLoad = (payload.perceivedLoad ??
      'moderate') as PerceivedLoad;
    if (!VALID_LOADS.has(perceivedLoad)) {
      throw new BadRequestException({
        code: 'INVALID_PERCEIVED_LOAD',
        message: 'Carga percibida inválida.',
      });
    }

    const weeklyAvailabilityMinutes = Number(
      payload.weeklyAvailabilityMinutes ?? 120,
    );
    if (
      !Number.isInteger(weeklyAvailabilityMinutes) ||
      weeklyAvailabilityMinutes < 15 ||
      weeklyAvailabilityMinutes > 1200
    ) {
      throw new BadRequestException({
        code: 'INVALID_WEEKLY_AVAILABILITY',
        message:
          'La disponibilidad semanal debe estar entre 15 y 1200 minutos.',
      });
    }

    const prefs = this.getPreferences(studentId);
    const current = this.getProfile(studentId);
    const nowIso = new Date().toISOString();

    const rawWellbeing = payload.wellbeingInputs as
      | GatewayWellbeingInputs
      | null
      | undefined;

    const updated: GatewayStudentProfile = {
      studentId,
      engineeringProgram,
      semester,
      perceivedLoad,
      difficultSubjects: Array.isArray(payload.difficultSubjects)
        ? payload.difficultSubjects.map((s) => String(s).trim()).filter(Boolean)
        : current.difficultSubjects,
      weeklyAvailabilityMinutes,
      externalResponsibilities: Array.isArray(payload.externalResponsibilities)
        ? payload.externalResponsibilities
            .map((s) => String(s).trim())
            .filter(Boolean)
        : current.externalResponsibilities,
      studyPractices: Array.isArray(payload.studyPractices)
        ? payload.studyPractices.map((s) => String(s).trim()).filter(Boolean)
        : current.studyPractices,
      interests: Array.isArray(payload.interests)
        ? payload.interests.map((s) => String(s).trim()).filter(Boolean)
        : current.interests,
      wellbeingInputs:
        prefs.allowOptionalWellbeingContext && rawWellbeing
          ? {
              motivationLevel: rawWellbeing.motivationLevel,
              stressPerception: rawWellbeing.stressPerception,
              preferredSupportGoal: rawWellbeing.preferredSupportGoal?.trim(),
            }
          : null,
      onboardingCompleted: true,
      version: current.version + 1,
      updatedAt: nowIso,
    };

    this.profiles.set(studentId, updated);
    return this.getProfile(studentId);
  }

  getPreferences(studentId: string): GatewayPersonalizationPreferences {
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
    body?: {
      allowPersonalization?: boolean;
      allowOptionalWellbeingContext?: boolean;
      preferredTone?: PreferredTone;
    },
  ): GatewayPersonalizationPreferences {
    const consent = this.getConsent(studentId);
    if (consent.status !== 'accepted') {
      throw new ForbiddenException({
        code: 'CONSENT_REQUIRED',
        message: 'Se requiere consentimiento vigente.',
      });
    }

    const current = this.getPreferences(studentId);
    const nextAllowWellbeing =
      body?.allowOptionalWellbeingContext ??
      current.allowOptionalWellbeingContext;

    const updated: GatewayPersonalizationPreferences = {
      studentId,
      allowPersonalization:
        body?.allowPersonalization ?? current.allowPersonalization,
      allowOptionalWellbeingContext: nextAllowWellbeing,
      preferredTone:
        body?.preferredTone && VALID_TONES.has(body.preferredTone)
          ? body.preferredTone
          : current.preferredTone,
      updatedAt: new Date().toISOString(),
    };
    this.preferences.set(studentId, updated);

    if (!nextAllowWellbeing) {
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

  private seedDefaults(): void {
    const nowIso = new Date().toISOString();
    const activeStudentId = '00000000-0000-4000-8000-000000000004';
    const recoveryStudentId = '00000000-0000-4000-8000-000000000005';

    this.consents.set(activeStudentId, {
      id: randomUUID(),
      studentId: activeStudentId,
      consentVersion: CURRENT_CONSENT_VERSION,
      status: 'accepted',
      acceptedAt: nowIso,
    });
    this.preferences.set(activeStudentId, {
      studentId: activeStudentId,
      allowPersonalization: true,
      allowOptionalWellbeingContext: true,
      preferredTone: 'warm',
      updatedAt: nowIso,
    });
    this.profiles.set(activeStudentId, {
      studentId: activeStudentId,
      engineeringProgram: 'Ingeniería de Sistemas e Informática',
      semester: 3,
      perceivedLoad: 'moderate',
      difficultSubjects: ['Cálculo en Varias Variables', 'Física de Oscilaciones'],
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

    this.consents.set(recoveryStudentId, {
      id: randomUUID(),
      studentId: recoveryStudentId,
      consentVersion: CURRENT_CONSENT_VERSION,
      status: 'accepted',
      acceptedAt: nowIso,
    });
    this.preferences.set(recoveryStudentId, {
      studentId: recoveryStudentId,
      allowPersonalization: true,
      allowOptionalWellbeingContext: true,
      preferredTone: 'warm',
      updatedAt: nowIso,
    });
    this.profiles.set(recoveryStudentId, {
      studentId: recoveryStudentId,
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
}

