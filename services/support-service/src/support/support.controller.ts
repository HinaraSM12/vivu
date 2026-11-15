import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SupportService } from './support.service';
import type { SupportCommitmentStatus } from './support.types';

@Controller('facilitator')
export class SupportController {
  constructor(
    @Inject(SupportService)
    private readonly supportService: SupportService,
  ) {}

  @Get('students')
  listAssignedStudents(
    @Headers('x-facilitator-id') facilitatorId = 'usr-fac-001',
  ) {
    return this.supportService.listAssignedStudents(facilitatorId);
  }

  @Get('students/:studentId')
  getStudentDetail(
    @Headers('x-facilitator-id') facilitatorId = 'usr-fac-001',
    @Param('studentId') studentId: string,
  ) {
    return this.supportService.getStudentSupportDetail(
      facilitatorId,
      studentId,
    );
  }

  @Post('students/:studentId/notes')
  createNote(
    @Headers('x-facilitator-id') facilitatorId = 'usr-fac-001',
    @Param('studentId') studentId: string,
    @Body()
    body: {
      summary: string;
      suggestedResourceCode?: string | null;
    },
  ) {
    return this.supportService.createSupportNote(
      facilitatorId,
      studentId,
      body,
    );
  }

  @Post('students/:studentId/commitments')
  createCommitment(
    @Headers('x-facilitator-id') facilitatorId = 'usr-fac-001',
    @Param('studentId') studentId: string,
    @Body()
    body: {
      title: string;
      agreedStep: string;
      dueDate?: string | null;
    },
  ) {
    return this.supportService.createCommitment(facilitatorId, studentId, body);
  }

  @Patch('commitments/:commitmentId')
  updateCommitment(
    @Headers('x-facilitator-id') facilitatorId = 'usr-fac-001',
    @Param('commitmentId') commitmentId: string,
    @Body() body: { status: SupportCommitmentStatus },
  ) {
    return this.supportService.updateCommitmentStatus(
      facilitatorId,
      commitmentId,
      body.status,
    );
  }
}

