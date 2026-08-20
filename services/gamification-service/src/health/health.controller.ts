import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return { status: 'ok' as const, service: 'gamification-service' as const };
  }

  @Get('ready')
  ready() {
    return { status: 'ready' as const, service: 'gamification-service' as const };
  }
}
