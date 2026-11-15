import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  RequireRoles,
  RolesGuard,
} from '../auth/rbac.guards';
import {
  GatewayAnalyticsService,
  type GatewayCanonicalTelemetryEventName,
} from './gateway-analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsGatewayController {
  constructor(
    @Inject(GatewayAnalyticsService)
    private readonly analyticsService: GatewayAnalyticsService,
  ) { }

  @Get('events')
  @RequireRoles('ADMIN')
  listEvents() {
    return this.analyticsService.listEvents();
  }

  @Post('events')
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles('STUDENT', 'FACILITATOR', 'ADMIN')
  ingestEvent(
    @Body()
    body: {
      eventName: GatewayCanonicalTelemetryEventName;
      participantIdPseudonym: string;
      correlationId?: string;
      payload?: Record<string, unknown>;
    },
  ) {
    return this.analyticsService.ingestEvent(body);
  }

  @Get('pilot-summary')
  @RequireRoles('ADMIN', 'FACILITATOR')
  getPilotSummary() {
    return this.analyticsService.getPilotEvaluationDashboard();
  }
}

