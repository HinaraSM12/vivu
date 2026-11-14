import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

export type GatewayResourceCategoryCode =
  | 'PLANNING'
  | 'STUDY_HABITS'
  | 'ACADEMIC_SUPPORT'
  | 'WELLBEING_BALANCE'
  | 'CAMPUS_INTEGRATION';

export type GatewayResourceLifecycleStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'NEEDS_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'ARCHIVED';

export interface GatewayInstitutionalResource {
  resourceId: string;
  code: string;
  title: string;
  category: GatewayResourceCategoryCode;
  summary: string;
  targetAudience: string;
  modality: string;
  scheduleInfo: string;
  locationOrLink: string;
  contactInfo: string;
  organizerUnit: string;
  tags: string[];
  status: GatewayResourceLifecycleStatus;
  sourceType:
    | 'OFFICIAL_INSTITUTIONAL_PORTAL'
    | 'INSTITUTIONAL_STAFF_ADMIN'
    | 'VERIFIED_PROFESSOR'
    | 'INSTITUTIONAL_EMAIL_VERIFIED_SENDER'
    | 'UNVERIFIED_MANUAL_SUBMISSION';
  sourceOriginUrlOrMailbox: string;
  contributorUserId: string;
  contributorRole: 'PROFESSOR' | 'ADMIN';
  contributorTrustLevel:
    | 'STANDARD_CONTRIBUTOR'
    | 'VERIFIED'
    | 'INSTITUTIONAL_EDITOR';
  extractionConfidenceScore: number;
  humanReviewed: boolean;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  validFrom: string;
  validUntil: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
}

