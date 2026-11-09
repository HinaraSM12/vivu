import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DEFAULT_GATEWAY_SEED_PASSWORD } from '../src/auth/gateway-auth.service';

describe('Auth & RBAC Gateway endpoints (e2e — Sprint 1)', () => {
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

  it('permite autoregistro exclusivamente como STUDENT y rechaza selección explícita de rol', async () => {
    const forbiddenRoleRes = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'intento.admin@vivu.local',
        password: 'PasswordSeguro#123',
        role: 'ADMIN',
      })
      .expect(400);

    expect(forbiddenRoleRes.body).toEqual(
      expect.objectContaining({
        code: 'ROLE_SELECTION_NOT_ALLOWED',
        correlationId: expect.any(String),
      }),
    );

    const registerRes = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'estudiante.sprint1@vivu.local',
        password: 'PasswordSeguro#123',
      })
      .expect(201);

    expect(registerRes.body.user.roles).toEqual(['STUDENT']);
    expect(registerRes.body.accessToken).toEqual(expect.any(String));
    expect(registerRes.body.refreshToken).toEqual(expect.any(String));
    expect(registerRes.body.offlineAccessWindowSeconds).toBeGreaterThan(0);
  });

  it('aplica la matriz RBAC (allow/deny) entre STUDENT, FACILITATOR y ADMIN y rota refresh tokens', async () => {
    // 1. Login STUDENT
    const studentLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'est.activo@vivu.local',
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);

    const studentToken = studentLogin.body.accessToken as string;
    const studentRefresh = studentLogin.body.refreshToken as string;

    // STUDENT puede ver /me y /student/access-check
    const meRes = await request(app.getHttpServer())
      .get('/api/v1/me')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);
    expect(meRes.body.roles).toEqual(['STUDENT']);

    await request(app.getHttpServer())
      .get('/api/v1/student/access-check')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);

    // STUDENT recibe 403 en rutas de FACILITATOR y ADMIN
    const studentToFac = await request(app.getHttpServer())
      .get('/api/v1/facilitator/access-check')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);
    expect(studentToFac.body.code).toBe('FORBIDDEN_ROLE');

    const studentToAdmin = await request(app.getHttpServer())
      .get('/api/v1/admin/access-check')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);
    expect(studentToAdmin.body.code).toBe('FORBIDDEN_ROLE');

    // 2. Login FACILITATOR
    const facilitatorLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'facilitador.ingenieria@vivu.local',
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);

    const facilitatorToken = facilitatorLogin.body.accessToken as string;

    await request(app.getHttpServer())
      .get('/api/v1/facilitator/access-check')
      .set('Authorization', `Bearer ${facilitatorToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get('/api/v1/admin/access-check')
      .set('Authorization', `Bearer ${facilitatorToken}`)
      .expect(403);

    // 3. Login ADMIN
    const adminLogin = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'admin.piloto@vivu.local',
        password: DEFAULT_GATEWAY_SEED_PASSWORD,
      })
      .expect(200);

    const adminToken = adminLogin.body.accessToken as string;

    await request(app.getHttpServer())
      .get('/api/v1/admin/access-check')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // 4. Rotación de refresh token y revocación en logout
    const refreshRes = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: studentRefresh })
      .expect(200);

    const newRefresh = refreshRes.body.refreshToken as string;
    expect(newRefresh).not.toBe(studentRefresh);

    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ refreshToken: newRefresh })
      .expect(200);

    await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: newRefresh })
      .expect(401);
  });
});

