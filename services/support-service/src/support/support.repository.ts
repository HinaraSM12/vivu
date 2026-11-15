import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import type {
  AssignedStudentRecord,
  FacilitatorCommitmentRecord,
  FacilitatorNoteRecord,
  SupportDomainEvent,
} from './support.types';

const FAC_INGENIERIA_ID = '00000000-0000-4000-8000-000000000002';
const FAC_BIENESTAR_ID = '00000000-0000-4000-8000-000000000003';
const STU_ACTIVO_UUID = '00000000-0000-4000-8000-000000000004';
const STU_RECUPERACION_UUID = '00000000-0000-4000-8000-000000000005';
const STU_NUEVO_UUID = '00000000-0000-4000-8000-000000000006';

@Injectable()
export class SupportRepository {
  private readonly students = new Map<string, AssignedStudentRecord>();
  private readonly notesByStudent = new Map<string, FacilitatorNoteRecord[]>();
  private readonly commitmentsById = new Map<
    string,
    FacilitatorCommitmentRecord
  >();
  private readonly emittedEvents: SupportDomainEvent[] = [];

  constructor() {
    this.seed();
  }

  private seed(): void {
    const activeStudent: AssignedStudentRecord = {
      studentId: STU_ACTIVO_UUID,
      analyticsSubjectId: 'pseudo-stu-001',
      assignedFacilitatorIds: [FAC_INGENIERIA_ID, 'usr-fac-001'],
      displayName: 'Estudiante Activo Cohorte Piloto',
      engineeringProgram: 'Ingeniería de Sistemas e Informática',
      semester: 3,
      continuitySignal: 'active',
      continuityLabel: 'Continuidad activa esta semana',
      weeklyCompletedMissions: 2,
      recoveryActive: false,
      lastInteractionAt: '2026-11-11T14:00:00.000Z',
    };
    this.students.set(STU_ACTIVO_UUID, activeStudent);
    this.students.set('usr-stu-001', {
      ...activeStudent,
      studentId: 'usr-stu-001',
    });

    const recoveryStudent: AssignedStudentRecord = {
      studentId: STU_RECUPERACION_UUID,
      analyticsSubjectId: 'pseudo-stu-002',
      assignedFacilitatorIds: [FAC_INGENIERIA_ID, 'usr-fac-001'],
      displayName: 'Estudiante en Retoma Gradual',
      engineeringProgram: 'Ingeniería Industrial',
      semester: 4,
      continuitySignal: 'recovery_suggested',
      continuityLabel: 'Oportunidad de retomar con microacción ligera',
      weeklyCompletedMissions: 1,
      recoveryActive: true,
      lastInteractionAt: '2026-11-10T16:30:00.000Z',
    };
    this.students.set(STU_RECUPERACION_UUID, recoveryStudent);
    this.students.set('usr-stu-002', {
      ...recoveryStudent,
      studentId: 'usr-stu-002',
    });

    const newStudent: AssignedStudentRecord = {
      studentId: STU_NUEVO_UUID,
      analyticsSubjectId: 'pseudo-stu-003',
      assignedFacilitatorIds: [FAC_BIENESTAR_ID, 'usr-fac-002'],
      displayName: 'Estudiante Nuevo Ingreso',
      engineeringProgram: 'Ingeniería Civil',
      semester: 1,
      continuitySignal: 'gentle_pause',
      continuityLabel: 'Pausa breve — retomar sin presión',
      weeklyCompletedMissions: 0,
      recoveryActive: false,
      lastInteractionAt: '2026-11-09T10:00:00.000Z',
    };
    this.students.set(STU_NUEVO_UUID, newStudent);
    this.students.set('usr-stu-003', {
      ...newStudent,
      studentId: 'usr-stu-003',
    });

    const initialCommitment: FacilitatorCommitmentRecord = {
      commitmentId: 'com-seed-001',
      facilitatorId: FAC_INGENIERIA_ID,
      studentId: STU_RECUPERACION_UUID,
      analyticsSubjectId: 'pseudo-stu-002',
      title: 'Retomar planificación semanal con un bloque de 10 minutos',
      agreedStep: 'Revisar el taller RES-ACAD-01 y elegir una entrega prioritaria.',
      status: 'IN_PROGRESS',
      dueDate: '2026-11-18',
      updatedAt: '2026-11-11T10:00:00.000Z',
    };
    this.commitmentsById.set(initialCommitment.commitmentId, initialCommitment);
  }

  listAssignedStudents(facilitatorId: string): AssignedStudentRecord[] {
    const seenPseudonyms = new Set<string>();
    const list: AssignedStudentRecord[] = [];
    for (const record of this.students.values()) {
      if (
        record.assignedFacilitatorIds.includes(facilitatorId) &&
        !seenPseudonyms.has(record.analyticsSubjectId)
      ) {
        seenPseudonyms.add(record.analyticsSubjectId);
        list.push(record);
      }
    }
    return list;
  }

  getStudentById(studentId: string): AssignedStudentRecord | undefined {
    return this.students.get(studentId);
  }

  listNotesForStudent(studentId: string): FacilitatorNoteRecord[] {
    return [...(this.notesByStudent.get(studentId) ?? [])];
  }

  addNote(
    note: Omit<FacilitatorNoteRecord, 'noteId' | 'createdAt'>,
  ): FacilitatorNoteRecord {
    const created: FacilitatorNoteRecord = {
      ...note,
      noteId: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const existing = this.notesByStudent.get(note.studentId) ?? [];
    existing.unshift(created);
    this.notesByStudent.set(note.studentId, existing);
    return created;
  }

  listCommitmentsForStudent(studentId: string): FacilitatorCommitmentRecord[] {
    const student = this.students.get(studentId);
    const targetSubject = student?.analyticsSubjectId;
    return Array.from(this.commitmentsById.values()).filter(
      (c) =>
        c.studentId === studentId ||
        (targetSubject && c.analyticsSubjectId === targetSubject),
    );
  }

  createCommitment(
    data: Omit<FacilitatorCommitmentRecord, 'commitmentId' | 'updatedAt'>,
  ): FacilitatorCommitmentRecord {
    const created: FacilitatorCommitmentRecord = {
      ...data,
      commitmentId: randomUUID(),
      updatedAt: new Date().toISOString(),
    };
    this.commitmentsById.set(created.commitmentId, created);
    return created;
  }

  getCommitmentById(
    commitmentId: string,
  ): FacilitatorCommitmentRecord | undefined {
    return this.commitmentsById.get(commitmentId);
  }

  saveCommitment(
    record: FacilitatorCommitmentRecord,
  ): FacilitatorCommitmentRecord {
    this.commitmentsById.set(record.commitmentId, record);
    return record;
  }

  recordEvent(event: SupportDomainEvent): void {
    this.emittedEvents.push(event);
  }

  getEmittedEvents(): SupportDomainEvent[] {
    return [...this.emittedEvents];
  }
}

