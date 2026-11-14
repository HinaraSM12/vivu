import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
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
  GatewayGamificationService,
  type GatewayMissionCategoryCode,
  type GatewayMissionListFilter,
  type GatewayMissionTemplate,
  type GatewayMissionTransitionResponse,
  type GatewayRecoveryChoiceCode,
  type GatewayRecoveryState,
  type GatewayStudentMissionView,
  type GatewayStudentProgressSummary,
} from './gateway-gamification.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class GamificationGatewayController {
  constructor(
    @Inject(GatewayGamificationService)
    private readonly gamificationService: GatewayGamificationService,
  ) {}

  @Get('missions/catalog')
  @RequireRoles('STUDENT', 'FACILITATOR', 'ADMIN')
  getCatalog(): GatewayMissionTemplate[] {
    return this.gamificationService.listCatalog();
  }

  @Get('missions')
  @RequireRoles('STUDENT')
  listStudentMissions(
    @Req() request: AuthenticatedRequest,
    @Query('filter') filter?: GatewayMissionListFilter,
    @Query('category') category?: GatewayMissionCategoryCode,
  ): GatewayStudentMissionView[] {
    const studentId = request.authClaims?.sub ?? '';
    return this.gamificationService.listStudentMissions(studentId, {
      filter,
      category,
    });
  }

  @Get('missions/:missionCode')
  @RequireRoles('STUDENT')
  getMissionDetail(
    @Req() request: AuthenticatedRequest,
    @Param('missionCode') missionCode: string,
  ): GatewayStudentMissionView {
    const studentId = request.authClaims?.sub ?? '';
    return this.gamificationService.getStudentMissionDetail(
      studentId,
      missionCode,
    );
  }

  @Post('missions/:missionCode/accept')
  @RequireRoles('STUDENT')
  @HttpCode(HttpStatus.OK)
  acceptMission(
    @Req() request: AuthenticatedRequest,
    @Param('missionCode') missionCode: string,
    @Body() body?: { clientEventId?: string },
    @Headers('idempotency-key') idempotencyKey?: string,
  ): GatewayMissionTransitionResponse {
    const studentId = request.authClaims?.sub ?? '';
    return this.gamificationService.acceptMission(
      studentId,
      missionCode,
      body?.clientEventId ?? idempotencyKey,
    );
  }

  @Post('missions/:missionCode/start')
  @RequireRoles('STUDENT')
  @HttpCode(HttpStatus.OK)
  startMission(
    @Req() request: AuthenticatedRequest,
    @Param('missionCode') missionCode: string,
    @Body() body?: { clientEventId?: string },
    @Headers('idempotency-key') idempotencyKey?: string,
  ): GatewayMissionTransitionResponse {
    const studentId = request.authClaims?.sub ?? '';
    return this.gamificationService.startMission(
      studentId,
      missionCode,
      body?.clientEventId ?? idempotencyKey,
    );
  }

  @Post('missions/:missionCode/pause')
  @RequireRoles('STUDENT')
  @HttpCode(HttpStatus.OK)
  pauseMission(
    @Req() request: AuthenticatedRequest,
    @Param('missionCode') missionCode: string,
    @Body() body?: { clientEventId?: string },
  ): GatewayMissionTransitionResponse {
    const studentId = request.authClaims?.sub ?? '';
    return this.gamificationService.pauseMission(
      studentId,
      missionCode,
      body?.clientEventId,
    );
  }

  @Post('missions/:missionCode/skip')
  @RequireRoles('STUDENT')
  @HttpCode(HttpStatus.OK)
  skipMission(
    @Req() request: AuthenticatedRequest,
    @Param('missionCode') missionCode: string,
    @Body() body?: { reason?: string; clientEventId?: string },
    @Headers('idempotency-key') idempotencyKey?: string,
  ): GatewayMissionTransitionResponse {
    const studentId = request.authClaims?.sub ?? '';
    return this.gamificationService.skipMission(
      studentId,
      missionCode,
      body?.reason,
      body?.clientEventId ?? idempotencyKey,
    );
  }

  @Post('missions/:missionCode/complete')
  @RequireRoles('STUDENT')
  @HttpCode(HttpStatus.OK)
  completeMission(
    @Req() request: AuthenticatedRequest,
    @Param('missionCode') missionCode: string,
    @Body() body?: { reflectionNote?: string; clientEventId?: string },
    @Headers('idempotency-key') idempotencyKey?: string,
  ): GatewayMissionTransitionResponse {
    const studentId = request.authClaims?.sub ?? '';
    return this.gamificationService.completeMission(
      studentId,
      missionCode,
      body?.reflectionNote,
      body?.clientEventId ?? idempotencyKey,
    );
  }

  @Get('progress')
  @RequireRoles('STUDENT')
  getProgress(
    @Req() request: AuthenticatedRequest,
  ): GatewayStudentProgressSummary {
    const studentId = request.authClaims?.sub ?? '';
    return this.gamificationService.getStudentProgress(studentId);
  }

  @Get('recovery')
  @RequireRoles('STUDENT')
  getRecoveryState(
    @Req() request: AuthenticatedRequest,
  ): GatewayRecoveryState {
    const studentId = request.authClaims?.sub ?? '';
    return this.gamificationService.getRecoveryState(studentId);
  }

  @Post('recovery/activate')
  @RequireRoles('STUDENT')
  @HttpCode(HttpStatus.OK)
  activateRecovery(
    @Req() request: AuthenticatedRequest,
    @Body()
    body?: {
      choice?: GatewayRecoveryChoiceCode;
    },
  ): GatewayRecoveryState {
    const studentId = request.authClaims?.sub ?? '';
    return this.gamificationService.activateRecovery(
      studentId,
      body?.choice ?? 'MICRO_MISSION_5M',
    );
  }
}

