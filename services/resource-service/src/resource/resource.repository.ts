import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type {
  DomainEventRecord,
  InstitutionalResourceEntity,
  ResourceVersionRecordEntity,
} from './resource.types';

const SEED_RESOURCES: InstitutionalResourceEntity[] = [
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
export class ResourceRepository {
  private readonly resources = new Map<string, InstitutionalResourceEntity>();
  private readonly versions = new Map<string, ResourceVersionRecordEntity[]>();
  private readonly analyticsSubjectIds = new Map<string, string>();
  private readonly emittedEvents: DomainEventRecord[] = [];

  constructor() {
    for (const item of SEED_RESOURCES) {
      this.resources.set(item.code, { ...item, tags: [...item.tags] });
      this.versions.set(item.code, [
        {
          versionId: `ver-${item.code}-1`,
          resourceCode: item.code,
          versionNumber: 1,
          changedByUserId: item.contributorUserId,
          changeReason: 'Carga inicial de seed institucional',
          snapshotStatus: item.status,
          createdAt: item.createdAt,
        },
      ]);
    }
    this.analyticsSubjectIds.set('usr-stu-001', 'sub-anon-stu-001');
    this.analyticsSubjectIds.set(
      '00000000-0000-4000-8000-000000000004',
      'sub-anon-stu-001',
    );
    this.analyticsSubjectIds.set('usr-stu-002', 'sub-anon-stu-002');
    this.analyticsSubjectIds.set(
      '00000000-0000-4000-8000-000000000005',
      'sub-anon-stu-002',
    );
  }

  getAllResources(): InstitutionalResourceEntity[] {
    return Array.from(this.resources.values()).map((r) => ({
      ...r,
      tags: [...r.tags],
    }));
  }

  getResourceByCode(code: string): InstitutionalResourceEntity | null {
    const found = this.resources.get(code);
    return found ? { ...found, tags: [...found.tags] } : null;
  }

  findDuplicateByTitleAndUnit(
    title: string,
    organizerUnit: string,
  ): InstitutionalResourceEntity | null {
    const normalizedTitle = title.trim().toLowerCase();
    const normalizedUnit = organizerUnit.trim().toLowerCase();
    for (const item of this.resources.values()) {
      if (
        item.title.trim().toLowerCase() === normalizedTitle &&
        item.organizerUnit.trim().toLowerCase() === normalizedUnit
      ) {
        return { ...item, tags: [...item.tags] };
      }
    }
    return null;
  }

  saveResource(
    entity: InstitutionalResourceEntity,
    changedByUserId: string,
    changeReason: string,
  ): InstitutionalResourceEntity {
    const saved = { ...entity, tags: [...entity.tags] };
    this.resources.set(saved.code, saved);
    const history = this.versions.get(saved.code) ?? [];
    history.push({
      versionId: randomUUID(),
      resourceCode: saved.code,
      versionNumber: saved.version,
      changedByUserId,
      changeReason,
      snapshotStatus: saved.status,
      createdAt: saved.updatedAt,
    });
    this.versions.set(saved.code, history);
    return saved;
  }

  getResourceVersions(code: string): ResourceVersionRecordEntity[] {
    return [...(this.versions.get(code) ?? [])];
  }

  getAnalyticsSubjectId(studentId: string): string {
    if (!this.analyticsSubjectIds.has(studentId)) {
      this.analyticsSubjectIds.set(studentId, `sub-anon-${randomUUID()}`);
    }
    return this.analyticsSubjectIds.get(studentId)!;
  }

  recordDomainEvent(event: DomainEventRecord): void {
    this.emittedEvents.push(event);
  }

  getEmittedEvents(): DomainEventRecord[] {
    return [...this.emittedEvents];
  }
}

