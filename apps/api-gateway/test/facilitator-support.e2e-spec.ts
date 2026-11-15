import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DEFAULT_GATEWAY_SEED_PASSWORD } from '../src/auth/gateway-auth.service';

describe('API Gateway Facilitator Support (e2e)', () => {
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

  it('lists only students assigned to the authenticated facilitator and enforces 403 on unassigned students', async () => {
    const facIngToken = await loginAs('facilitador.ingenieria@vivu.local');
    const listRes = await request(app.getHttpServer())
      .get('/api/v1/facilitator/students')
      .set('Authorization', `Bearer ${facIngToken}`)
      .expect(200);

    expect(listRes.body).toHaveLength(2);
    expect(
      listRes.body.some(
        (s: { participantIdPseudonym: string }) =>
          s.participantIdPseudonym === 'pseudo-stu-002',
      ),
    ).toBe(true);

    // Unassigned student usr-stu-003 (assigned to Bienestar facilitator) -> 403
    await request(app.getHttpServer())
      .get('/api/v1/facilitator/students/usr-stu-003')
      .set('Authorization', `Bearer ${facIngToken}`)
      .expect(403);
  });

  it('allows creating non-stigmatizing support notes and commitments and updating commitment status', async () => {
    const facIngToken = await loginAs('facilitador.ingenieria@vivu.local');

    const noteRes = await request(app.getHttpServer())
      .post('/api/v1/facilitator/students/usr-stu-002/notes')
      .set('Authorization', `Bearer ${facIngToken}`)
      .send({
        summary: 'Acordamos explorar RES-WEL-01 y retomar con un paso de 10 minutos.',
        suggestedResourceCode: 'RES-WEL-01',
      })
      .expect(201);

    expect(noteRes.body.suggestedResourceCode).toBe('RES-WEL-01');

    const comRes = await request(app.getHttpServer())
      .post('/api/v1/facilitator/students/usr-stu-002/commitments')
      .set('Authorization', `Bearer ${facIngToken}`)
      .send({
        title: 'Asistir a espacio de escucha activa Bienestar Minas',
        agreedStep: 'Agendar bloque el jueves a las 10 am.',
        dueDate: '2026-11-21',
      })
      .expect(201);

    const patchRes = await request(app.getHttpServer())
      .patch(`/api/v1/facilitator/commitments/${comRes.body.commitmentId}`)
      .set('Authorization', `Bearer ${facIngToken}`)
      .send({ status: 'COMPLETED' })
      .expect(200);

    expect(patchRes.body.status).toBe('COMPLETED');
  });

  it('rejects stigmatizing language in facilitator notes with 400', async () => {
    const facIngToken = await loginAs('facilitador.ingenieria@vivu.local');

    await request(app.getHttpServer())
      .post('/api/v1/facilitator/students/usr-stu-001/notes')
      .set('Authorization', `Bearer ${facIngToken}`)
      .send({
        summary: 'Reportado como estudiante en riesgo de deserción inminente.',
      })
      .expect(400);
  });
});

