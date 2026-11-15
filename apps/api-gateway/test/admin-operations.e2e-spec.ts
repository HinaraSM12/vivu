import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DEFAULT_GATEWAY_SEED_PASSWORD } from '../src/auth/gateway-auth.service';

describe('Admin Operations Gateway (Sprint 8 E2E)', () => {
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

  it('allows ADMIN to inspect overview, update recommender weights, assign facilitator, and export anonymized dataset without PII', async () => {
    const adminToken = await loginAs('admin.piloto@vivu.local');

    const overviewRes = await request(app.getHttpServer())
      .get('/api/v1/admin/overview')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(overviewRes.body.totalUsersCount).toBe(8);
    expect(overviewRes.body.recommenderWeights.needFit).toBe(0.3);

    await request(app.getHttpServer())
      .put('/api/v1/admin/recommender-config')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        weights: {
          needFit: 0.5,
          timeFit: 0.5,
          difficultyFit: 0.2,
          continuityFit: 0.1,
          resourceFit: 0.1,
          diversityFit: 0.1,
        },
      })
      .expect(400);

    const updatedConfig = await request(app.getHttpServer())
      .put('/api/v1/admin/recommender-config')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        weights: {
          needFit: 0.35,
          timeFit: 0.2,
          difficultyFit: 0.15,
          continuityFit: 0.15,
          resourceFit: 0.1,
          diversityFit: 0.05,
        },
        featureFlags: {
          llmContextualizationEnabled: true,
        },
      })
      .expect(200);

    expect(updatedConfig.body.recommenderWeights.needFit).toBe(0.35);

    const assignRes = await request(app.getHttpServer())
      .post('/api/v1/admin/assignments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        facilitatorId: '00000000-0000-4000-8000-000000000002',
        studentId: '00000000-0000-4000-8000-000000000006',
      })
      .expect(200);

    expect(assignRes.body.assignedFacilitatorIds).toContain(
      '00000000-0000-4000-8000-000000000002',
    );

    const exportRes = await request(app.getHttpServer())
      .post('/api/v1/admin/exports/anonymized')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(exportRes.body.containsPii).toBe(false);
    expect(exportRes.body.participantCount).toBeGreaterThanOrEqual(3);
    for (const row of exportRes.body.records) {
      expect(row.participantIdPseudonym).toMatch(/^pseudo-/);
      expect(row.email).toBeUndefined();
      expect(row.fullName).toBeUndefined();
    }

    const auditRes = await request(app.getHttpServer())
      .get('/api/v1/admin/audit-logs')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(auditRes.body.length).toBeGreaterThanOrEqual(4);
  });

  it('blocks ADMIN mutations in OFFLINE connectivity mode (409) and blocks STUDENT from admin endpoints (403)', async () => {
    const adminToken = await loginAs('admin.piloto@vivu.local');
    const studentToken = await loginAs('est.activo@vivu.local');

    await request(app.getHttpServer())
      .put('/api/v1/admin/recommender-config')
      .set('Authorization', `Bearer ${adminToken}`)
      .set('x-connectivity-mode', 'OFFLINE')
      .send({
        featureFlags: {
          llmContextualizationEnabled: false,
        },
      })
      .expect(409);

    await request(app.getHttpServer())
      .get('/api/v1/admin/overview')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);
  });
});

