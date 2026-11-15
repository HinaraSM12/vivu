import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DEFAULT_GATEWAY_SEED_PASSWORD } from '../src/auth/gateway-auth.service';

describe('Pilot Analytics & Readiness Gateway (Sprint 9 E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  async function loginAs(email: string): Promise<string> {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email,
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);
    return res.body.accessToken as string;
  }

  it('returns the longitudinal pilot evaluation dashboard (Usage, Recommendations, QoE, QoS, LLM Quality, Readiness Checks) and enforces pseudonymized telemetry ingestion', async () => {
    const adminToken = await loginAs('admin.piloto@vivu.local');
    const studentToken = await loginAs('est.activo@vivu.local');

    const summaryRes = await request(app.getHttpServer())
      .get('/api/v1/analytics/pilot-summary')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(summaryRes.body.schemaVersion).toBe('1.0.0');
    expect(summaryRes.body.canonicalEventsCount).toBeGreaterThanOrEqual(16);
    expect(summaryRes.body.allReadinessChecksPassed).toBe(true);
    expect(summaryRes.body.llmQuality.hallucinationCount).toBe(0);
    expect(summaryRes.body.llmQuality.groundednessRate).toBe(1.0);
    expect(summaryRes.body.qoe.autonomyScore).toBeGreaterThan(4.0);
    expect(summaryRes.body.qos.pilotAvailabilityRate).toBeGreaterThan(0.99);

    await request(app.getHttpServer())
      .post('/api/v1/analytics/events')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        eventName: 'mission.completed.v1',
        participantIdPseudonym: 'pseudo-stu-001',
        payload: { missionCode: 'MIS-PLAN-01' },
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/analytics/events')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        eventName: 'mission.completed.v1',
        participantIdPseudonym: 'est.activo@vivu.local',
      })
      .expect(400);

    await request(app.getHttpServer())
      .get('/api/v1/analytics/pilot-summary')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);
  });
});

