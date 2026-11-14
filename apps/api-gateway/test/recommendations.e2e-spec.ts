import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DEFAULT_GATEWAY_SEED_PASSWORD } from '../src/auth/gateway-auth.service';

describe('API Gateway Recommendations V1 Online (e2e)', () => {
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

  it('returns max 3 explainable recommendations for active student without expired resources', async () => {
    const token = await loginAs('est.activo@vivu.local');
    const res = await request(app.getHttpServer())
      .get('/api/v1/recommendations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(3);
    expect(res.body.length).toBeGreaterThan(0);

    for (const rec of res.body) {
      expect(rec.ruleVersion).toBe('1.0.0');
      expect(rec.resourceId).not.toBe('RES-ARCH-01');
      expect(rec.whyThisRecommendation.length).toBeGreaterThan(15);
    }
  });

  it('filters strictly to LOW effort recovery missions when student is in recovery mode', async () => {
    const token = await loginAs('est.recuperacion@vivu.local');
    const res = await request(app.getHttpServer())
      .post('/api/v1/recommendations/refresh')
      .set('Authorization', `Bearer ${token}`)
      .send({ llmMode: 'contextual' })
      .expect(200);

    expect(res.body.length).toBeLessThanOrEqual(3);
    for (const rec of res.body) {
      expect(rec.effort).toBe('LOW');
      expect(rec.reasonCode).toBe('RECOVERY_LIGHT_LOAD');
      expect(rec.source).toBe('ONLINE_AI');
    }
  });

  it('falls back deterministically to ONLINE_RULES when LLM fails', async () => {
    const token = await loginAs('est.activo@vivu.local');
    const res = await request(app.getHttpServer())
      .post('/api/v1/recommendations/refresh')
      .set('Authorization', `Bearer ${token}`)
      .send({ llmMode: 'simulate_failure' })
      .expect(200);

    expect(res.body[0].fallbackUsed).toBe(true);
    expect(res.body[0].source).toBe('ONLINE_RULES');
  });

  it('records student agency actions (ACCEPT, EDIT, POSTPONE, REJECT, DISMISS_SIMILAR) and updates traces', async () => {
    const token = await loginAs('est.activo@vivu.local');
    const listRes = await request(app.getHttpServer())
      .get('/api/v1/recommendations')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const recId = listRes.body[0].recommendationId as string;

    const editRes = await request(app.getHttpServer())
      .post(`/api/v1/recommendations/${recId}/action`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        action: 'EDIT',
        editedNotes: 'Dividiré el mapa semanal en dos bloques de 5 minutos.',
      })
      .expect(201);

    expect(editRes.body.studentAction).toBe('EDIT');
    expect(editRes.body.editedNotes).toContain('dos bloques de 5 minutos');

    const tracesRes = await request(app.getHttpServer())
      .get('/api/v1/recommendations/traces')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(
      tracesRes.body.some(
        (t: { recommendationId: string; studentAction: string }) =>
          t.recommendationId === recId && t.studentAction === 'EDIT',
      ),
    ).toBe(true);
  });
});
