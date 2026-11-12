import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DEFAULT_GATEWAY_SEED_PASSWORD } from '../src/auth/gateway-auth.service';

describe('Gamification Missions & Personal Progress (e2e)', () => {
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

  it('allows STUDENT to list missions, inspect detail, start, pause, skip without penalty, and complete idempotently to level up', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'est.activo@vivu.local',
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);

    const token = loginRes.body.accessToken as string;

    // 1. Check initial progress (Level 1 with 2 completed missions)
    const initialProgress = await request(app.getHttpServer())
      .get('/api/v1/progress')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(initialProgress.body.levelNumber).toBe(1);
    expect(initialProgress.body.completedMissionsCount).toBe(2);

    // 2. List missions
    const missionsRes = await request(app.getHttpServer())
      .get('/api/v1/missions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(missionsRes.body).toHaveLength(7);

    // 3. Get detail of MIS-PLAN-02
    const detailRes = await request(app.getHttpServer())
      .get('/api/v1/missions/MIS-PLAN-02')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(detailRes.body.template.code).toBe('MIS-PLAN-02');
    expect(detailRes.body.assignment.status).toBe('accepted');

    // 4. Start, pause, and skip MIS-HAB-01 without penalty
    await request(app.getHttpServer())
      .post('/api/v1/missions/MIS-HAB-01/start')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(200);

    const pausedRes = await request(app.getHttpServer())
      .post('/api/v1/missions/MIS-HAB-01/pause')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(200);

    expect(pausedRes.body.mission.assignment.status).toBe('paused');

    const skippedRes = await request(app.getHttpServer())
      .post('/api/v1/missions/MIS-HAB-01/skip')
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Posponer para el viernes' })
      .expect(200);

    expect(skippedRes.body.mission.assignment.status).toBe('skipped');
    expect(skippedRes.body.progress.completedMissionsCount).toBe(2);

    // 5. Complete MIS-PLAN-02 idempotently with clientEventId and verify Level 2 upgrade
    const complete1 = await request(app.getHttpServer())
      .post('/api/v1/missions/MIS-PLAN-02/complete')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reflectionNote: 'Bloques de martes y jueves agendados.',
        clientEventId: 'client-evt-complete-01',
      })
      .expect(200);

    expect(complete1.body.idempotentReplay).toBe(false);
    expect(complete1.body.progress.completedMissionsCount).toBe(3);
    expect(complete1.body.progress.levelNumber).toBe(2);
    expect(complete1.body.progress.levelTitle).toBe('Constancia inicial');
    expect(complete1.body.feedback.unlockedAchievement.achievementCode).toBe(
      'ACH-INITIAL-CONSISTENCY',
    );

    const complete2 = await request(app.getHttpServer())
      .post('/api/v1/missions/MIS-PLAN-02/complete')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientEventId: 'client-evt-complete-01',
      })
      .expect(200);

    expect(complete2.body.idempotentReplay).toBe(true);
    expect(complete2.body.progress.completedMissionsCount).toBe(3);
  });

  it('denies non-STUDENT roles from mutating student missions while allowing catalog inspection', async () => {
    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin.piloto@vivu.local',
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);

    const adminToken = adminLogin.body.accessToken as string;

    const catalogRes = await request(app.getHttpServer())
      .get('/api/v1/missions/catalog')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(catalogRes.body).toHaveLength(7);

    await request(app.getHttpServer())
      .post('/api/v1/missions/MIS-PLAN-01/complete')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})
      .expect(403);
  });
});

