export type ConnectivityMode = 'online' | 'offline_sync';

export interface EventEnvelope<TPayload extends Record<string, unknown>> {
  eventId: string;
  eventType: string;
  occurredAt: string;
  actorId?: string;
  subjectId?: string;
  correlationId: string;
  schemaVersion: number;
  clientEventId?: string;
  clientOccurredAt?: string;
  connectivityMode?: ConnectivityMode;
  payload: TPayload;
}