const SEED_GATEWAY_RESOURCES: GatewayInstitutionalResource[] = [
  {
    resourceId: 'res-uuid-001',
    code: 'RES-ACAD-01',
    title:
      'Programa de Monitorías y Tutorías Académicas — Ciencias Básicas e Ingeniería',
    category: 'ACADEMIC_SUPPORT',
    summary:
      'Espacios de acompañamiento grupal e individual para resolver dudas en Cálculo, Física, Ecuaciones Diferenciales y Programación.',
    targetAudience:
      'Estudiantes de pregrado con asignaturas de alta demanda o dificultad',
    modality: 'Presencial / Virtual',
    scheduleInfo: 'Lunes a viernes, bloques de 10:00 a 18:00 según asignatura',
    locationOrLink: 'Bloque M3 / Portal Académico Facultad de Minas',
    contactInfo: 'acompanamiento.minas@vivu.local',
    organizerUnit: 'Vicedecanatura Académica — Facultad de Minas',
    tags: ['monitorias', 'tutorias', 'calculo', 'fisica'],
    status: 'PUBLISHED',
    sourceType: 'OFFICIAL_INSTITUTIONAL_PORTAL',
    sourceOriginUrlOrMailbox: 'https://minas.medellin.unal.edu.co',
    contributorUserId: '00000000-0000-4000-8000-000000000001',
    contributorRole: 'ADMIN',
    contributorTrustLevel: 'INSTITUTIONAL_EDITOR',
    extractionConfidenceScore: 1,
    humanReviewed: true,
    reviewedByUserId: '00000000-0000-4000-8000-000000000001',
    reviewedAt: '2026-11-01T10:00:00.000Z',
    validFrom: '2026-08-01T00:00:00.000Z',
    validUntil: '2027-06-30T23:59:59.000Z',
    version: 1,
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
  },
  {
    resourceId: 'res-uuid-002',
    code: 'RES-ACAD-02',
    title: 'Talleres de Estrategias de Estudio y Gestión del Tiempo',
    category: 'STUDY_HABITS',
    summary:
      'Talleres prácticos sobre planificación semanal, preparación de parciales, estudio activo y manejo de carga académica.',
    targetAudience:
      'Estudiantes de todos los semestres que buscan mejorar organización',
    modality: 'Grupal / Taller',
    scheduleInfo: 'Miércoles 14:00–16:00 y Viernes 10:00–12:00',
    locationOrLink: 'Aula M8-102 y sala virtual autorizada',
    contactInfo: 'orientacion.minas@vivu.local',
    organizerUnit: 'Dirección de Bienestar Universitario — Facultad de Minas',
    tags: ['organizacion', 'tiempo', 'habitos', 'talleres'],
    status: 'PUBLISHED',
    sourceType: 'INSTITUTIONAL_STAFF_ADMIN',
    sourceOriginUrlOrMailbox: 'admin.piloto@vivu.local',
    contributorUserId: '00000000-0000-4000-8000-000000000001',
    contributorRole: 'ADMIN',
    contributorTrustLevel: 'INSTITUTIONAL_EDITOR',
    extractionConfidenceScore: 1,
    humanReviewed: true,
    reviewedByUserId: '00000000-0000-4000-8000-000000000001',
    reviewedAt: '2026-11-01T10:00:00.000Z',
    validFrom: '2026-08-01T00:00:00.000Z',
    validUntil: '2027-06-30T23:59:59.000Z',
    version: 1,
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
  },
  {
    resourceId: 'res-uuid-003',
    code: 'RES-ACA-03',
    title: 'Acompañamiento Estudiantil y Consejería Académica de Facultad',
    category: 'PLANNING',
    summary:
      'Orientación individual para organizar carga del semestre, priorizar asignaturas y trazar rutas de avance realistas.',
    targetAudience:
      'Estudiantes que requieren orientación sobre carga académica y ruta curricular',
    modality: 'Cita previa',
    scheduleInfo: 'Agenda abierta lunes a viernes',
    locationOrLink: 'Oficina de Acompañamiento Estudiantil — Bloque M5',
    contactInfo: 'consejeria.minas@vivu.local',
    organizerUnit: 'Escuela de Pregrado — Facultad de Minas',
    tags: ['consejeria', 'planificacion', 'carga_academica'],
    status: 'PUBLISHED',
    sourceType: 'OFFICIAL_INSTITUTIONAL_PORTAL',
    sourceOriginUrlOrMailbox: 'https://minas.medellin.unal.edu.co',
    contributorUserId: '00000000-0000-4000-8000-000000000001',
    contributorRole: 'ADMIN',
    contributorTrustLevel: 'INSTITUTIONAL_EDITOR',
    extractionConfidenceScore: 1,
    humanReviewed: true,
    reviewedByUserId: '00000000-0000-4000-8000-000000000001',
    reviewedAt: '2026-11-01T10:00:00.000Z',
    validFrom: '2026-08-01T00:00:00.000Z',
    validUntil: '2027-06-30T23:59:59.000Z',
    version: 1,
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
  },
  {
    resourceId: 'res-uuid-004',
    code: 'RES-WEL-01',
    title: 'Orientación y Acompañamiento en Bienestar Universitario',
    category: 'WELLBEING_BALANCE',
    summary:
      'Espacios de escucha, regulación de sobrecarga académica y orientación preventiva para el equilibrio universitario.',
    targetAudience:
      'Estudiantes que reportan sobrecarga o necesidad de orientación en bienestar',
    modality: 'Presencial / Virtual',
    scheduleInfo: 'Lunes a viernes 08:00–17:00',
    locationOrLink: 'Dirección de Bienestar — Bloque M3',
    contactInfo: 'bienestar.minas@vivu.local',
    organizerUnit: 'Bienestar Universitario — Facultad de Minas',
    tags: ['bienestar', 'equilibrio', 'escucha'],
    status: 'PUBLISHED',
    sourceType: 'OFFICIAL_INSTITUTIONAL_PORTAL',
    sourceOriginUrlOrMailbox: 'https://minas.medellin.unal.edu.co',
    contributorUserId: '00000000-0000-4000-8000-000000000001',
    contributorRole: 'ADMIN',
    contributorTrustLevel: 'INSTITUTIONAL_EDITOR',
    extractionConfidenceScore: 1,
    humanReviewed: true,
    reviewedByUserId: '00000000-0000-4000-8000-000000000001',
    reviewedAt: '2026-11-01T10:00:00.000Z',
    validFrom: '2026-08-01T00:00:00.000Z',
    validUntil: '2027-06-30T23:59:59.000Z',
    version: 1,
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
  },
  {
    resourceId: 'res-uuid-005',
    code: 'RES-INT-01',
    title:
      'Guía de Servicios Universitarios y Grupos Estudiantiles — Facultad de Minas',
    category: 'CAMPUS_INTEGRATION',
    summary:
      'Directorio verificado de semilleros, capítulos estudiantiles, bibliotecas y servicios de campus para fortalecer integración.',
    targetAudience:
      'Estudiantes de primeros semestres o en proceso de integración universitaria',
    modality: 'Catálogo digital',
    scheduleInfo: 'Consulta permanente 24/7',
    locationOrLink: 'Portal de Integración Estudiantil — Facultad de Minas',
    contactInfo: 'integracion.minas@vivu.local',
    organizerUnit: 'Bienestar Universitario y Representación Estudiantil',
    tags: ['integracion', 'semilleros', 'grupos_estudiantiles'],
    status: 'PUBLISHED',
    sourceType: 'OFFICIAL_INSTITUTIONAL_PORTAL',
    sourceOriginUrlOrMailbox: 'https://minas.medellin.unal.edu.co',
    contributorUserId: '00000000-0000-4000-8000-000000000001',
    contributorRole: 'ADMIN',
    contributorTrustLevel: 'INSTITUTIONAL_EDITOR',
    extractionConfidenceScore: 1,
    humanReviewed: true,
    reviewedByUserId: '00000000-0000-4000-8000-000000000001',
    reviewedAt: '2026-11-01T10:00:00.000Z',
    validFrom: '2026-08-01T00:00:00.000Z',
    validUntil: '2027-06-30T23:59:59.000Z',
    version: 1,
    createdAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
  },
  {
    resourceId: 'res-uuid-006',
    code: 'RES-ARCH-01',
    title:
      'Convocatoria Histórica Semestre Anterior (Seed para probar filtro de inactivos)',
    category: 'CAMPUS_INTEGRATION',
    summary:
      'Recurso vencido/inactivo para verificar que los estudiantes y el recomendador nunca reciban recursos no publicados.',
    targetAudience: 'Prueba automatizada de filtro de vigencia',
    modality: 'N/A',
    scheduleInfo: 'Cerrada',
    locationOrLink: 'Archivo histórico',
    contactInfo: 'archivo.minas@vivu.local',
    organizerUnit: 'Archivo Facultad',
    tags: ['historico'],
    status: 'EXPIRED',
    sourceType: 'OFFICIAL_INSTITUTIONAL_PORTAL',
    sourceOriginUrlOrMailbox: 'https://minas.medellin.unal.edu.co',
    contributorUserId: '00000000-0000-4000-8000-000000000001',
    contributorRole: 'ADMIN',
    contributorTrustLevel: 'INSTITUTIONAL_EDITOR',
    extractionConfidenceScore: 1,
    humanReviewed: true,
    reviewedByUserId: '00000000-0000-4000-8000-000000000001',
    reviewedAt: '2026-06-01T10:00:00.000Z',
    validFrom: '2026-01-01T00:00:00.000Z',
    validUntil: '2026-06-30T23:59:59.000Z',
    version: 1,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-06-30T23:59:59.000Z',
  },
];

