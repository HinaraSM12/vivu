import { HealthController } from './health.controller';

describe('HealthController', () => {
  const controller = new HealthController();

  it('returns the liveness state', () => {
    expect(controller.health()).toEqual({
      status: 'ok',
      service: 'api-gateway',
    });
  });

  it('returns the readiness state', () => {
    expect(controller.ready().status).toBe('ready');
  });
});
