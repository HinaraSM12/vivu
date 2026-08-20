import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';
import eventEnvelopeSchema from './event-envelope.schema.json';
import type { EventEnvelope } from './event-envelope';

describe('EventEnvelope', () => {
  it('validates a versioned offline domain event', () => {
    const event: EventEnvelope<{ assignmentId: string }> = {
      eventId: '11111111-1111-4111-8111-111111111111',
      eventType: 'mission.completed.v1',
      occurredAt: '2026-08-19T20:00:00Z',
      actorId: 'pseudonymous-actor',
      subjectId: 'pseudonymous-student',
      correlationId: '22222222-2222-4222-8222-222222222222',
      schemaVersion: 1,
      clientEventId: '33333333-3333-4333-8333-333333333333',
      clientOccurredAt: '2026-08-19T19:58:00Z',
      connectivityMode: 'offline_sync',
      payload: { assignmentId: 'assignment-1' },
    };
    const ajv = new Ajv2020({ strict: true });
    addFormats(ajv);
    const validate = ajv.compile(eventEnvelopeSchema);

    expect(validate(event), JSON.stringify(validate.errors)).toBe(true);
  });

  it('rejects incompatible additional properties', () => {
    const ajv = new Ajv2020({ strict: true });
    addFormats(ajv);
    const validate = ajv.compile(eventEnvelopeSchema);

    expect(validate({ unexpected: true })).toBe(false);
  });
});
