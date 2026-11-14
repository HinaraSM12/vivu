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
import { ResourceService } from './resource.service';
import type {
  InstitutionalResourceEntity,
  ResourceCategoryCode,
  ResourceLifecycleStatus,
  ResourceVersionRecordEntity,
  SubmitResourceProposalInput,
} from './resource.types';

@Controller('resources')
export class ResourceController {
  constructor(
    @Inject(ResourceService)
    private readonly resourceService: ResourceService,
  ) {}

  @Get()
  listPublishedResources(
    @Query('category') category?: ResourceCategoryCode,
  ): InstitutionalResourceEntity[] {
    return this.resourceService.listPublishedResources(category);
  }

  @Get('moderation')
  listForModeration(
    @Query('status') status?: ResourceLifecycleStatus,
  ): InstitutionalResourceEntity[] {
    return this.resourceService.listAllResourcesForModeration(status);
  }

  @Get(':code')
  viewResource(
    @Param('code') code: string,
    @Query('studentId') studentId?: string,
    @Headers('x-correlation-id') correlationId?: string,
  ): InstitutionalResourceEntity {
    return this.resourceService.viewPublishedResource(
      code,
      studentId,
      correlationId,
    );
  }

  @Get(':code/versions')
  getVersions(@Param('code') code: string): ResourceVersionRecordEntity[] {
    return this.resourceService.getResourceVersions(code);
  }

  @Post('submissions')
  @HttpCode(HttpStatus.CREATED)
  submitResourceProposal(
    @Body()
    body: SubmitResourceProposalInput & {
      contributorUserId: string;
      contributorRole: 'PROFESSOR' | 'ADMIN';
    },
  ): InstitutionalResourceEntity {
    return this.resourceService.submitResourceProposal(
      body.contributorUserId,
      body.contributorRole,
      body,
    );
  }

  @Post(':code/moderate')
  @HttpCode(HttpStatus.OK)
  moderateResource(
    @Param('code') code: string,
    @Body()
    body: {
      reviewerAdminId: string;
      decision: 'PUBLISHED' | 'REJECTED' | 'EXPIRED' | 'ARCHIVED';
      reason?: string;
    },
  ): InstitutionalResourceEntity {
    return this.resourceService.moderateResource(
      code,
      body.reviewerAdminId,
      body.decision,
      body.reason,
    );
  }
}

