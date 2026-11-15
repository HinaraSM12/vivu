import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Put,
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
  GatewayAdminService,
  type GatewayPilotFeatureFlags,
  type GatewayRecommenderWeightConfig,
} from './gateway-admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminGatewayController {
  constructor(
    @Inject(GatewayAdminService)
    private readonly adminService: GatewayAdminService,
  ) {}

  @Get('overview')
  @RequireRoles('ADMIN')
  getOverview() {
    return this.adminService.getOverview();
  }

  @Put('recommender-config')
  @RequireRoles('ADMIN')
  updateRecommenderConfig(
    @Req() req: AuthenticatedRequest,
    @Headers('x-connectivity-mode') connectivityMode: string | undefined,
    @Body()
    body: {
      weights?: Partial<Omit<GatewayRecommenderWeightConfig, 'version'>>;
      featureFlags?: Partial<GatewayPilotFeatureFlags>;
    },
  ) {
    const adminUserId = req.authClaims?.sub ?? '';
    return this.adminService.updateRecommenderConfig(
      adminUserId,
      body,
      connectivityMode,
    );
  }

  @Post('assignments')
  @HttpCode(HttpStatus.OK)
  @RequireRoles('ADMIN')
  assignFacilitator(
    @Req() req: AuthenticatedRequest,
    @Headers('x-connectivity-mode') connectivityMode: string | undefined,
    @Body() body: { facilitatorId: string; studentId: string },
  ) {
    const adminUserId = req.authClaims?.sub ?? '';
    return this.adminService.assignFacilitator(
      adminUserId,
      body,
      connectivityMode,
    );
  }

  @Get('audit-logs')
  @RequireRoles('ADMIN')
  listAuditLogs() {
    return this.adminService.listAuditLogs();
  }

  @Post('exports/anonymized')
  @HttpCode(HttpStatus.OK)
  @RequireRoles('ADMIN')
  exportAnonymized(
    @Req() req: AuthenticatedRequest,
    @Headers('x-connectivity-mode') connectivityMode: string | undefined,
  ) {
    const adminUserId = req.authClaims?.sub ?? '';
    return this.adminService.generateAnonymizedExport(
      adminUserId,
      connectivityMode,
    );
  }
}
