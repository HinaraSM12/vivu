import type { ContinuitySignal } from '../gamification/gamification-contracts';
import { validateNonStigmatizingRationale } from '../recommendation/recommendation-contracts';

export const COMMITMENT_STATUSES = [
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'ADJUSTED',
] as const;
export type CommitmentStatus = (typeof COMMITMENT_STATUSES)[number];

export interface AssignedStudentSummaryDto {
  studentId: string;
  participantIdPseudonym: string;
  displayName: string;
  engineeringProgram: string;
  semester: number;
  continuitySignal: ContinuitySignal;
  continuityLabel: string;
  weeklyCompletedMissions: number;
  recoveryActive: boolean;
  lastInteractionAt: string;
  openCommitmentsCount: number;
}

export interface FacilitatorNoteDto {
  noteId: string;
  facilitatorId: string;
  studentId: string;
  participantIdPseudonym: string;
  summary: string;
  suggestedResourceCode: string | null;
  createdAt: string;
}

export interface FacilitatorCommitmentDto {
  commitmentId: string;
  facilitatorId: string;
  studentId: string;
  participantIdPseudonym: string;
  title: string;
  agreedStep: string;
  status: CommitmentStatus;
  dueDate: string | null;
  updatedAt: string;
}

export interface AssignedStudentDetailDto {
  student: AssignedStudentSummaryDto;
  notes: FacilitatorNoteDto[];
  commitments: FacilitatorCommitmentDto[];
}

export function mapNonStigmatizingContinuityLabel(
  signal: ContinuitySignal,
): string {
  switch (signal) {
    case 'active':
      return 'Continuidad activa esta semana';
    case 'gentle_pause':
      return 'Pausa breve — retomar sin presión';
    case 'recovery_suggested':
      return 'Oportunidad de retomar con microacción ligera';
  }
}

export function validateFacilitatorNoteContent(summary: string): {
  valid: boolean;
  matchedForbiddenTerm: string | null;
} {
  return validateNonStigmatizingRationale(summary);
}
