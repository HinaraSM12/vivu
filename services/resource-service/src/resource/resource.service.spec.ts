import { ResourceRepository } from './resource.repository';
import { ResourceService } from './resource.service';

describe('ResourceService (ADR-006)', () => {
  let repository: ResourceRepository;
  let service: ResourceService;

  beforeEach(() => {
    repository = new ResourceRepository();
    service = new ResourceService(repository);
  });

  it('lists only PUBLISHED resources for students and excludes EXPIRED RES-ARCH-01', () => {
    const published = service.listPublishedResources();
    expect(published).toHaveLength(5);
    expect(published.map((r) => r.code)).not.toContain('RES-ARCH-01');
  });

  it('emits resource.viewed.v1 with pseudonymous subjectId when a student views a PUBLISHED resource', () => {
    const resource = service.viewPublishedResource(
      'RES-ACAD-01',
      'usr-stu-001',
      'corr-res-01',
    );
    expect(resource.code).toBe('RES-ACAD-01');

    const events = repository.getEmittedEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe('resource.viewed.v1');
    expect(events[0]?.subjectId).toBe('sub-anon-stu-001');
  });

  it('registers PROFESSOR resource proposals as PENDING_REVIEW, detects duplicates, and allows ADMIN moderation to PUBLISHED with version history', () => {
    const proposal = service.submitResourceProposal(
      '00000000-0000-4000-8000-000000000008',
      'PROFESSOR',
      {
        code: 'RES-PROF-01',
        title: 'Semillero de Optimización y Analítica Aplicada',
        category: 'CAMPUS_INTEGRATION',
        summary: 'Espacio de iniciación investigativa para pregrado.',
        targetAudience: 'Estudiantes de Ingeniería Industrial y Sistemas',
        modality: 'Híbrido',
        scheduleInfo: 'Jueves 16:00–18:00',
        locationOrLink: 'Bloque M8A',
        contactInfo: 'semillero.opt@vivu.local',
        organizerUnit: 'Departamento de Ingeniería de la Organización',
      },
    );

    expect(proposal.status).toBe('PENDING_REVIEW');
    expect(proposal.humanReviewed).toBe(false);
    expect(service.listPublishedResources()).toHaveLength(5);

    // Duplicate detection
    expect(() =>
      service.submitResourceProposal(
        '00000000-0000-4000-8000-000000000008',
        'PROFESSOR',
        {
          title: 'Semillero de Optimización y Analítica Aplicada',
          category: 'CAMPUS_INTEGRATION',
          summary: 'Duplicado',
          targetAudience: 'Estudiantes',
          modality: 'Híbrido',
          scheduleInfo: 'Jueves',
          locationOrLink: 'M8A',
          contactInfo: 'semillero@vivu.local',
          organizerUnit: 'Departamento de Ingeniería de la Organización',
        },
      ),
    ).toThrow(/Ya existe un recurso registrado/i);

    // Moderate to PUBLISHED by ADMIN
    const approved = service.moderateResource(
      'RES-PROF-01',
      '00000000-0000-4000-8000-000000000001',
      'PUBLISHED',
      'Verificado contra programación oficial del departamento',
    );
    expect(approved.status).toBe('PUBLISHED');
    expect(approved.version).toBe(2);
    expect(service.listPublishedResources()).toHaveLength(6);
    expect(service.getResourceVersions('RES-PROF-01')).toHaveLength(2);
  });
});

