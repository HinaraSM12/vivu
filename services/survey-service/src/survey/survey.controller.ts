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
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import type {
  SurveyAnswerInput,
  SurveyDefinitionEntity,
  SurveyResponseEntity,
} from './survey.types';

@Controller('surveys')
export class SurveyController {
  constructor(
    @Inject(SurveyService)
    private readonly surveyService: SurveyService,
  ) {}

  @Get()
  listDefinitions(): SurveyDefinitionEntity[] {
    return this.surveyService.listDefinitions();
  }

  @Get(':code')
  getDefinition(@Param('code') code: string): SurveyDefinitionEntity {
    return this.surveyService.getDefinition(code);
  }

  @Post('students/:studentId/:code/submit')
  @HttpCode(HttpStatus.OK)
  submitResponse(
    @Param('studentId') studentId: string,
    @Param('code') code: string,
    @Body()
    body: {
      answers: SurveyAnswerInput[];
      clientEventId?: string;
    },
    @Headers('idempotency-key') idempotencyKey?: string,
    @Headers('x-correlation-id') correlationId?: string,
  ): SurveyResponseEntity {
    return this.surveyService.submitResponse(
      studentId,
      code,
      body?.answers ?? [],
      {
        clientEventId: body?.clientEventId ?? idempotencyKey,
        correlationId,
      },
    );
  }

  @Get('students/:studentId/responses')
  listStudentResponses(
    @Param('studentId') studentId: string,
  ): SurveyResponseEntity[] {
    return this.surveyService.listStudentResponses(studentId);
  }
}