@Injectable()
export class GatewayResourceService {
  private readonly resources = new Map<string, GatewayInstitutionalResource>();

  constructor() {
    for (const item of SEED_GATEWAY_RESOURCES) {
      this.resources.set(item.code, { ...item, tags: [...item.tags] });
    }
  }

  listPublished(
    category?: GatewayResourceCategoryCode,
  ): GatewayInstitutionalResource[] {
    return Array.from(this.resources.values())
      .filter((r) => {
        if (r.status !== 'PUBLISHED' || !r.humanReviewed) {
          return false;
        }
        if (category && r.category !== category) {
          return false;
        }
        return true;
      })
      .map((r) => ({ ...r, tags: [...r.tags] }));
  }

  listForModeration(
    status?: GatewayResourceLifecycleStatus,
  ): GatewayInstitutionalResource[] {
    return Array.from(this.resources.values())
      .filter((r) => (status ? r.status === status : true))
      .map((r) => ({ ...r, tags: [...r.tags] }));
  }

  viewPublished(code: string): GatewayInstitutionalResource {
    const found = this.resources.get(code);
    if (!found || found.status !== 'PUBLISHED') {
      throw new NotFoundException({
        code: 'RESOURCE_NOT_FOUND',
        message: `El recurso institucional (${code}) no está disponible o no ha sido publicado.`,
      });
    }
    return { ...found, tags: [...found.tags] };
  }

