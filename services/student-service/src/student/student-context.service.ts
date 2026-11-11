import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { StudentRepository } from './student.repository';
import {
  type ConsentRecordEntity,
  CURRENT_CONSENT_VERSION,
  type DomainEventRecord,
  FORBIDDEN_PROFILE_FIELDS,
  type PerceivedLoad,
  type PersonalizationPreferencesEntity,
  type PreferredTone,
  type StudentProfileResponseDto,
  type WellbeingInputs,
} from './student.types';

const VALID_PERCEIVED_LOADS = new Set<PerceivedLoad>([
  'low',
  'moderate',
  'high',
]);
const VALID_TONES = new Set<PreferredTone>(['warm', 'neutral', 'concise']);

export interface AcceptConsentInput {
  studentId: string;
  consentVersion?: string;
  allowPersonalization?: boolean;
  allowOptionalWellbeingContext?: boolean;
  preferredTone?: PreferredTone;
  correlationId?: string;
}

export interface UpdateProfilePayload {
  engineeringProgram?: string;
  semester?: number;
  perceivedLoad?: PerceivedLoad;
  difficultSubjects?: string[];
  weeklyAvailabilityMinutes?: number;
  externalResponsibilities?: string[];
  studyPractices?: string[];
  interests?: string[];
  wellbeingInputs?: WellbeingInputs | null;
  [key: string]: unknown;
}

@Injectable()
export class StudentContextService {
  constructor(
    @Inject(StudentRepository)
    private readonly repository: StudentRepository,
  ) {}

  getConsent(studentId: string): ConsentRecordEntity {
    return this.repository.getConsent(studentId);
  }

  acceptConsent(input: AcceptConsentInput): {
    consent: ConsentRecordEntity;
    preferences: PersonalizationPreferencesEntity;
  } {
    const version = input.consentVersion ?? CURRENT_CONSENT_VERSION;
    if (version !== CURRENT_CONSENT_VERSION) {
      throw new BadRequestException({
        code: 'UNSUPPORTED_CONSENT_VERSION',
        message: `La versión de consentimiento debe ser ${CURRENT_CONSENT_VERSION}.`,
      });
    }

    const nowIso = new Date().toISOString();
    const consent = this.repository.saveConsent({
      id: randomUUID(),
      studentId: input.studentId,
      consentVersion: version,
      status: 'accepted',
      acceptedAt: nowIso,
      withdrawnAt: undefined,
    });

    const currentPrefs = this.repository.getPreferences(input.studentId);
    const preferences = this.repository.savePreferences({
      studentId: input.studentId,
      allowPersonalization: input.allowPersonalization ?? true,
      allowOptionalWellbeingContext:
        input.allowOptionalWellbeingContext ??
        currentPrefs.allowOptionalWellbeingContext,
      preferredTone:
        input.preferredTone && VALID_TONES.has(input.preferredTone)
          ? input.preferredTone
          : currentPrefs.preferredTone,
      updatedAt: nowIso,
    });

    const analyticsSubjectId = this.repository.getOrCreateAnalyticsSubjectId(
      input.studentId,
    );
    this.repository.appendDomainEvent({
      eventId: randomUUID(),
      eventType: 'consent.updated.v1',
      occurredAt: nowIso,
      actorId: analyticsSubjectId,
      subjectId: analyticsSubjectId,
      correlationId: input.correlationId ?? randomUUID(),
      schemaVersion: 1,
      payload: {
        status: 'accepted',
        consentVersion: version,
      },
    });

    return { consent, preferences };
  }

