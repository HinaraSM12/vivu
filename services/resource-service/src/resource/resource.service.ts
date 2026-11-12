import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResourceRepository } from './resource.repository';
import type {
  InstitutionalResourceEntity,
  ResourceCategoryCode,
  ResourceLifecycleStatus,
  ResourceVersionRecordEntity,
  SubmitResourceProposalInput,
} from './resource.types';

@Injectable()
export class ResourceService {
  constructor(
    @Inject(ResourceRepository)
    private readonly repository: ResourceRepository,
  ) {}

  listPublishedResources(
    category?: ResourceCategoryCode,
  ): InstitutionalResourceEntity[] {
    return this.repository.getAllResources().filter((item) => {
      if (item.status !== 'PUBLISHED' || !item.humanReviewed) {
        return false;
      }
      if (category && item.category !== category) {
        return false;
      }
      return true;
    });
  }

  listAllResourcesForModeration(
    status?: ResourceLifecycleStatus,
  ): InstitutionalResourceEntity[] {
    return this.repository.getAllResources().filter((item) => {
      if (status && item.status !== status) {
        return false;
      }
      return true;
    });
  }

  viewPublishedResource(
    code: string,
    viewerStudentId?: string,
    correlationId?: string,
  ): InstitutionalResourceEntity {
    const resource = this.repository.getResourceByCode(code);
    if (!resource || resource.status !== 'PUBLISHED') {
      throw new NotFoundException({
        code: 'RESOURCE_NOT_FOUND',
        message: `El recurso institucional (${code}) no está disponible o no ha sido publicado.`,
      });
    }

    if (viewerStudentId) {
      const subjectId = this.repository.getAnalyticsSubjectId(viewerStudentId);
      this.repository.recordDomainEvent({
        eventId: randomUUID(),
        eventType: 'resource.viewed.v1',
        occurredAt: new Date().toISOString(),
        actorId: subjectId,
        subjectId,
        correlationId: correlationId ?? randomUUID(),
        schemaVersion: 1,
        payload: {
          resourceCode: resource.code,
          category: resource.category,
          version: resource.version,
        },
      });
    }

    return resource;
  }

  submitResourceProposal(
    contributorUserId: string,
    contributorRole: 'PROFESSOR' | 'ADMIN',
    input: SubmitResourceProposalInput,
  ): InstitutionalResourceEntity {
    if (!input.title?.trim() || !input.summary?.trim()) {
      throw new BadRequestException({
        code: 'INVALID_RESOURCE_PROPOSAL',
        message: 'El título y el resumen del recurso institucional son obligatorios.',
      });
    }

    const duplicate = this.repository.findDuplicateByTitleAndUnit(
      input.title,
      input.organizerUnit || 'Facultad de Minas',
    );
    if (duplicate) {
      throw new ConflictException({
        code: 'DUPLICATE_RESOURCE_DETECTED',
        message: `Ya existe un recurso registrado con ese título y unidad organizadora (${duplicate.code}).`,
      });
    }

    const now = new Date().toISOString();
    const isDirectAdminPublish = contributorRole === 'ADMIN';
    const generatedCode =
      input.code?.trim().toUpperCase() ||
      `RES-CONTRIB-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const entity: InstitutionalResourceEntity = {
      resourceId: randomUUID(),
      code: generatedCode,
      title: input.title.trim(),
      category: input.category,
      summary: input.summary.trim(),
      targetAudience:
        input.targetAudience?.trim() || 'Estudiantes de Ingeniería',
      modality: input.modality?.trim() || 'Presencial / Virtual',
      scheduleInfo: input.scheduleInfo?.trim() || 'Por confirmar',
      locationOrLink: input.locationOrLink?.trim() || 'Facultad de Minas',
      contactInfo: input.contactInfo?.trim() || 'acompanamiento.minas@vivu.local',
      organizerUnit: input.organizerUnit?.trim() || 'Facultad de Minas',
      tags: input.tags ?? [],
      status: isDirectAdminPublish ? 'PUBLISHED' : 'PENDING_REVIEW',
      sourceType: isDirectAdminPublish
        ? 'INSTITUTIONAL_STAFF_ADMIN'
        : 'VERIFIED_PROFESSOR',
      sourceOriginUrlOrMailbox: contributorUserId,
      contributorUserId,
      contributorRole,
      contributorTrustLevel: isDirectAdminPublish
        ? 'INSTITUTIONAL_EDITOR'
        : 'VERIFIED',
      extractionConfidenceScore: 1,
      humanReviewed: isDirectAdminPublish,
      reviewedByUserId: isDirectAdminPublish ? contributorUserId : null,
      reviewedAt: isDirectAdminPublish ? now : null,
      validFrom: now,
      validUntil: input.validUntil ?? null,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    return this.repository.saveResource(
      entity,
      contributorUserId,
      isDirectAdminPublish
        ? 'Publicación directa por ADMIN'
        : 'Envío de propuesta de recurso por PROFESSOR (PENDING_REVIEW)',
    );
  }

  moderateResource(
    code: string,
    reviewerAdminId: string,
    decision: 'PUBLISHED' | 'REJECTED' | 'EXPIRED' | 'ARCHIVED',
    reason?: string,
  ): InstitutionalResourceEntity {
    const existing = this.repository.getResourceByCode(code);
    if (!existing) {
      throw new NotFoundException({
        code: 'RESOURCE_NOT_FOUND',
        message: `No se encontró el recurso (${code}).`,
      });
    }

    const now = new Date().toISOString();
    const updated: InstitutionalResourceEntity = {
      ...existing,
      status: decision,
      humanReviewed: true,
      reviewedByUserId: reviewerAdminId,
      reviewedAt: now,
      version: existing.version + 1,
      updatedAt: now,
    };

    return this.repository.saveResource(
      updated,
      reviewerAdminId,
      reason?.trim() || `Cambio de estado a ${decision} por moderación ADMIN`,
    );
  }

  getResourceVersions(code: string): ResourceVersionRecordEntity[] {
    return this.repository.getResourceVersions(code);
  }
}