  submitProposal(
    contributorUserId: string,
    contributorRole: 'PROFESSOR' | 'ADMIN',
    input: {
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
    if (!input.title?.trim() || !input.summary?.trim()) {
      throw new BadRequestException({
        code: 'INVALID_RESOURCE_PROPOSAL',
        message: 'El título y el resumen del recurso son obligatorios.',
      });
    }

    const normTitle = input.title.trim().toLowerCase();
    const normUnit = (input.organizerUnit || 'Facultad de Minas')
      .trim()
      .toLowerCase();
    for (const existing of this.resources.values()) {
      if (
        existing.title.trim().toLowerCase() === normTitle &&
        existing.organizerUnit.trim().toLowerCase() === normUnit
      ) {
        throw new ConflictException({
          code: 'DUPLICATE_RESOURCE_DETECTED',
          message: `Ya existe un recurso registrado con ese título (${existing.code}).`,
        });
      }
    }

    const now = new Date().toISOString();
    const isAdmin = contributorRole === 'ADMIN';
    const code =
      input.code?.trim().toUpperCase() ||
      `RES-CONTRIB-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const entity: GatewayInstitutionalResource = {
      resourceId: randomUUID(),
      code,
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
      status: isAdmin ? 'PUBLISHED' : 'PENDING_REVIEW',
      sourceType: isAdmin
        ? 'INSTITUTIONAL_STAFF_ADMIN'
        : 'VERIFIED_PROFESSOR',
      sourceOriginUrlOrMailbox: contributorUserId,
      contributorUserId,
      contributorRole,
      contributorTrustLevel: isAdmin ? 'INSTITUTIONAL_EDITOR' : 'VERIFIED',
      extractionConfidenceScore: 1,
      humanReviewed: isAdmin,
      reviewedByUserId: isAdmin ? contributorUserId : null,
      reviewedAt: isAdmin ? now : null,
      validFrom: now,
      validUntil: null,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    this.resources.set(code, entity);
    return { ...entity, tags: [...entity.tags] };
  }

  moderateResource(
    code: string,
    reviewerAdminId: string,
    decision: 'PUBLISHED' | 'REJECTED' | 'EXPIRED' | 'ARCHIVED',
  ): GatewayInstitutionalResource {
    const found = this.resources.get(code);
    if (!found) {
      throw new NotFoundException({
        code: 'RESOURCE_NOT_FOUND',
        message: `No se encontró el recurso (${code}).`,
      });
    }
    const now = new Date().toISOString();
    const updated: GatewayInstitutionalResource = {
      ...found,
      status: decision,
      humanReviewed: true,
      reviewedByUserId: reviewerAdminId,
      reviewedAt: now,
      version: found.version + 1,
      updatedAt: now,
    };
    this.resources.set(code, updated);
    return { ...updated, tags: [...updated.tags] };
  }
}

