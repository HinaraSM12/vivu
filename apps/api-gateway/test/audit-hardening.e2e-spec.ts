import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  DEFAULT_GATEWAY_SEED_PASSWORD,
  resolveGatewayJwtSecret,
  shouldSeedGatewayDemoAccounts,
} from '../src/auth/gateway-auth.service';

describe('Architectural Audit Remediation A1–A7 (Post-Sprint 9 E2E)', () => {
  jest.setTimeout(30000);

  const snapshotPath = join(
    tmpdir(),
    `vivu-audit-snapshot-${process.pid}.json`,
  );

  afterEach(() => {
    delete process.env.VIVU_STATE_SNAPSHOT_PATH;
    if (existsSync(snapshotPath)) {
      rmSync(snapshotPath, { force: true });
    }
  });

  async function createGatewayApp(): Promise<INestApplication> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
    return app;
  }

  async function loginAs(
    app: INestApplication,
    email: string,
  ): Promise<string> {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email,
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);
    return res.body.accessToken as string;
  }

  it('A1: preserves completed missions and progress across process restart when VIVU_STATE_SNAPSHOT_PATH is configured', async () => {
    process.env.VIVU_STATE_SNAPSHOT_PATH = snapshotPath;

    const app1 = await createGatewayApp();
    const studentToken1 = await loginAs(app1, 'est.activo@vivu.local');

    const completeRes = await request(app1.getHttpServer())
      .post('/api/v1/missions/MIS-PLAN-02/complete')
      .set('Authorization', `Bearer ${studentToken1}`)
      .send({
        reflectionNote: 'Bloques reservados antes del reinicio.',
        clientEventId: 'evt-restart-001',
      })
      .expect(200);

    expect(completeRes.body.progress.completedMissionsCount).toBe(3);
    await app1.close();

    // Simulate process restart with new NestJS application instance
    const app2 = await createGatewayApp();
    const studentToken2 = await loginAs(app2, 'est.activo@vivu.local');

    const progressAfterRestart = await request(app2.getHttpServer())
      .get('/api/v1/progress')
      .set('Authorization', `Bearer ${studentToken2}`)
      .expect(200);

    expect(progressAfterRestart.body.completedMissionsCount).toBe(3);
    expect(progressAfterRestart.body.levelNumber).toBe(2);
    await app2.close();
  });

  it('A2: rejects default or weak JWT secrets in production and disables seed demo accounts in production by default', () => {
    expect(() =>
      resolveGatewayJwtSecret({
        NODE_ENV: 'production',
        JWT_ACCESS_SECRET: 'replace_with_a_secure_value',
      }),
    ).toThrow(/PRODUCTION_JWT_SECRET_INVALID/);

    expect(() =>
      resolveGatewayJwtSecret({
        NODE_ENV: 'production',
        JWT_SECRET: 'vivu-dev-only-jwt-secret-key-change-in-prod',
      }),
    ).toThrow(/PRODUCTION_JWT_SECRET_INVALID/);

    const validSecret =
      'prod_9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a';
    expect(
      resolveGatewayJwtSecret({
        NODE_ENV: 'production',
        JWT_ACCESS_SECRET: validSecret,
      }),
    ).toBe(validSecret);

    expect(shouldSeedGatewayDemoAccounts({ NODE_ENV: 'production' })).toBe(
      false,
    );
    expect(
      shouldSeedGatewayDemoAccounts({
        NODE_ENV: 'production',
        ENABLE_SEED_DEMO_ACCOUNTS: 'true',
      }),
    ).toBe(true);
  });

  it('A4 & A5: exposes structured readiness checks on /ready and propagates consent withdrawal across student, recommendation, and analytics domains', async () => {
    const app = await createGatewayApp();
    const studentToken = await loginAs(app, 'est.activo@vivu.local');
    const adminToken = await loginAs(app, 'admin.piloto@vivu.local');

    const readyRes = await request(app.getHttpServer())
      .get('/api/v1/ready')
      .expect(200);

    expect(readyRes.body.status).toBe('ready');
    expect(readyRes.body.checks.authSecretConfigured).toBe(true);
    expect(readyRes.body.checks.persistenceStoreReady).toBe(true);
    expect(readyRes.body.checks.domainServicesReady).toBe(true);

    // Generate personalized recommendations before withdrawal
    const recBefore = await request(app.getHttpServer())
      .get('/api/v1/recommendations')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);
    expect(recBefore.body[0].source).toBe('ONLINE_AI');

    // Withdraw consent
    const withdrawRes = await request(app.getHttpServer())
      .post('/api/v1/me/consent/withdraw')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    expect(withdrawRes.body.consent.status).toBe('withdrawn');
    expect(withdrawRes.body.preferences.allowPersonalization).toBe(false);

    // Recommendations after withdrawal must fall back to non-personalized ONLINE_RULES
    const recAfter = await request(app.getHttpServer())
      .get('/api/v1/recommendations')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);
    expect(recAfter.body[0].source).toBe('ONLINE_RULES');

    // Verify canonical consent.updated.v1 event was recorded in analytics
    const eventsRes = await request(app.getHttpServer())
      .get('/api/v1/analytics/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(eventsRes.body[0].eventName).toBe('consent.updated.v1');
    expect(eventsRes.body[0].payload.status).toBe('withdrawn');

    await app.close();
  });
});

