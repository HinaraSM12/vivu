# Telemetría Pseudonimizada y Analítica de Eventos (Punto 13)

## 1. Propósito

Registrar evidencia estructurada y pseudonimizada para evaluar los **KPIs de uso y continuidad**, **KPIs de recomendaciones**, **QoS** y **calidad instrumental del componente LLM** durante las 10 semanas del estudio piloto, sin recolectar datos personales directos ni convertir la plataforma en un mecanismo de vigilancia.

---

## 2. Esquema canónico de eventos de telemetría (Punto 13)

Todo evento de telemetría registrado en `analytics-service` sigue la estructura canónica:

```json
{
  "event_id": "uuid",
  "participant_id_pseudonym": "pseudonym-uuid",
  "timestamp": "2026-11-10T18:30:00.000Z",
  "session_id": "uuid",
  "event_type": "RECOMMENDATION_SHOWN",
  "mission_id": "uuid-or-null",
  "recommendation_id": "uuid-or-null",
  "resource_id": "uuid-or-null",
  "action": "SHOWN|ACCEPTED|REJECTED|POSTPONED|EDITED|DISMISSED_SIMILAR|OPENED|REPORTED_USED",
  "status": "SUCCESS|FALLBACK|ERROR|TIMEOUT",
  "latency_ms": 142,
  "model_version": "gemini-2.5-flash|deterministic-v1|null",
  "prompt_version": "explain-rec-v1.0|null"
}
```

---

## 3. Catálogo de eventos canónicos de telemetría (Punto 13)

| `event_type` (Canónico) | Evento de dominio equivalente | Indicadores que alimenta |
|---|---|---|
| `SESSION_STARTED` | `session.started.v1` | Adherencia semanal, retención en semanas 1, 4 y 10, retorno tras interrupción. |
| `MISSION_SHOWN` | `mission.assigned.v1` / `mission.shown.v1` | Misiones mostradas. |
| `MISSION_ACCEPTED` | `mission.accepted.v1` | Misiones aceptadas. |
| `MISSION_REJECTED` | `mission.rejected.v1` | Tasa de descarte de misiones, agencia estudiantil. |
| `MISSION_COMPLETED` | `mission.completed.v1` | Misiones completadas, tasa de finalización, continuidad de acciones SRL. |
| `MISSION_POSTPONED` | `mission.skipped.v1` (`POSTPONED`) | Posposición de misiones, ajuste de carga semanal. |
| `RECOVERY_MODE_ACTIVATED` | `recovery.activated.v1` | Uso del modo recuperación y retorno tras semanas difíciles. |
| `RECOMMENDATION_SHOWN` | `recommendation.generated.v1` / `shown` | Denominador de tasas de aceptación, rechazo, posposición y edición. |
| `RECOMMENDATION_ACCEPTED` | `recommendation.accepted.v1` | Tasa de aceptación de recomendaciones, denominador de conversión a recurso. |
| `RECOMMENDATION_REJECTED` | `recommendation.rejected.v1` | Tasa de rechazo (incluye `POSTPONED`, `EDITED` y `DISMISSED_SIMILAR` en `action`). |
| `RESOURCE_OPENED` | `resource.viewed.v1` | Conversión a recurso institucional ($\text{RESOURCE\_OPENED} / \text{RECOMMENDATION\_ACCEPTED}$). |
| `RESOURCE_REPORTED_USED` | `resource.reported_used.v1` | Uso reportado voluntariamente del recurso institucional sin invadir privacidad. |
| `LLM_REQUESTED` | `llm.requested.v1` | Latencia P50/P95 del LLM, cumplimiento de schema, trazabilidad de `model_version` y `prompt_version`. |
| `LLM_FALLBACK` | `llm.fallback.v1` | `FALLBACK_RATE` y resiliencia del recomendador híbrido. |
| `ERROR_OCCURRED` | `system.error.v1` | `ERROR_RATE`, `TIMEOUT_RATE`, `LLM_ERROR_RATE` e incidencias técnicas. |
| `SESSION_ENDED` | `session.ended.v1` | Duración y cierre limpio de sesión online/offline. |

---

## 4. Reglas de privacidad y cronología offline

1. **Cero PII en telemetría:** `participant_id_pseudonym` es el único identificador de participante en `analytics-service`. Jamás se incluyen correos, nombres ni textos libres sensibles.
2. **Preservación de cronología offline:** Cuando la PWA opera sin conexión, los eventos se almacenan localmente con su `timestamp` real de ocurrencia (`clientOccurredAt`) y se sincronizan al recuperar red conservando tanto el instante de acción del estudiante como el instante de ingesta en el servidor.
