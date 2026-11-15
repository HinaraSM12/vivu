import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

export type GatewaySupportContinuitySignal =
  | 'active'
  | 'gentle_pause'
  | 'recovery_suggested';

export type GatewaySupportCommitmentStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ADJUSTED';

export interface GatewayAssignedStudentSummary {
  studentId: string;
  participantIdPseudonym: string;
  displayName: string;
  engineeringProgram: string;
  semester: number;
  continuitySignal: GatewaySupportContinuitySignal;
  continuityLabel: string;
  weeklyCompletedMissions: number;
  recoveryActive: boolean;
  lastInteractionAt: string;
  openCommitmentsCount: number;
  assignedFacilitatorIds: string[];
}

export interface GatewayFacilitatorNote {
  noteId: string;
  facilitatorId: string;
  studentId: string;
  participantIdPseudonym: string;
  summary: string;
  suggestedResourceCode: string | null;
  createdAt: string;
}

export interface GatewayFacilitatorCommitment {
  commitmentId: string;
  facilitatorId: string;
  studentId: string;
  participantIdPseudonym: string;
  title: string;
  agreedStep: string;
  status: GatewaySupportCommitmentStatus;
  dueDate: string | null;
  updatedAt: string;
}

const FAC_INGENIERIA_ID = '00000000-0000-4000-8000-000000000002';
const FAC_BIENESTAR_ID = '00000000-0000-4000-8000-000000000003';
const STU_ACTIVO_UUID = '00000000-0000-4000-8000-000000000004';
const STU_RECUPERACION_UUID = '00000000-0000-4000-8000-000000000005';
const STU_NUEVO_UUID = '00000000-0000-4000-8000-000000000006';

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
export class GatewayFacilitatorService {
  private readonly students = new Map<string, GatewayAssignedStudentSummary>();
  private readonly notesByStudent = new Map<string, GatewayFacilitatorNote[]>();
  private readonly commitmentsById = new Map<
    string,
    GatewayFacilitatorCommitment
  >();

  constructor() {
    this.seed();
  }

  private seed(): void {
    const stuActivo: GatewayAssignedStudentSummary = {
      studentId: STU_ACTIVO_UUID,
      participantIdPseudonym: 'pseudo-stu-001',
      displayName: 'Estudiante Activo Cohorte Piloto',
      engineeringProgram: 'Ingeniería de Sistemas e Informática',
      semester: 3,
      continuitySignal: 'active',
      continuityLabel: 'Continuidad activa esta semana',
      weeklyCompletedMissions: 2,
      recoveryActive: false,
      lastInteractionAt: '2026-11-11T14:00:00.000Z',
      openCommitmentsCount: 0,
      assignedFacilitatorIds: [FAC_INGENIERIA_ID, 'usr-fac-001'],
    };
    this.students.set(STU_ACTIVO_UUID, stuActivo);
    this.students.set('usr-stu-001', { ...stuActivo, studentId: 'usr-stu-001' });

    const stuRecuperacion: GatewayAssignedStudentSummary = {
      studentId: STU_RECUPERACION_UUID,
      participantIdPseudonym: 'pseudo-stu-002',
      displayName: 'Estudiante en Retoma Gradual',
      engineeringProgram: 'Ingeniería Industrial',
      semester: 4,
      continuitySignal: 'recovery_suggested',
      continuityLabel: 'Oportunidad de retomar con microacción ligera',
      weeklyCompletedMissions: 1,
      recoveryActive: true,
      lastInteractionAt: '2026-11-10T16:30:00.000Z',
      openCommitmentsCount: 1,
      assignedFacilitatorIds: [FAC_INGENIERIA_ID, 'usr-fac-001'],
    };
    this.students.set(STU_RECUPERACION_UUID, stuRecuperacion);
    this.students.set('usr-stu-002', {
      ...stuRecuperacion,
      studentId: 'usr-stu-002',
    });

    const stuNuevo: GatewayAssignedStudentSummary = {
      studentId: STU_NUEVO_UUID,
      participantIdPseudonym: 'pseudo-stu-003',
      displayName: 'Estudiante Nuevo Ingreso',
      engineeringProgram: 'Ingeniería Civil',
      semester: 1,
      continuitySignal: 'gentle_pause',
      continuityLabel: 'Pausa breve — retomar sin presión',
      weeklyCompletedMissions: 0,
      recoveryActive: false,
      lastInteractionAt: '2026-11-09T10:00:00.000Z',
      openCommitmentsCount: 0,
      assignedFacilitatorIds: [FAC_BIENESTAR_ID, 'usr-fac-002'],
    };
    this.students.set(STU_NUEVO_UUID, stuNuevo);
    this.students.set('usr-stu-003', { ...stuNuevo, studentId: 'usr-stu-003' });

    this.commitmentsById.set('com-seed-001', {
      commitmentId: 'com-seed-001',
      facilitatorId: FAC_INGENIERIA_ID,
      studentId: STU_RECUPERACION_UUID,
      participantIdPseudonym: 'pseudo-stu-002',
      title: 'Retomar planificación semanal con un bloque de 10 minutos',
      agreedStep:
        'Revisar el taller RES-ACAD-01 y elegir una entrega prioritaria.',
      status: 'IN_PROGRESS',
      dueDate: '2026-11-18',
      updatedAt: '2026-11-11T10:00:00.000Z',
    });
  }

