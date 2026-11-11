import { describe, expect, it } from 'vitest';
import {
  canRecommendInstitutionalResource,
  RESOURCE_LIFECYCLE_STATUSES,
  RESOURCE_SOURCE_TYPES,
  sanitizeEmailContentBeforeLlm,
  STUDENT_RECOMMENDATION_ACTIONS,
  TELEMETRY_EVENT_TYPES,
} from './resource-contracts';

describe('resource-contracts (Ingesta multifuente, moderación, agencia y telemetría)', () => {
  it('define los tipos de fuente, estados de moderación, acciones de agencia y 16 eventos de telemetría', () => {
    expect(RESOURCE_SOURCE_TYPES).toContain('WEB_OFFICIAL');
    expect(RESOURCE_SOURCE_TYPES).toContain('MAIL_AUTHORIZED');
    expect(RESOURCE_SOURCE_TYPES).toContain('MANUAL_PROFESSOR');
    expect(RESOURCE_SOURCE_TYPES).toContain('MANUAL_ADMIN');

    expect(RESOURCE_LIFECYCLE_STATUSES).toEqual([
      'DRAFT',
      'PENDING_REVIEW',
      'NEEDS_REVIEW',
      'APPROVED',
      'PUBLISHED',
      'REJECTED',
      'EXPIRED',
      'ARCHIVED',
    ]);

    expect(STUDENT_RECOMMENDATION_ACTIONS).toEqual([
      'ACCEPT',
      'REJECT',
      'POSTPONE',
      'EDIT',
      'DISMISS_SIMILAR',
    ]);

    expect(TELEMETRY_EVENT_TYPES).toHaveLength(16);
    expect(TELEMETRY_EVENT_TYPES).toContain('RECOVERY_MODE_ACTIVATED');
    expect(TELEMETRY_EVENT_TYPES).toContain('RESOURCE_OPENED');
    expect(TELEMETRY_EVENT_TYPES).toContain('LLM_FALLBACK');
  });

  it('prohíbe recomendar recursos sin resourceId o que no estén en estado PUBLISHED', () => {
    expect(canRecommendInstitutionalResource(null)).toBe(false);
    expect(
      canRecommendInstitutionalResource({
        resourceId: '',
        status: 'PUBLISHED',
      }),
    ).toBe(false);
    expect(
      canRecommendInstitutionalResource({
        resourceId: 'res-01',
        status: 'NEEDS_REVIEW',
      }),
    ).toBe(false);
    expect(
      canRecommendInstitutionalResource({
        resourceId: 'res-01',
        status: 'PUBLISHED',
      }),
    ).toBe(true);
  });

  it('sanitiza PII (correos, teléfonos, documentos e hilos) antes de enviar texto de correo al LLM', () => {
    const rawMail = [
      'Hola equipo, adjunto monitoría de Cálculo.',
      'Contacto personal: juan.perez@gmail.com | Cel: +57 300 123 4567 | CC: 1098765432',
      '> El lunes escribió: hilo privado anterior',
    ].join('\n');

    const sanitized = sanitizeEmailContentBeforeLlm(rawMail);
    expect(sanitized).not.toContain('juan.perez@gmail.com');
    expect(sanitized).not.toContain('300 123 4567');
    expect(sanitized).not.toContain('1098765432');
    expect(sanitized).not.toContain('hilo privado anterior');
    expect(sanitized).toContain('[EMAIL_REDACTED]');
    expect(sanitized).toContain('[PHONE_REDACTED]');
    expect(sanitized).toContain('[ID_REDACTED]');
  });
});

