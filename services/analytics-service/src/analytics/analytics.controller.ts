import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import type { CanonicalTelemetryEventName } from './analytics.types';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    @Inject(AnalyticsService)
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get('events')
  listEvents() {
    return this.analyticsService.listEvents();
  }

  @Post('events')
  @HttpCode(HttpStatus.CREATED)
  ingestEvent(
    @Body()
    body: {
      eventName: CanonicalTelemetryEventName;
      participantIdPseudonym: string;
      correlationId?: string;
      payload?: Record<string, unknown>;
    },
  ) {
    return this.analyticsService.ingestEvent(body);
  }

  @Get('pilot-summary')
  getPilotSummary() {
    return this.analyticsService.getPilotEvaluationDashboard();
  }
}

