import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
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
  type GatewayRecommendationItem,
  GatewayRecommendationService,
  type GatewayRecommendationTraceRecord,
  type GatewayRecordRecommendationActionRequest,
  type GenerateGatewayRecommendationsOptions,
} from './gateway-recommendation.service';

@Controller('recommendations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecommendationGatewayController {
  constructor(
    @Inject(GatewayRecommendationService)
    private readonly recommendationService: GatewayRecommendationService,
  ) {}

  @Get()
  @RequireRoles('STUDENT')
  listRecommendations(
    @Req() req: AuthenticatedRequest,
  ): GatewayRecommendationItem[] {
    const studentId = req.authClaims?.sub ?? '';
    return this.recommendationService.listForStudent(studentId);
  }

  @Post('refresh')
  @RequireRoles('STUDENT')
  @HttpCode(HttpStatus.OK)
  refreshRecommendations(
    @Req() req: AuthenticatedRequest,
    @Body() body?: GenerateGatewayRecommendationsOptions,
  ): GatewayRecommendationItem[] {
    const studentId = req.authClaims?.sub ?? '';
    return this.recommendationService.generateForStudent(
      studentId,
      body ?? {},
    );
  }

  @Post(':recommendationId/action')
  @RequireRoles('STUDENT')
  recordAction(
    @Req() req: AuthenticatedRequest,
    @Param('recommendationId') recommendationId: string,
    @Body() body: GatewayRecordRecommendationActionRequest,
  ): GatewayRecommendationItem {
    const studentId = req.authClaims?.sub ?? '';
    return this.recommendationService.recordAction(
      studentId,
      recommendationId,
      body,
    );
  }

  @Get('traces')
  @RequireRoles('STUDENT', 'ADMIN')
  listTraces(
    @Req() req: AuthenticatedRequest,
  ): GatewayRecommendationTraceRecord[] {
    const studentId = req.authClaims?.sub ?? '';
    return this.recommendationService.listTracesForStudent(studentId);
  }
}
