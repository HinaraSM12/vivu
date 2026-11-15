import { Injectable } from '@nestjs/common';
import {
  CANONICAL_TELEMETRY_EVENT_NAMES,
  type TelemetryEnvelopeRecord,
} from './analytics.types';

@Injectable()
export class AnalyticsRepository {
  private readonly events: TelemetryEnvelopeRecord[] = [];

  constructor() {
    this.seedCanonicalEvents();
  }

  private seedCanonicalEvents(): void {
    CANONICAL_TELEMETRY_EVENT_NAMES.forEach((eventName, idx) => {
      this.events.push({
        eventId: `evt-seed-${String(idx + 1).padStart(3, '0')}`,
        eventName,
        schemaVersion: '1.0.0',
        occurredAt: '2026-11-11T12:00:00.000Z',
        correlationId: `corr-seed-${idx + 1}`,
        participantIdPseudonym:
          idx % 2 === 0 ? 'pseudo-stu-001' : 'pseudo-stu-002',
        payload: { seeded: true },
      });
    });
  }

  appendEvent(event: TelemetryEnvelopeRecord): TelemetryEnvelopeRecord {
    this.events.unshift(event);
    return event;
  }

  listEvents(): TelemetryEnvelopeRecord[] {
    return [...this.events];
  }
}

