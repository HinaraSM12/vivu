import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DEFAULT_GATEWAY_SEED_PASSWORD } from '../src/auth/gateway-auth.service';

describe('API Gateway Offline Sync & Outbox (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  async function loginAs(email: string): Promise<string> {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password: DEFAULT_GATEWAY_SEED_PASSWORD })
      .expect(200);
    return res.body.accessToken as string;
  }

  it('bootstraps local-first snapshot and pulls incremental cursor for STUDENT', async () => {
    const token = await loginAs('est.activo@vivu.local');
    const bootRes = await request(app.getHttpServer())
      .get('/api/v1/sync/bootstrap')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(bootRes.body.missionsCount).toBe(7);
    expect(bootRes.body.publishedResourcesCount).toBe(5);
    expect(bootRes.body.serverCursor).toMatch(/^cursor-v1-/);

    const pullRes = await request(app.getHttpServer())
      .get(`/api/v1/sync/pull?cursor=${bootRes.body.serverCursor}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(pullRes.body.changesCount).toBe(0);
  });

  it('processes outbox batch idempotently by clientEventId (APPLIED then IDEMPOTENT_DUPLICATE)', async () => {
    const token = await loginAs('est.activo@vivu.local');
    const batchPayload = {
      actions: [
        {
          clientEventId: 'offline-evt-mission-accept-101',
          actionType: 'MISSION_ACCEPT',
          occurredAt: new Date().toISOString(),
          payload: { missionCode: 'MIS-WEL-01' },
        },
        {
          clientEventId: 'offline-evt-survey-102',
          actionType: 'SURVEY_SUBMIT',
          occurredAt: new Date().toISOString(),
          payload: { surveyCode: 'SUR-WEEKLY-V1' },
        },
      ],
    };

    const firstRes = await request(app.getHttpServer())
      .post('/api/v1/sync/actions')
      .set('Authorization', `Bearer ${token}`)
      .send(batchPayload)
      .expect(200);

    expect(firstRes.body.processedCount).toBe(2);
    expect(firstRes.body.results[0].status).toBe('APPLIED');
    expect(firstRes.body.results[1].status).toBe('APPLIED');

    const replayRes = await request(app.getHttpServer())
      .post('/api/v1/sync/actions')
      .set('Authorization', `Bearer ${token}`)
      .send(batchPayload)
      .expect(200);

    expect(replayRes.body.results[0].status).toBe('IDEMPOTENT_DUPLICATE');
    expect(replayRes.body.results[1].status).toBe('IDEMPOTENT_DUPLICATE');
  });

  it('rejects offline sync batch from ADMIN role (ADR-005 online-only admin rule)', async () => {
    const adminToken = await loginAs('admin.piloto@vivu.local');
    await request(app.getHttpServer())
      .post('/api/v1/sync/actions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ actions: [] })
      .expect(403);
  });
});

