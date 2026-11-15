import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { SupportRepository } from './support.repository';
import { SupportService } from './support.service';

describe('SupportService (Sprint 7 — Facilitator Isolation, Non-Stigmatizing Notes & Commitments)', () => {
  let service: SupportService;

  beforeEach(() => {
    service = new SupportService(new SupportRepository());
  });

  it('lists only students assigned to the requesting facilitator', () => {
    const ingStudents = service.listAssignedStudents('usr-fac-001');
    expect(ingStudents).toHaveLength(2);

    const bienestarStudents = service.listAssignedStudents('usr-fac-002');
    expect(bienestarStudents).toHaveLength(1);
    expect(bienestarStudents[0]?.analyticsSubjectId).toBe('pseudo-stu-003');
  });

  it('blocks a facilitator from viewing or writing notes for an unassigned student (403)', () => {
    expect(() =>
      service.getStudentSupportDetail('usr-fac-001', 'usr-stu-003'),
    ).toThrow(ForbiddenException);
  });

  it('creates support notes and commitments emitting pseudonymized domain events', () => {
    const note = service.createSupportNote('usr-fac-001', 'usr-stu-002', {
      summary:
        'Conversamos sobre priorizar una microacción de 10 minutos y explorar RES-WEL-01.',
      suggestedResourceCode: 'RES-WEL-01',
    });
    expect(note.suggestedResourceCode).toBe('RES-WEL-01');

    const commitment = service.createCommitment('usr-fac-001', 'usr-stu-002', {
      title: 'Realizar pausa de descarga de 10 min el miércoles',
      agreedStep: 'Registrar reflexión breve en Vivu al terminar.',
      dueDate: '2026-11-20',
    });
    const updated = service.updateCommitmentStatus(
      'usr-fac-001',
      commitment.commitmentId,
      'COMPLETED',
    );
    expect(updated.status).toBe('COMPLETED');

    const events = service.getEmittedEvents();
    expect(events.map((e) => e.eventType)).toEqual([
      'facilitator.note_created.v1',
      'commitment.updated.v1',
      'commitment.updated.v1',
    ]);
    expect(events[0]?.subjectId).toBe('pseudo-stu-002');
  });

  it('rejects stigmatizing or clinical diagnosis language in facilitator notes', () => {
    expect(() =>
      service.createSupportNote('usr-fac-001', 'usr-stu-001', {
        summary: 'Se observa un estudiante en riesgo con fracaso académico.',
      }),
    ).toThrow(BadRequestException);
  });
});

