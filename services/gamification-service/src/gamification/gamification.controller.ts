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
} from '@nestjs/common';
import { GamificationService } from './gamification.service';
import type {
  MissionCategoryCode,
  MissionListFilter,
  MissionTemplateEntity,
  MissionTransitionResponseDto,
  StudentMissionViewDto,
  StudentProgressSummaryDto,
} from './gamification.types';

@Controller()
export class GamificationController {
  constructor(
    @Inject(GamificationService)
    private readonly gamificationService: GamificationService,
  ) {}

  @Get('missions/catalog')
  getCatalog(): MissionTemplateEntity[] {
    return this.gamificationService.listCatalog();
  }

  @Get('students/:studentId/missions')
  listStudentMissions(
    @Param('studentId') studentId: string,
    @Query('filter') filter?: MissionListFilter,
    @Query('category') category?: MissionCategoryCode,
  ): StudentMissionViewDto[] {
    return this.gamificationService.listStudentMissions(studentId, {
      filter,
      category,
    });
  }

  @Get('students/:studentId/missions/:missionCode')
  getStudentMissionDetail(
    @Param('studentId') studentId: string,
    @Param('missionCode') missionCode: string,
  ): StudentMissionViewDto {
    return this.gamificationService.getStudentMissionDetail(
      studentId,
      missionCode,
    );
  }

  @Post('students/:studentId/missions/:missionCode/accept')
  @HttpCode(HttpStatus.OK)
  acceptMission(
    @Param('studentId') studentId: string,
    @Param('missionCode') missionCode: string,
    @Body() body: { clientEventId?: string },
    @Headers('idempotency-key') idempotencyKey?: string,
    @Headers('x-correlation-id') correlationId?: string,
  ): MissionTransitionResponseDto {
    return this.gamificationService.acceptMission(studentId, missionCode, {
      clientEventId: body?.clientEventId ?? idempotencyKey,
      correlationId,
    });
  }

  @Post('students/:studentId/missions/:missionCode/start')
  @HttpCode(HttpStatus.OK)
  startMission(
    @Param('studentId') studentId: string,
    @Param('missionCode') missionCode: string,
    @Body() body: { clientEventId?: string },
    @Headers('idempotency-key') idempotencyKey?: string,
    @Headers('x-correlation-id') correlationId?: string,
  ): MissionTransitionResponseDto {
    return this.gamificationService.startMission(studentId, missionCode, {
      clientEventId: body?.clientEventId ?? idempotencyKey,
      correlationId,
    });
  }

  @Post('students/:studentId/missions/:missionCode/pause')
  @HttpCode(HttpStatus.OK)
  pauseMission(
    @Param('studentId') studentId: string,
    @Param('missionCode') missionCode: string,
    @Body() body: { clientEventId?: string },
  ): MissionTransitionResponseDto {
    return this.gamificationService.pauseMission(studentId, missionCode, {
      clientEventId: body?.clientEventId,
    });
  }

  @Post('students/:studentId/missions/:missionCode/skip')
  @HttpCode(HttpStatus.OK)
  skipMission(
    @Param('studentId') studentId: string,
    @Param('missionCode') missionCode: string,
    @Body() body: { reason?: string; clientEventId?: string },
    @Headers('idempotency-key') idempotencyKey?: string,
    @Headers('x-correlation-id') correlationId?: string,
  ): MissionTransitionResponseDto {
    return this.gamificationService.skipMission(studentId, missionCode, {
      reason: body?.reason,
      clientEventId: body?.clientEventId ?? idempotencyKey,
      correlationId,
    });
  }

  @Post('students/:studentId/missions/:missionCode/complete')
  @HttpCode(HttpStatus.OK)
  completeMission(
    @Param('studentId') studentId: string,
    @Param('missionCode') missionCode: string,
    @Body() body: { reflectionNote?: string; clientEventId?: string },
    @Headers('idempotency-key') idempotencyKey?: string,
    @Headers('x-correlation-id') correlationId?: string,
  ): MissionTransitionResponseDto {
    return this.gamificationService.completeMission(studentId, missionCode, {
      reflectionNote: body?.reflectionNote,
      clientEventId: body?.clientEventId ?? idempotencyKey,
      correlationId,
    });
  }

  @Get('students/:studentId/progress')
  getStudentProgress(
    @Param('studentId') studentId: string,
  ): StudentProgressSummaryDto {
    return this.gamificationService.getStudentProgress(studentId);
  }
}

