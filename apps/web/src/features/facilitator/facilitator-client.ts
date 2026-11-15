export type FacilitatorContinuitySignal =
  | 'active'
  | 'gentle_pause'
  | 'recovery_suggested';

export type FacilitatorCommitmentStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ADJUSTED';

export interface FacilitatorStudentSummaryView {
  studentId: string;
  participantIdPseudonym: string;
  displayName: string;
  engineeringProgram: string;
  semester: number;
  continuitySignal: FacilitatorContinuitySignal;
  continuityLabel: string;
  weeklyCompletedMissions: number;
  recoveryActive: boolean;
  lastInteractionAt: string;
  openCommitmentsCount: number;
  assignedFacilitatorIds: string[];
}

export interface FacilitatorNoteView {
  noteId: string;
  facilitatorId: string;
  studentId: string;
  summary: string;
  suggestedResourceCode: string | null;
  createdAt: string;
}

export interface FacilitatorCommitmentView {
  commitmentId: string;
  facilitatorId: string;
  studentId: string;
  title: string;
  agreedStep: string;
  status: FacilitatorCommitmentStatus;
  dueDate: string | null;
  updatedAt: string;
}

const STORAGE_KEY_FACILITATOR = 'vivu.sprint7.facilitator.v1';

interface StoredFacilitatorState {
  students: FacilitatorStudentSummaryView[];
  notes: FacilitatorNoteView[];
  commitments: FacilitatorCommitmentView[];
}

const FAC_INGENIERIA_ID = '00000000-0000-4000-8000-000000000002';
const FAC_BIENESTAR_ID = '00000000-0000-4000-8000-000000000003';

function createInitialState(): StoredFacilitatorState {
  return {
    students: [
      {
        studentId: '00000000-0000-4000-8000-000000000004',
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
      },
      {
        studentId: '00000000-0000-4000-8000-000000000005',
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
      },
      {
        studentId: '00000000-0000-4000-8000-000000000006',
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
      },
    ],
    notes: [
      {
        noteId: 'note-seed-001',
        facilitatorId: FAC_INGENIERIA_ID,
        studentId: '00000000-0000-4000-8000-000000000005',
        summary:
          'Conversación inicial de acompañamiento: priorizar un paso breve de 10 minutos sin sobrecarga.',
        suggestedResourceCode: 'RES-ACAD-01',
        createdAt: '2026-11-11T09:30:00.000Z',
      },
    ],
    commitments: [
      {
        commitmentId: 'com-seed-001',
        facilitatorId: FAC_INGENIERIA_ID,
        studentId: '00000000-0000-4000-8000-000000000005',
        title: 'Retomar planificación semanal con un bloque de 10 minutos',
        agreedStep:
          'Revisar el taller RES-ACAD-01 y elegir una entrega prioritaria.',
        status: 'IN_PROGRESS',
        dueDate: '2026-11-18',
        updatedAt: '2026-11-11T10:00:00.000Z',
      },
    ],
  };
}

export class FacilitatorClient {
  private loadState(): StoredFacilitatorState {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_FACILITATOR);
      if (!raw) {
        return createInitialState();
      }
      return JSON.parse(raw) as StoredFacilitatorState;
    } catch {
      return createInitialState();
    }
  }

  private saveState(state: StoredFacilitatorState): void {
    try {
      window.localStorage.setItem(
        STORAGE_KEY_FACILITATOR,
        JSON.stringify(state),
      );
    } catch {
      // Ignore storage errors in sandbox environments
    }
  }

  reset(): void {
    try {
      window.localStorage.removeItem(STORAGE_KEY_FACILITATOR);
    } catch {
      // Ignore storage errors
    }
  }

  listAssignedStudents(facilitatorId: string): FacilitatorStudentSummaryView[] {
    const state = this.loadState();
    return state.students
      .filter((s) => s.assignedFacilitatorIds.includes(facilitatorId))
      .map((s) => ({
        ...s,
        openCommitmentsCount: state.commitments.filter(
          (c) => c.studentId === s.studentId && c.status !== 'COMPLETED',
        ).length,
      }));
  }

  listNotes(facilitatorId: string): FacilitatorNoteView[] {
    const assignedIds = new Set(
      this.listAssignedStudents(facilitatorId).map((s) => s.studentId),
    );
    return this.loadState().notes.filter((n) => assignedIds.has(n.studentId));
  }

  listCommitments(facilitatorId: string): FacilitatorCommitmentView[] {
    const assignedIds = new Set(
      this.listAssignedStudents(facilitatorId).map((s) => s.studentId),
    );
    return this.loadState().commitments.filter((c) =>
      assignedIds.has(c.studentId),
    );
  }

  createNote(
    facilitatorId: string,
    studentId: string,
    summary: string,
    suggestedResourceCode: string | null = 'RES-ACAD-01',
  ): FacilitatorNoteView {
    const state = this.loadState();
    const created: FacilitatorNoteView = {
      noteId: `note-${Date.now()}`,
      facilitatorId,
      studentId,
      summary: summary.trim(),
      suggestedResourceCode,
      createdAt: new Date().toISOString(),
    };
    state.notes = [created, ...state.notes];
    this.saveState(state);
    return created;
  }

  createCommitment(
    facilitatorId: string,
    studentId: string,
    title: string,
    agreedStep: string,
  ): FacilitatorCommitmentView {
    const state = this.loadState();
    const created: FacilitatorCommitmentView = {
      commitmentId: `com-${Date.now()}`,
      facilitatorId,
      studentId,
      title: title.trim(),
      agreedStep: agreedStep.trim(),
      status: 'PENDING',
      dueDate: '2026-11-22',
      updatedAt: new Date().toISOString(),
    };
    state.commitments = [created, ...state.commitments];
    this.saveState(state);
    return created;
  }

  updateCommitmentStatus(
    commitmentId: string,
    status: FacilitatorCommitmentStatus,
  ): void {
    const state = this.loadState();
    state.commitments = state.commitments.map((c) =>
      c.commitmentId === commitmentId
        ? { ...c, status, updatedAt: new Date().toISOString() }
        : c,
    );
    this.saveState(state);
  }
}

export const defaultFacilitatorClient = new FacilitatorClient();

