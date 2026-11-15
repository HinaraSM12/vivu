import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
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
  type GatewayAssignedStudentSummary,
  type GatewayFacilitatorCommitment,
  type GatewayFacilitatorNote,
  GatewayFacilitatorService,
  type GatewaySupportCommitmentStatus,
} from './gateway-facilitator.service';

@Controller('facilitator')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FacilitatorGatewayController {
  constructor(
    @Inject(GatewayFacilitatorService)
    private readonly facilitatorService: GatewayFacilitatorService,
  ) {}

  @Get('students')
  @RequireRoles('FACILITATOR', 'ADMIN')
  listStudents(
    @Req() req: AuthenticatedRequest,
  ): GatewayAssignedStudentSummary[] {
    const userId = req.authClaims?.sub ?? '';
    const isAdmin = req.authClaims?.roles?.includes('ADMIN') ?? false;
    return this.facilitatorService.listAssignedStudents(userId, isAdmin);
  }

  @Get('students/:studentId')
  @RequireRoles('FACILITATOR', 'ADMIN')
  getStudentDetail(
    @Req() req: AuthenticatedRequest,
    @Param('studentId') studentId: string,
  ): {
    student: GatewayAssignedStudentSummary;
    notes: GatewayFacilitatorNote[];
    commitments: GatewayFacilitatorCommitment[];
  } {
    const userId = req.authClaims?.sub ?? '';
    const isAdmin = req.authClaims?.roles?.includes('ADMIN') ?? false;
    return this.facilitatorService.getStudentDetail(userId, studentId, isAdmin);
  }

  @Post('students/:studentId/notes')
  @RequireRoles('FACILITATOR', 'ADMIN')
  createNote(
    @Req() req: AuthenticatedRequest,
    @Param('studentId') studentId: string,
    @Body() body: { summary: string; suggestedResourceCode?: string | null },
  ): GatewayFacilitatorNote {
    const userId = req.authClaims?.sub ?? '';
    const isAdmin = req.authClaims?.roles?.includes('ADMIN') ?? false;
    return this.facilitatorService.createNote(userId, studentId, body, isAdmin);
  }

  @Post('students/:studentId/commitments')
  @RequireRoles('FACILITATOR', 'ADMIN')
  createCommitment(
    @Req() req: AuthenticatedRequest,
    @Param('studentId') studentId: string,
    @Body()
    body: { title: string; agreedStep: string; dueDate?: string | null },
  ): GatewayFacilitatorCommitment {
    const userId = req.authClaims?.sub ?? '';
    const isAdmin = req.authClaims?.roles?.includes('ADMIN') ?? false;
    return this.facilitatorService.createCommitment(
      userId,
      studentId,
      body,
      isAdmin,
    );
  }

  @Patch('commitments/:commitmentId')
  @RequireRoles('FACILITATOR', 'ADMIN')
  updateCommitment(
    @Req() req: AuthenticatedRequest,
    @Param('commitmentId') commitmentId: string,
    @Body() body: { status: GatewaySupportCommitmentStatus },
  ): GatewayFacilitatorCommitment {
    const userId = req.authClaims?.sub ?? '';
    const isAdmin = req.authClaims?.roles?.includes('ADMIN') ?? false;
    return this.facilitatorService.updateCommitmentStatus(
      userId,
      commitmentId,
      body.status,
      isAdmin,
    );
  }
}

