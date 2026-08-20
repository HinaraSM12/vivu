import { HealthController } from './health.controller';

describe('HealthController', () => {
  const controller = new HealthController();

  it('identifies the service in its liveness response', () => {
    expect(controller.health()).toEqual({
      status: 'ok',
      service: 'student-service',
    });
  });

  it('reports readiness', () => {
    expect(controller.ready().status).toBe('ready');
  });
});
