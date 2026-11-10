import { describe, expect, it } from 'vitest';
import {
  CONSENT_STATUSES,
  CURRENT_CONSENT_VERSION,
  findForbiddenProfileFields,
} from './student-contracts';

describe('student-contracts (Sprint 2)', () => {
  it('define estados válidos de consentimiento y versión activa', () => {
    expect(CONSENT_STATUSES).toEqual(['pending', 'accepted', 'withdrawn']);
    expect(CURRENT_CONSENT_VERSION).toBe('1.0');
  });

  it('detecta campos sensibles o restringidos no autorizados en el perfil', () => {
    expect(
      findForbiddenProfileFields({
        engineeringProgram: 'Ingeniería de Sistemas',
        semester: 3,
      }),
    ).toEqual([]);

    expect(
      findForbiddenProfileFields({
        engineeringProgram: 'Ingeniería de Sistemas',
        gpa: 4.2,
        grades: [3.5, 4.0],
        clinicalDiagnosis: 'ansiedad',
      }),
    ).toEqual(['gpa', 'grades', 'clinicalDiagnosis']);
  });
});