  private assertNonStigmatizing(text: string): void {
    const lowered = text.toLowerCase();
    for (const term of FORBIDDEN_STIGMATIZING_TERMS) {
      if (lowered.includes(term)) {
        throw new BadRequestException({
          code: 'STIGMATIZING_LANGUAGE_NOT_ALLOWED',
          message: `El texto contiene lenguaje estigmatizante o clínico no permitido ("${term}").`,
        });
      }
    }
  }

  private getAssignedStudentOrThrow(
    facilitatorId: string,
    studentId: string,
    isAdmin = false,
  ): GatewayAssignedStudentSummary {
    const student = this.students.get(studentId);
    if (!student) {
      throw new NotFoundException({
        code: 'STUDENT_NOT_FOUND',
        message: `No se encontró el estudiante (${studentId}).`,
      });
    }
    if (!isAdmin && !student.assignedFacilitatorIds.includes(facilitatorId)) {
      throw new ForbiddenException({
        code: 'FACILITATOR_STUDENT_NOT_ASSIGNED',
        message:
          'Solo puedes consultar o registrar seguimientos de estudiantes asignados a tu cohorte.',
      });
    }
    return student;
  }

  listAssignedStudents(
    facilitatorId: string,
    isAdmin = false,
  ): GatewayAssignedStudentSummary[] {
    const seenPseudonyms = new Set<string>();
    const list: GatewayAssignedStudentSummary[] = [];
    for (const record of this.students.values()) {
      if (
        (isAdmin || record.assignedFacilitatorIds.includes(facilitatorId)) &&
        !seenPseudonyms.has(record.participantIdPseudonym)
      ) {
        seenPseudonyms.add(record.participantIdPseudonym);
        list.push(record);
      }
    }
    return list;
  }

  getStudentDetail(
    facilitatorId: string,
    studentId: string,
    isAdmin = false,
  ): {
    student: GatewayAssignedStudentSummary;
    notes: GatewayFacilitatorNote[];
    commitments: GatewayFacilitatorCommitment[];
  } {
    const student = this.getAssignedStudentOrThrow(
      facilitatorId,
      studentId,
      isAdmin,
    );
    const notes = [...(this.notesByStudent.get(studentId) ?? [])];
    const commitments = Array.from(this.commitmentsById.values()).filter(
      (c) =>
        c.studentId === studentId ||
        c.participantIdPseudonym === student.participantIdPseudonym,
    );
    return {
      student: {
        ...student,
        openCommitmentsCount: commitments.filter(
          (c) => c.status !== 'COMPLETED',
        ).length,
      },
      notes,
      commitments,
    };
  }

  createNote(
    facilitatorId: string,
    studentId: string,
    input: { summary: string; suggestedResourceCode?: string | null },
    isAdmin = false,
  ): GatewayFacilitatorNote {
    const student = this.getAssignedStudentOrThrow(
      facilitatorId,
      studentId,
      isAdmin,
    );
    if (!input.summary?.trim()) {
      throw new BadRequestException({
        code: 'NOTE_SUMMARY_REQUIRED',
        message: 'El resumen de seguimiento es obligatorio.',
      });
    }
    this.assertNonStigmatizing(input.summary);

    const created: GatewayFacilitatorNote = {
      noteId: randomUUID(),
      facilitatorId,
      studentId,
      participantIdPseudonym: student.participantIdPseudonym,
      summary: input.summary.trim(),
      suggestedResourceCode: input.suggestedResourceCode?.trim() || null,
      createdAt: new Date().toISOString(),
    };
    const existing = this.notesByStudent.get(studentId) ?? [];
    existing.unshift(created);
    this.notesByStudent.set(studentId, existing);
    return created;
  }

  createCommitment(
    facilitatorId: string,
    studentId: string,
    input: { title: string; agreedStep: string; dueDate?: string | null },
    isAdmin = false,
  ): GatewayFacilitatorCommitment {
    const student = this.getAssignedStudentOrThrow(
      facilitatorId,
      studentId,
      isAdmin,
    );
    if (!input.title?.trim() || !input.agreedStep?.trim()) {
      throw new BadRequestException({
        code: 'COMMITMENT_FIELDS_REQUIRED',
        message: 'El título y el paso acordado del compromiso son obligatorios.',
      });
    }
    this.assertNonStigmatizing(input.title);
    this.assertNonStigmatizing(input.agreedStep);

    const created: GatewayFacilitatorCommitment = {
      commitmentId: randomUUID(),
      facilitatorId,
      studentId,
      participantIdPseudonym: student.participantIdPseudonym,
      title: input.title.trim(),
      agreedStep: input.agreedStep.trim(),
      status: 'PENDING',
      dueDate: input.dueDate?.trim() || null,
      updatedAt: new Date().toISOString(),
    };
    this.commitmentsById.set(created.commitmentId, created);
    return created;
  }

  updateCommitmentStatus(
    facilitatorId: string,
    commitmentId: string,
    status: GatewaySupportCommitmentStatus,
    isAdmin = false,
  ): GatewayFacilitatorCommitment {
    const existing = this.commitmentsById.get(commitmentId);
    if (!existing) {
      throw new NotFoundException({
        code: 'COMMITMENT_NOT_FOUND',
        message: `No se encontró el compromiso (${commitmentId}).`,
      });
    }
    this.getAssignedStudentOrThrow(facilitatorId, existing.studentId, isAdmin);
    const updated: GatewayFacilitatorCommitment = {
      ...existing,
      status,
      updatedAt: new Date().toISOString(),
    };
    this.commitmentsById.set(commitmentId, updated);
    return updated;
  }
}

