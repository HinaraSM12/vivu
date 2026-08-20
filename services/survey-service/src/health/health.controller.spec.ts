import { HealthController } from './health.controller';

describe('HealthController', () => {
  const controller = new HealthController();

  it('identifies the service in its liveness response', () => {
    expect(controller.health()).toEqual({
      status: 'ok',
      service: 'survey-service',
    });
  });

  it('reports readiness', () => {
    expect(controller.ready().status).toBe('ready');
  });
});
