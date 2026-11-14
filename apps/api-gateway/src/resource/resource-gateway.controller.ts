import {
  Body,
  Controller,
  Get,
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
  type GatewayInstitutionalResource,
  type GatewayResourceCategoryCode,
  type GatewayResourceLifecycleStatus,
  GatewayResourceService,
} from './gateway-resource.service';

@Controller('resources')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResourceGatewayController {
  constructor(
    @Inject(GatewayResourceService)
    private readonly resourceService: GatewayResourceService,
  ) {}

  @Get()
  @RequireRoles('STUDENT', 'FACILITATOR', 'PROFESSOR', 'ADMIN')
  listPublished(
    @Query('category') category?: GatewayResourceCategoryCode,
  ): GatewayInstitutionalResource[] {
    return this.resourceService.listPublished(category);
  }

  @Get('moderation')
  @RequireRoles('ADMIN', 'PROFESSOR')
  listModeration(
    @Query('status') status?: GatewayResourceLifecycleStatus,
  ): GatewayInstitutionalResource[] {
    return this.resourceService.listForModeration(status);
  }

  @Get(':code')
  @RequireRoles('STUDENT', 'FACILITATOR', 'PROFESSOR', 'ADMIN')
  viewPublished(@Param('code') code: string): GatewayInstitutionalResource {
    return this.resourceService.viewPublished(code);
  }

  @Post('submissions')
  @RequireRoles('PROFESSOR', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  submitProposal(
    @Req() request: AuthenticatedRequest,
    @Body()
    body: {
      code?: string;
      title: string;
      category: GatewayResourceCategoryCode;
      summary: string;
      targetAudience?: string;
      modality?: string;
      scheduleInfo?: string;
      locationOrLink?: string;
      contactInfo?: string;
      organizerUnit?: string;
      tags?: string[];
    },
  ): GatewayInstitutionalResource {
    const userId = request.authClaims?.sub ?? '';
    const isAdmin = request.authClaims?.roles?.includes('ADMIN') ?? false;
    return this.resourceService.submitProposal(
      userId,
      isAdmin ? 'ADMIN' : 'PROFESSOR',
      body,
    );
  }

  @Post(':code/moderate')
  @RequireRoles('ADMIN')
  @HttpCode(HttpStatus.OK)
  moderateResource(
    @Req() request: AuthenticatedRequest,
    @Param('code') code: string,
    @Body()
    body: {
      decision: 'PUBLISHED' | 'REJECTED' | 'EXPIRED' | 'ARCHIVED';
    },
  ): GatewayInstitutionalResource {
    const adminId = request.authClaims?.sub ?? '';
    return this.resourceService.moderateResource(code, adminId, body.decision);
  }
}

