import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import {
  type ConsentRecordEntity,
  CURRENT_CONSENT_VERSION,
  type DomainEventRecord,
  type PersonalizationPreferencesEntity,
  type StudentProfileEntity,
} from './student.types';

export const SEED_ACTIVE_STUDENT_ID = '00000000-0000-4000-8000-000000000004';
export const SEED_RECOVERY_STUDENT_ID = '00000000-0000-4000-8000-000000000005';
export const SEED_NEW_STUDENT_ID = '00000000-0000-4000-8000-000000000006';

@Injectable()
export class StudentRepository {
  private readonly consentsByStudentId = new Map<string, ConsentRecordEntity>();
  private readonly preferencesByStudentId = new Map<
    string,
    PersonalizationPreferencesEntity
  >();
  private readonly profilesByStudentId = new Map<string, StudentProfileEntity>();
  private readonly analyticsSubjectByStudentId = new Map<string, string>();
  private readonly domainEvents: DomainEventRecord[] = [];

  constructor() {
    this.seedDefaults();
  }

  seedDefaults(): void {
    const nowIso = new Date().toISOString();

    // 1. Estudiante activo (consentimiento aceptado + onboarding completo)
    this.analyticsSubjectByStudentId.set(
      SEED_ACTIVE_STUDENT_ID,
      '11111111-1111-4111-8111-000000000004',
    );
    this.consentsByStudentId.set(SEED_ACTIVE_STUDENT_ID, {
      id: randomUUID(),
      studentId: SEED_ACTIVE_STUDENT_ID,
      consentVersion: CURRENT_CONSENT_VERSION,
      status: 'accepted',
      acceptedAt: nowIso,
    });
    this.preferencesByStudentId.set(SEED_ACTIVE_STUDENT_ID, {
      studentId: SEED_ACTIVE_STUDENT_ID,
      allowPersonalization: true,
      allowOptionalWellbeingContext: true,
      preferredTone: 'warm',
      updatedAt: nowIso,
    });
    this.profilesByStudentId.set(SEED_ACTIVE_STUDENT_ID, {
      studentId: SEED_ACTIVE_STUDENT_ID,
      analyticsSubjectId: '11111111-1111-4111-8111-000000000004',
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

    // 2. Estudiante en recuperación (consentimiento aceptado + carga alta)
    this.analyticsSubjectByStudentId.set(
      SEED_RECOVERY_STUDENT_ID,
      '11111111-1111-4111-8111-000000000005',
    );
    this.consentsByStudentId.set(SEED_RECOVERY_STUDENT_ID, {
      id: randomUUID(),
      studentId: SEED_RECOVERY_STUDENT_ID,
      consentVersion: CURRENT_CONSENT_VERSION,
      status: 'accepted',
      acceptedAt: nowIso,
    });
    this.preferencesByStudentId.set(SEED_RECOVERY_STUDENT_ID, {
      studentId: SEED_RECOVERY_STUDENT_ID,
      allowPersonalization: true,
      allowOptionalWellbeingContext: true,
      preferredTone: 'warm',
      updatedAt: nowIso,
    });
    this.profilesByStudentId.set(SEED_RECOVERY_STUDENT_ID, {
      studentId: SEED_RECOVERY_STUDENT_ID,
      analyticsSubjectId: '11111111-1111-4111-8111-000000000005',
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

    // 3. Estudiante nuevo (consentimiento pendiente y sin onboarding)
    this.analyticsSubjectByStudentId.set(
      SEED_NEW_STUDENT_ID,
      '11111111-1111-4111-8111-000000000006',
    );
  }

  getOrCreateAnalyticsSubjectId(studentId: string): string {
    const existing = this.analyticsSubjectByStudentId.get(studentId);
    if (existing) {
      return existing;
    }
    const generated = randomUUID();
    this.analyticsSubjectByStudentId.set(studentId, generated);
    return generated;
  }

  getConsent(studentId: string): ConsentRecordEntity {
    const existing = this.consentsByStudentId.get(studentId);
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

  saveConsent(record: ConsentRecordEntity): ConsentRecordEntity {
    const copy: ConsentRecordEntity = { ...record };
    this.consentsByStudentId.set(record.studentId, copy);
    return { ...copy };
  }

  getPreferences(studentId: string): PersonalizationPreferencesEntity {
    const existing = this.preferencesByStudentId.get(studentId);
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

  savePreferences(
    preferences: PersonalizationPreferencesEntity,
  ): PersonalizationPreferencesEntity {
    const copy: PersonalizationPreferencesEntity = { ...preferences };
    this.preferencesByStudentId.set(preferences.studentId, copy);
    return { ...copy };
  }

  getProfile(studentId: string): StudentProfileEntity {
    const existing = this.profilesByStudentId.get(studentId);
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
      analyticsSubjectId: this.getOrCreateAnalyticsSubjectId(studentId),
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

  saveProfile(profile: StudentProfileEntity): StudentProfileEntity {
    const copy: StudentProfileEntity = {
      ...profile,
      difficultSubjects: [...profile.difficultSubjects],
      externalResponsibilities: [...profile.externalResponsibilities],
      studyPractices: [...profile.studyPractices],
      interests: [...profile.interests],
      wellbeingInputs: profile.wellbeingInputs
        ? { ...profile.wellbeingInputs }
        : null,
    };
    this.profilesByStudentId.set(profile.studentId, copy);
    return copy;
  }

  appendDomainEvent(event: DomainEventRecord): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): readonly DomainEventRecord[] {
    return [...this.domainEvents];
  }
}

