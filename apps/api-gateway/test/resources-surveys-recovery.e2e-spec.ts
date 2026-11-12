import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DEFAULT_GATEWAY_SEED_PASSWORD } from '../src/auth/gateway-auth.service';

describe('Resources, Micro-Surveys & Non-Punitive Recovery Mode (e2e — Sprint 4)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('lists only PUBLISHED resources to STUDENT, allows micro-survey submission idempotently, and activates non-punitive recovery mode', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'est.recuperacion@vivu.local',
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);

    const token = loginRes.body.accessToken as string;

    // 1. Resources catalog excludes EXPIRED RES-ARCH-01
    const resList = await request(app.getHttpServer())
      .get('/api/v1/resources')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(resList.body).toHaveLength(5);
    expect(resList.body.map((r: { code: string }) => r.code)).not.toContain(
      'RES-ARCH-01',
    );

    await request(app.getHttpServer())
      .get('/api/v1/resources/RES-ARCH-01')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    // 2. Activate Recovery Mode (STU-15)
    const recRes = await request(app.getHttpServer())
      .post('/api/v1/recovery/activate')
      .set('Authorization', `Bearer ${token}`)
      .send({ choice: 'MICRO_MISSION_5M' })
      .expect(200);

    expect(recRes.body.isRecoveryActive).toBe(true);
    expect(recRes.body.recommendedRecoveryMissionCodes).toContain('MIS-REC-01');

    // 3. Submit Weekly Micro-Survey idempotently (STU-18)
    const sur1 = await request(app.getHttpServer())
      .post('/api/v1/surveys/SUR-WEEKLY-V1/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientEventId: 'client-evt-survey-101',
        answers: [
          { questionId: 'weekly_load_manageable', numericValue: 3 },
          { questionId: 'weekly_time_fit', numericValue: 5 },
          {
            questionId: 'weekly_concrete_step_low_pressure',
            numericValue: 5,
          },
        ],
      })
      .expect(200);

    expect(sur1.body.idempotentReplay).toBe(false);

    const sur2 = await request(app.getHttpServer())
      .post('/api/v1/surveys/SUR-WEEKLY-V1/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientEventId: 'client-evt-survey-101',
        answers: [
          { questionId: 'weekly_load_manageable', numericValue: 3 },
        ],
      })
      .expect(200);

    expect(sur2.body.idempotentReplay).toBe(true);
  });

  it('allows PROFESSOR (RESOURCE_CONTRIBUTOR) to submit a resource proposal as PENDING_REVIEW and ADMIN to moderate it to PUBLISHED', async () => {
    const profLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'profesor.ingenieria@vivu.local',
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);

    const profToken = profLogin.body.accessToken as string;

    const submitRes = await request(app.getHttpServer())
      .post('/api/v1/resources/submissions')
      .set('Authorization', `Bearer ${profToken}`)
      .send({
        code: 'RES-PROF-E2E',
        title: 'Clínica de Programación y Estructuras de Datos',
        category: 'ACADEMIC_SUPPORT',
        summary: 'Asesoría semanal abierta conducida por docentes y monitores.',
        organizerUnit: 'Departamento de Ciencias de la Computación',
      })
      .expect(201);

    expect(submitRes.body.status).toBe('PENDING_REVIEW');
    expect(submitRes.body.humanReviewed).toBe(false);

    // ADMIN moderates to PUBLISHED
    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin.piloto@vivu.local',
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);

    const adminToken = adminLogin.body.accessToken as string;

    const modRes = await request(app.getHttpServer())
      .post('/api/v1/resources/RES-PROF-E2E/moderate')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ decision: 'PUBLISHED' })
      .expect(200);

    expect(modRes.body.status).toBe('PUBLISHED');
    expect(modRes.body.version).toBe(2);
  });
});

