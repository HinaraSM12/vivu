# Catálogo de eventos V1

## Envelope común

```json
{
  "eventId": "uuid",
  "eventType": "mission.completed.v1",
  "occurredAt": "2026-08-19T20:00:00Z",
  "actorId": "pseudonymous-user-id",
  "subjectId": "pseudonymous-student-id",
  "correlationId": "uuid",
  "schemaVersion": 1,
  "clientEventId": "uuid-optional",
  "clientOccurredAt": "ISO-8601-optional",
  "connectivityMode": "online|offline_sync",
  "payload": {}
}
```

## Reglas

- `eventId` es globalmente único.
- Consumidores deben ser idempotentes.
- Nunca reutilizar el mismo nombre para payload incompatible: crear `.v2`.
- Evitar PII en payload. Preferir IDs seudónimos y códigos.
- Productor persiste primero su cambio transaccional y publica usando patrón outbox o mecanismo equivalente cuando se implemente confiabilidad de producción del piloto.

## Eventos

| Evento | Productor | Consumidores principales | Payload mínimo |
|---|---|---|---|
| `user.registered.v1` | identity | analytics | `userRole` |
| `user.role_changed.v1` | identity | analytics/audit | `targetUserId`, `oldRoles`, `newRoles` |
| `consent.updated.v1` | student | analytics/audit | `status`, `consentVersion` |
| `student.profile_updated.v1` | student | recommendation/analytics | `changedFieldCodes` |
| `mission.assigned.v1` | gamification | analytics | `assignmentId`, `missionId`, `source` |
| `mission.accepted.v1` | gamification | analytics | `assignmentId`, `missionId` |
| `mission.completed.v1` | gamification | analytics | `assignmentId`, `missionId`, `durationBucket?` |
| `mission.skipped.v1` | gamification | analytics | `assignmentId`, `reasonCode?` |
| `recovery.activated.v1` | gamification | analytics | `recoveryId`, `reasonCode` |
| `resource.viewed.v1` | resource/gateway | analytics | `resourceId`, `source` |
| `survey.submitted.v1` | survey | analytics | `surveyVersionId`, `windowCode` |
| `recommendation.generated.v1` | recommendation | analytics | `runId`, `selectedCount`, `fallbackUsed`, `configVersion` |
| `facilitator.note_created.v1` | support | analytics/audit | `assignmentId`, `noteId` sin contenido libre |
| `commitment.updated.v1` | support | analytics | `commitmentId`, `status` |
| `sync.action_applied.v1` | gateway/owner service | analytics/audit técnico | `clientEventId`, `actionType`, `result` |
| `recommendation.offline_used.v1` | gateway/recommendation integration | analytics | `recommendationId`, `ruleVersion`, `catalogVersion` |

## Routing keys sugeridas

- `identity.*`
- `student.*`
- `gamification.*`
- `resource.*`
- `recommendation.*`
- `survey.*`
- `support.*`

## Dead-letter y reintentos

- Reintentos con backoff para fallos transitorios.
- Tras límite configurado, enviar a DLQ con motivo técnico.
- DLQ no debe almacenar secretos ni bodies HTTP arbitrarios.
- ADMIN técnico puede inspeccionar conteos/IDs; el reproceso debe ser explícito y auditado.

## Eventos originados offline

Cuando una interacción se ejecutó offline, analytics debe conservar `clientOccurredAt` y `serverOccurredAt` por separado. Las métricas longitudinales usan el timestamp de cliente solo después de validaciones razonables de formato/ventana; el timestamp de servidor conserva trazabilidad de ingestión.
