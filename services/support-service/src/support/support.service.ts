import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupportRepository } from './support.repository';
import type {
  AssignedStudentRecord,
  FacilitatorCommitmentRecord,
  FacilitatorNoteRecord,
  SupportCommitmentStatus,
  SupportDomainEvent,
} from './support.types';

const FORBIDDEN_STIGMATIZING_TERMS = [
  'desertor',
  'deserción inminente',
  'alto riesgo de abandono',
  'estudiante en riesgo',
  'fracaso académico',
  'incapaz',
  'diagnóstico depresivo',
  'trastorno clínico',
] as const;

@Injectable()
export class SupportService {
  constructor(
    @Inject(SupportRepository)
    private readonly repository: SupportRepository,
  ) {}

  private assertNonStigmatizingText(text: string): void {
    const lowered = text.toLowerCase();
    for (const term of FORBIDDEN_STIGMATIZING_TERMS) {
      if (lowered.includes(term)) {
        throw new BadRequestException({
          code: 'STIGMATIZING_LANGUAGE_NOT_ALLOWED',
          message: `El texto contiene lenguaje estigmatizante o clínico no permitido en Vivu ("${term}").`,
        });
      }
    }
  }

  private getAssignedStudentOrThrow(
    facilitatorId: string,
    studentId: string,
  ): AssignedStudentRecord {
    const student = this.repository.getStudentById(studentId);
    if (!student) {
      throw new NotFoundException({
        code: 'STUDENT_NOT_FOUND',
        message: `No se encontró el estudiante (${studentId}).`,
      });
    }
    if (!student.assignedFacilitatorIds.includes(facilitatorId)) {
      throw new ForbiddenException({
        code: 'FACILITATOR_STUDENT_NOT_ASSIGNED',
        message:
          'Solo puedes consultar o registrar seguimientos de estudiantes asignados a tu cohorte.',
      });
    }
    return student;
  }

  listAssignedStudents(facilitatorId: string): Array<
    AssignedStudentRecord & { openCommitmentsCount: number }
  > {
    const students = this.repository.listAssignedStudents(facilitatorId);
    return students.map((student) => {
      const commitments = this.repository.listCommitmentsForStudent(
        student.studentId,
      );
      const openCount = commitments.filter(
        (c) => c.status !== 'COMPLETED',
      ).length;
      return {
        ...student,
        openCommitmentsCount: openCount,
      };
    });
  }

  getStudentSupportDetail(
    facilitatorId: string,
    studentId: string,
  ): {
    student: AssignedStudentRecord & { openCommitmentsCount: number };
    notes: FacilitatorNoteRecord[];
    commitments: FacilitatorCommitmentRecord[];
  } {
    const student = this.getAssignedStudentOrThrow(facilitatorId, studentId);
    const notes = this.repository.listNotesForStudent(studentId);
    const commitments = this.repository.listCommitmentsForStudent(studentId);
    const openCommitmentsCount = commitments.filter(
      (c) => c.status !== 'COMPLETED',
    ).length;

    return {
      student: {
        ...student,
        openCommitmentsCount,
      },
      notes,
      commitments,
    };
  }

  createSupportNote(
    facilitatorId: string,
    studentId: string,
    input: { summary: string; suggestedResourceCode?: string | null },
  ): FacilitatorNoteRecord {
    const student = this.getAssignedStudentOrThrow(facilitatorId, studentId);
    if (!input.summary || !input.summary.trim()) {
      throw new BadRequestException({
        code: 'NOTE_SUMMARY_REQUIRED',
        message: 'El resumen de seguimiento es obligatorio.',
      });
    }
    this.assertNonStigmatizingText(input.summary);

    const created = this.repository.addNote({
      facilitatorId,
      studentId,
      analyticsSubjectId: student.analyticsSubjectId,
      summary: input.summary.trim(),
      suggestedResourceCode: input.suggestedResourceCode?.trim() || null,
    });

    this.repository.recordEvent({
      eventId: randomUUID(),
      eventType: 'facilitator.note_created.v1',
      schemaVersion: '1.0.0',
      occurredAt: created.createdAt,
      producer: 'support-service',
      subjectId: student.analyticsSubjectId,
      payload: {
        noteId: created.noteId,
        suggestedResourceCode: created.suggestedResourceCode,
      },
    });

    return created;
  }

  createCommitment(
    facilitatorId: string,
    studentId: string,
    input: {
      title: string;
      agreedStep: string;
      dueDate?: string | null;
    },
  ): FacilitatorCommitmentRecord {
    const student = this.getAssignedStudentOrThrow(facilitatorId, studentId);
    if (!input.title?.trim() || !input.agreedStep?.trim()) {
      throw new BadRequestException({
        code: 'COMMITMENT_FIELDS_REQUIRED',
        message: 'El título y el paso acordado del compromiso son obligatorios.',
      });
    }
    this.assertNonStigmatizingText(input.title);
    this.assertNonStigmatizingText(input.agreedStep);

    const created = this.repository.createCommitment({
      facilitatorId,
      studentId,
      analyticsSubjectId: student.analyticsSubjectId,
      title: input.title.trim(),
      agreedStep: input.agreedStep.trim(),
      status: 'PENDING',
      dueDate: input.dueDate?.trim() || null,
    });

    this.repository.recordEvent({
      eventId: randomUUID(),
      eventType: 'commitment.updated.v1',
      schemaVersion: '1.0.0',
      occurredAt: created.updatedAt,
      producer: 'support-service',
      subjectId: student.analyticsSubjectId,
      payload: {
        commitmentId: created.commitmentId,
        status: created.status,
      },
    });

    return created;
  }

  updateCommitmentStatus(
    facilitatorId: string,
    commitmentId: string,
    status: SupportCommitmentStatus,
  ): FacilitatorCommitmentRecord {
    const existing = this.repository.getCommitmentById(commitmentId);
    if (!existing) {
      throw new NotFoundException({
        code: 'COMMITMENT_NOT_FOUND',
        message: `No se encontró el compromiso (${commitmentId}).`,
      });
    }
    this.getAssignedStudentOrThrow(facilitatorId, existing.studentId);

    const updated: FacilitatorCommitmentRecord = {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
    };
    this.repository.saveCommitment(updated);

    this.repository.recordEvent({
      eventId: randomUUID(),
      eventType: 'commitment.updated.v1',
      schemaVersion: '1.0.0',
      occurredAt: updated.updatedAt,
      producer: 'support-service',
      subjectId: updated.analyticsSubjectId,
      payload: {
        commitmentId: updated.commitmentId,
        status: updated.status,
      },
    });

    return updated;
  }

  getEmittedEvents(): SupportDomainEvent[] {
    return this.repository.getEmittedEvents();
  }
}

