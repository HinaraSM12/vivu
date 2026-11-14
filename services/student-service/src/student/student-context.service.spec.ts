import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { StudentContextService } from './student-context.service';
import {
  SEED_ACTIVE_STUDENT_ID,
  SEED_NEW_STUDENT_ID,
  StudentRepository,
} from './student.repository';

describe('StudentContextService (Sprint 2 — Consent, Onboarding & Profile)', () => {
  let service: StudentContextService;

  beforeEach(() => {
    const repository = new StudentRepository();
    service = new StudentContextService(repository);
  });

  it('impide guardar onboarding o perfil si el estudiante aún no ha aceptado el consentimiento informado (CONSENT_REQUIRED)', () => {
    const consent = service.getConsent(SEED_NEW_STUDENT_ID);
    expect(consent.status).toBe('pending');

    expect(() =>
      service.updateProfile(SEED_NEW_STUDENT_ID, {
        engineeringProgram: 'Ingeniería Industrial',
        semester: 1,
        perceivedLoad: 'moderate',
        weeklyAvailabilityMinutes: 120,
      }),
    ).toThrow(ForbiddenException);
  });

  it('registra aceptación de consentimiento versionado, permite completar onboarding y emite eventos con analyticsSubjectId seudónimo', () => {
    const accepted = service.acceptConsent({
      studentId: SEED_NEW_STUDENT_ID,
      consentVersion: '1.0',
      allowPersonalization: true,
      allowOptionalWellbeingContext: true,
      preferredTone: 'warm',
      correlationId: 'corr-consent-1',
    });

    expect(accepted.consent.status).toBe('accepted');
    expect(accepted.consent.consentVersion).toBe('1.0');
    expect(accepted.preferences.allowOptionalWellbeingContext).toBe(true);

    const profile = service.updateProfile(
      SEED_NEW_STUDENT_ID,
      {
        engineeringProgram: 'Ingeniería Eléctrica',
        semester: 4,
        perceivedLoad: 'high',
        difficultSubjects: ['Campos Electromagnéticos', ' Ecuaciones Diferenciales '],
        weeklyAvailabilityMinutes: 150,
        externalResponsibilities: ['monitoria'],
        studyPractices: ['bloques_cortos'],
        interests: ['energia', 'habitos'],
        wellbeingInputs: {
          motivationLevel: 4,
          stressPerception: 'high',
          preferredSupportGoal: 'Organizar entregas pesadas sin saturarme',
        },
      },
      'corr-profile-1',
    );

    expect(profile.onboardingCompleted).toBe(true);
    expect(profile.version).toBe(1);
    expect(profile.difficultSubjects).toEqual([
      'Campos Electromagnéticos',
      'Ecuaciones Diferenciales',
    ]);
    expect(profile.wellbeingInputs?.stressPerception).toBe('high');

    const events = service.getRecordedDomainEvents();
    expect(events).toHaveLength(2);
    expect(events[0]?.eventType).toBe('consent.updated.v1');
    expect(events[0]?.subjectId).not.toBe(SEED_NEW_STUDENT_ID);
    expect(events[0]?.payload).toEqual({
      status: 'accepted',
      consentVersion: '1.0',
    });

    expect(events[1]?.eventType).toBe('student.profile_updated.v1');
    expect(events[1]?.subjectId).toBe(events[0]?.subjectId);
    expect(events[1]?.payload).toEqual({
      changedFieldCodes: expect.arrayContaining([
        'engineeringProgram',
        'semester',
        'perceivedLoad',
        'weeklyAvailabilityMinutes',
        'difficultSubjects',
        'studyPractices',
        'interests',
        'wellbeingInputs',
      ]),
    });
  });

  it('rechaza almacenar calificaciones, promedio o historia académica restringida (UNSUPPORTED_SENSITIVE_FIELD)', () => {
    expect(() =>
      service.updateProfile(SEED_ACTIVE_STUDENT_ID, {
        engineeringProgram: 'Ingeniería de Sistemas e Informática',
        semester: 3,
        perceivedLoad: 'moderate',
        weeklyAvailabilityMinutes: 180,
        gpa: 3.8,
        grades: [4.0, 3.2],
      }),
    ).toThrow(BadRequestException);
  });

  it('procesa el retiro voluntario del consentimiento deteniendo la personalización, limpiando bienestar opcional y bloqueando futuras ediciones', () => {
    const before = service.getProfile(SEED_ACTIVE_STUDENT_ID);
    expect(before.wellbeingInputs).not.toBeNull();

    const withdrawn = service.withdrawConsent(
      SEED_ACTIVE_STUDENT_ID,
      'corr-withdraw-1',
    );
    expect(withdrawn.consent.status).toBe('withdrawn');
    expect(withdrawn.consent.withdrawnAt).toEqual(expect.any(String));
    expect(withdrawn.preferences.allowPersonalization).toBe(false);
    expect(withdrawn.preferences.allowOptionalWellbeingContext).toBe(false);

    const after = service.getProfile(SEED_ACTIVE_STUDENT_ID);
    expect(after.wellbeingInputs).toBeNull();

    expect(() =>
      service.updateProfile(SEED_ACTIVE_STUDENT_ID, {
        engineeringProgram: 'Ingeniería de Sistemas e Informática',
        semester: 4,
        perceivedLoad: 'low',
        weeklyAvailabilityMinutes: 180,
      }),
    ).toThrow(ForbiddenException);
  });
});

