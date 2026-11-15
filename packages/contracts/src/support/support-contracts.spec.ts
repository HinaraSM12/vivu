import { describe, expect, it } from 'vitest';
import {
  COMMITMENT_STATUSES,
  mapNonStigmatizingContinuityLabel,
  validateFacilitatorNoteContent,
} from './support-contracts';

describe('support-contracts', () => {
  it('maps continuity signals to formative non-stigmatizing labels', () => {
    expect(mapNonStigmatizingContinuityLabel('active')).toBe(
      'Continuidad activa esta semana',
    );
    expect(mapNonStigmatizingContinuityLabel('recovery_suggested')).toBe(
      'Oportunidad de retomar con microacción ligera',
    );
  });

  it('rejects stigmatizing dropout labels in facilitator notes', () => {
    expect(
      validateFacilitatorNoteContent(
        'Acordamos priorizar el taller RES-ACAD-01 y un bloque de 15 minutos el martes.',
      ).valid,
    ).toBe(true);
    expect(
      validateFacilitatorNoteContent(
        'Clasificado como estudiante en riesgo con fracaso académico.',
      ).valid,
    ).toBe(false);
    expect(COMMITMENT_STATUSES).toContain('ADJUSTED');
  });
});

