import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  type AuthenticatedRequest,
  JwtAuthGuard,
  RequireRoles,
  RolesGuard,
} from '../auth/rbac.guards';
import {
  type GatewayOutboxItem,
  type GatewaySyncBatchResponse,
  type GatewaySyncBootstrapResponse,
  type GatewaySyncPullResponse,
  GatewaySyncService,
} from './gateway-sync.service';

@Controller('sync')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SyncGatewayController {
  constructor(
    @Inject(GatewaySyncService)
    private readonly syncService: GatewaySyncService,
  ) {}

  @Get('bootstrap')
  @RequireRoles('STUDENT')
  bootstrap(@Req() req: AuthenticatedRequest): GatewaySyncBootstrapResponse {
    const studentId = req.authClaims?.sub ?? '';
    return this.syncService.bootstrap(studentId);
  }

  @Get('pull')
  @RequireRoles('STUDENT')
  pull(
    @Req() req: AuthenticatedRequest,
    @Query('cursor') cursor?: string,
  ): GatewaySyncPullResponse {
    const studentId = req.authClaims?.sub ?? '';
    return this.syncService.pull(studentId, cursor);
  }

  @Post('actions')
  @RequireRoles('STUDENT')
  @HttpCode(HttpStatus.OK)
  syncActions(
    @Req() req: AuthenticatedRequest,
    @Body() body: { actions: GatewayOutboxItem[] },
  ): GatewaySyncBatchResponse {
    const studentId = req.authClaims?.sub ?? '';
    return this.syncService.syncActions(studentId, body?.actions ?? []);
  }
}

