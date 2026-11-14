import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DEFAULT_GATEWAY_SEED_PASSWORD } from '../src/auth/gateway-auth.service';

describe('Student Consent, Onboarding & Profile Gateway endpoints (e2e — Sprint 2)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1', {
      exclude: ['health', 'ready'],
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('exige consentimiento antes de guardar perfil, permite onboarding, rechaza calificaciones y procesa retiro de consentimiento', async () => {
    // 1. Login de estudiante nuevo sin consentimiento aceptado
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'est.nuevo@vivu.local',
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);

    const token = loginRes.body.accessToken as string;

    const initialConsent = await request(app.getHttpServer())
      .get('/api/v1/me/consent')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(initialConsent.body.status).toBe('pending');

    // 2. Intentar guardar perfil sin consentimiento devuelve 403 CONSENT_REQUIRED
    const blockedProfile = await request(app.getHttpServer())
      .put('/api/v1/me/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        engineeringProgram: 'Ingeniería Mecánica',
        semester: 2,
        perceivedLoad: 'moderate',
        weeklyAvailabilityMinutes: 120,
      })
      .expect(403);
    expect(blockedProfile.body.code).toBe('CONSENT_REQUIRED');

    // 3. Aceptar consentimiento informado v1.0
    const acceptRes = await request(app.getHttpServer())
      .post('/api/v1/me/consent')
      .set('Authorization', `Bearer ${token}`)
      .send({
        consentVersion: '1.0',
        allowPersonalization: true,
        allowOptionalWellbeingContext: true,
        preferredTone: 'warm',
      })
      .expect(200);
    expect(acceptRes.body.consent.status).toBe('accepted');

    // 4. Rechazar intento de enviar calificaciones (gpa/grades)
    const sensitiveAttempt = await request(app.getHttpServer())
      .put('/api/v1/me/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        engineeringProgram: 'Ingeniería Mecánica',
        semester: 2,
        perceivedLoad: 'moderate',
        weeklyAvailabilityMinutes: 120,
        gpa: 4.1,
      })
      .expect(400);
    expect(sensitiveAttempt.body.code).toBe('UNSUPPORTED_SENSITIVE_FIELD');

    // 5. Completar onboarding con campos autorizados
    const updatedProfile = await request(app.getHttpServer())
      .put('/api/v1/me/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        engineeringProgram: 'Ingeniería Mecánica',
        semester: 2,
        perceivedLoad: 'high',
        difficultSubjects: ['Termodinámica', 'Cálculo Integral'],
        weeklyAvailabilityMinutes: 150,
        externalResponsibilities: ['transporte_largo'],
        studyPractices: ['bloques_cortos'],
        interests: ['diseno', 'monitorias'],
        wellbeingInputs: {
          motivationLevel: 4,
          stressPerception: 'high',
          preferredSupportGoal: 'Organizar entregas de mitad de semestre',
        },
      })
      .expect(200);

    expect(updatedProfile.body.onboardingCompleted).toBe(true);
    expect(updatedProfile.body.version).toBe(1);
    expect(updatedProfile.body.wellbeingInputs.stressPerception).toBe('high');

    // 6. Retirar consentimiento detiene personalización y limpia wellbeingInputs
    const withdrawRes = await request(app.getHttpServer())
      .post('/api/v1/me/consent/withdraw')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(withdrawRes.body.consent.status).toBe('withdrawn');
    expect(withdrawRes.body.preferences.allowPersonalization).toBe(false);

    const profileAfterWithdraw = await request(app.getHttpServer())
      .get('/api/v1/me/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(profileAfterWithdraw.body.wellbeingInputs).toBeNull();
  });

  it('impide que FACILITATOR o ADMIN consuman los endpoints /api/v1/me/profile exclusivos de STUDENT', async () => {
    const facLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'facilitador.ingenieria@vivu.local',
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/v1/me/profile')
      .set('Authorization', `Bearer ${facLogin.body.accessToken as string}`)
      .expect(403);
  });
});

