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
  type GatewaySurveyAnswer,
  type GatewaySurveyDefinition,
  type GatewaySurveyResponseRecord,
  GatewaySurveyService,
} from './gateway-survey.service';

@Controller('surveys')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SurveyGatewayController {
  constructor(
    @Inject(GatewaySurveyService)
    private readonly surveyService: GatewaySurveyService,
  ) {}

  @Get()
  @RequireRoles('STUDENT', 'FACILITATOR', 'ADMIN')
  listDefinitions(): GatewaySurveyDefinition[] {
    return this.surveyService.listDefinitions();
  }

  @Get('my-responses')
  @RequireRoles('STUDENT')
  listMyResponses(
    @Req() request: AuthenticatedRequest,
  ): GatewaySurveyResponseRecord[] {
    const studentId = request.authClaims?.sub ?? '';
    return this.surveyService.listStudentResponses(studentId);
  }

  @Get(':code')
  @RequireRoles('STUDENT', 'FACILITATOR', 'ADMIN')
  getDefinition(@Param('code') code: string): GatewaySurveyDefinition {
    return this.surveyService.getDefinition(code);
  }

  @Post(':code/submit')
  @RequireRoles('STUDENT')
  @HttpCode(HttpStatus.OK)
  submitResponse(
    @Req() request: AuthenticatedRequest,
    @Param('code') code: string,
    @Body()
    body: {
      answers: GatewaySurveyAnswer[];
      clientEventId?: string;
    },
    @Headers('idempotency-key') idempotencyKey?: string,
  ): GatewaySurveyResponseRecord {
    const studentId = request.authClaims?.sub ?? '';
    return this.surveyService.submitResponse(
      studentId,
      code,
      body?.answers ?? [],
      body?.clientEventId ?? idempotencyKey,
    );
  }
}

