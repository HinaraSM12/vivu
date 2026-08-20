import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOkResponse({ description: 'El proceso está activo.' })
  health() {
    return { status: 'ok' as const, service: 'api-gateway' as const };
  }

  @Get('ready')
  @ApiOkResponse({ description: 'El gateway está listo para recibir tráfico.' })
  ready() {
    return { status: 'ready' as const, service: 'api-gateway' as const };
  }
}
