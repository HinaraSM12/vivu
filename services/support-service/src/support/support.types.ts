export type SupportContinuitySignal =
  | 'active'
  | 'gentle_pause'
  | 'recovery_suggested';

export type SupportCommitmentStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ADJUSTED';

export interface AssignedStudentRecord {
  studentId: string;
  analyticsSubjectId: string;
  assignedFacilitatorIds: string[];
  displayName: string;
  engineeringProgram: string;
  semester: number;
  continuitySignal: SupportContinuitySignal;
  continuityLabel: string;
  weeklyCompletedMissions: number;
  recoveryActive: boolean;
  lastInteractionAt: string;
}

export interface FacilitatorNoteRecord {
  noteId: string;
  facilitatorId: string;
  studentId: string;
  analyticsSubjectId: string;
  summary: string;
  suggestedResourceCode: string | null;
  createdAt: string;
}

export interface FacilitatorCommitmentRecord {
  commitmentId: string;
  facilitatorId: string;
  studentId: string;
  analyticsSubjectId: string;
  title: string;
  agreedStep: string;
  status: SupportCommitmentStatus;
  dueDate: string | null;
  updatedAt: string;
}

export interface SupportDomainEvent {
  eventId: string;
  eventType: 'facilitator.note_created.v1' | 'commitment.updated.v1';
  schemaVersion: '1.0.0';
  occurredAt: string;
  producer: 'support-service';
  subjectId: string;
  payload: Record<string, unknown>;
}