  withdrawConsent(
    studentId: string,
    correlationId?: string,
  ): {
    consent: ConsentRecordEntity;
    preferences: PersonalizationPreferencesEntity;
  } {
    const current = this.repository.getConsent(studentId);
    const nowIso = new Date().toISOString();

    const consent = this.repository.saveConsent({
      ...current,
      status: 'withdrawn',
      withdrawnAt: nowIso,
    });

    // Al retirar el consentimiento se detiene la personalización y se limpia el contexto opcional de bienestar
    const preferences = this.repository.savePreferences({
      studentId,
      allowPersonalization: false,
      allowOptionalWellbeingContext: false,
      preferredTone: 'neutral',
      updatedAt: nowIso,
    });

    const existingProfile = this.repository.getProfile(studentId);
    if (existingProfile.wellbeingInputs !== null) {
      this.repository.saveProfile({
        ...existingProfile,
        wellbeingInputs: null,
        version: existingProfile.version + 1,
        updatedAt: nowIso,
      });
    }

    const analyticsSubjectId =
      this.repository.getOrCreateAnalyticsSubjectId(studentId);
    this.repository.appendDomainEvent({
      eventId: randomUUID(),
      eventType: 'consent.updated.v1',
      occurredAt: nowIso,
      actorId: analyticsSubjectId,
      subjectId: analyticsSubjectId,
      correlationId: correlationId ?? randomUUID(),
      schemaVersion: 1,
      payload: {
        status: 'withdrawn',
        consentVersion: consent.consentVersion,
      },
    });

    return { consent, preferences };
  }

  getProfile(studentId: string): StudentProfileResponseDto {
    const profile = this.repository.getProfile(studentId);
    return {
      studentId: profile.studentId,
      engineeringProgram: profile.engineeringProgram,
      semester: profile.semester,
      perceivedLoad: profile.perceivedLoad,
      difficultSubjects: profile.difficultSubjects,
      weeklyAvailabilityMinutes: profile.weeklyAvailabilityMinutes,
      externalResponsibilities: profile.externalResponsibilities,
      studyPractices: profile.studyPractices,
      interests: profile.interests,
      wellbeingInputs: profile.wellbeingInputs,
      onboardingCompleted: profile.onboardingCompleted,
      version: profile.version,
      updatedAt: profile.updatedAt,
    };
  }

  updateProfile(
    studentId: string,
    payload: UpdateProfilePayload,
    correlationId?: string,
  ): StudentProfileResponseDto {
    const consent = this.repository.getConsent(studentId);
    if (consent.status !== 'accepted') {
      throw new ForbiddenException({
        code: 'CONSENT_REQUIRED',
        message:
          'Debes aceptar el consentimiento informado vigente antes de guardar tu perfil o contexto académico.',
      });
    }

    const forbiddenFields = FORBIDDEN_PROFILE_FIELDS.filter(
      (field) => field in payload && payload[field] !== undefined,
    );
    if (forbiddenFields.length > 0) {
      throw new BadRequestException({
        code: 'UNSUPPORTED_SENSITIVE_FIELD',
        message: `No se permite almacenar calificaciones, historia académica ni datos clínicos (${forbiddenFields.join(', ')}).`,
        details: { forbiddenFields },
      });
    }

    const program = (payload.engineeringProgram ?? '').trim();
    if (!program) {
      throw new BadRequestException({
        code: 'INVALID_ENGINEERING_PROGRAM',
        message: 'El programa de ingeniería es obligatorio.',
      });
    }

    const semester = Number(payload.semester);
    if (!Number.isInteger(semester) || semester < 1 || semester > 12) {
      throw new BadRequestException({
        code: 'INVALID_SEMESTER',
        message: 'El semestre debe ser un número entero entre 1 y 12.',
      });
    }

    const perceivedLoad = payload.perceivedLoad ?? 'moderate';
    if (!VALID_PERCEIVED_LOADS.has(perceivedLoad)) {
      throw new BadRequestException({
        code: 'INVALID_PERCEIVED_LOAD',
        message: 'La carga percibida debe ser low, moderate o high.',
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

    const preferences = this.repository.getPreferences(studentId);
    const current = this.repository.getProfile(studentId);
    const nowIso = new Date().toISOString();

    const sanitizedWellbeing =
      preferences.allowOptionalWellbeingContext && payload.wellbeingInputs
        ? {
            motivationLevel: payload.wellbeingInputs.motivationLevel,
            organizationDifficulty:
              payload.wellbeingInputs.organizationDifficulty ??
              payload.wellbeingInputs.stressPerception,
            stressPerception:
              payload.wellbeingInputs.stressPerception ??
              payload.wellbeingInputs.organizationDifficulty,
            preferredSupportGoal:
              payload.wellbeingInputs.preferredSupportGoal?.trim(),
          }
        : null;

    const changedFieldCodes: string[] = [];
    if (current.engineeringProgram !== program) {
      changedFieldCodes.push('engineeringProgram');
    }
    if (current.semester !== semester) {
      changedFieldCodes.push('semester');
    }
    if (current.perceivedLoad !== perceivedLoad) {
      changedFieldCodes.push('perceivedLoad');
    }
    if (current.weeklyAvailabilityMinutes !== weeklyAvailabilityMinutes) {
      changedFieldCodes.push('weeklyAvailabilityMinutes');
    }
    if (Array.isArray(payload.difficultSubjects)) {
      changedFieldCodes.push('difficultSubjects');
    }
    if (Array.isArray(payload.studyPractices)) {
      changedFieldCodes.push('studyPractices');
    }
    if (Array.isArray(payload.interests)) {
      changedFieldCodes.push('interests');
    }
    if (sanitizedWellbeing !== null) {
      changedFieldCodes.push('wellbeingInputs');
    }

    const updated = this.repository.saveProfile({
      studentId,
      analyticsSubjectId: current.analyticsSubjectId,
      engineeringProgram: program,
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
      wellbeingInputs: sanitizedWellbeing,
      onboardingCompleted: true,
      version: current.version + 1,
      updatedAt: nowIso,
    });

    this.repository.appendDomainEvent({
      eventId: randomUUID(),
      eventType: 'student.profile_updated.v1',
      occurredAt: nowIso,
      actorId: updated.analyticsSubjectId,
      subjectId: updated.analyticsSubjectId,
      correlationId: correlationId ?? randomUUID(),
      schemaVersion: 1,
      payload: {
        changedFieldCodes,
      },
    });

    return this.getProfile(studentId);
  }

  getPreferences(studentId: string): PersonalizationPreferencesEntity {
    return this.repository.getPreferences(studentId);
  }

  updatePreferences(
    studentId: string,
    input: {
      allowPersonalization?: boolean;
      allowOptionalWellbeingContext?: boolean;
      preferredTone?: PreferredTone;
    },
  ): PersonalizationPreferencesEntity {
    const consent = this.repository.getConsent(studentId);
    if (consent.status !== 'accepted') {
      throw new ForbiddenException({
        code: 'CONSENT_REQUIRED',
        message:
          'Debes contar con consentimiento activo para configurar preferencias de personalización.',
      });
    }

    const current = this.repository.getPreferences(studentId);
    const nextAllowWellbeing =
      input.allowOptionalWellbeingContext ??
      current.allowOptionalWellbeingContext;

    const updated = this.repository.savePreferences({
      studentId,
      allowPersonalization:
        input.allowPersonalization ?? current.allowPersonalization,
      allowOptionalWellbeingContext: nextAllowWellbeing,
      preferredTone:
        input.preferredTone && VALID_TONES.has(input.preferredTone)
          ? input.preferredTone
          : current.preferredTone,
      updatedAt: new Date().toISOString(),
    });

    if (!nextAllowWellbeing) {
      const profile = this.repository.getProfile(studentId);
      if (profile.wellbeingInputs !== null) {
        this.repository.saveProfile({
          ...profile,
          wellbeingInputs: null,
          version: profile.version + 1,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return updated;
  }

  getRecordedDomainEvents(): readonly DomainEventRecord[] {
    return this.repository.getDomainEvents();
  }
}

