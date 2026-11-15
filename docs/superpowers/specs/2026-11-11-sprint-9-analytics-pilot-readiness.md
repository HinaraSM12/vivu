# Spec Sprint 9 — Analítica Longitudinal y Preparación del Piloto (`@vivu/analytics-service`)

- **Rama:** `feat/sprint-9-analytics-pilot-readiness`
- **Issue:** `#10` (`[Sprint 9] Analítica y preparación del piloto`)
- **Alcance:**
  - Contratos de analítica longitudinal y preparación del piloto (`@vivu/contracts`):
    - Los 16 eventos canónicos de telemetría seudonimizada (`CANONICAL_TELEMETRY_EVENT_NAMES`), todos con `schemaVersion: "1.0.0"`, `correlationId` y `participantIdPseudonym` (cero PII directa, `ADR-003`).
    - Indicadores longitudinales de uso y continuidad (adherencia semanal, retención semanas 1, 4 y 10, misiones mostradas/aceptadas/completadas, tasa de finalización, retorno después de interrupción y uso del modo recuperación).
    - Indicadores de pertinencia y conversión de recomendaciones (tasas de aceptación, rechazo, posposición, edición y conversión a recurso institucional `PUBLISHED`).
    - Indicadores de Quality of Experience (QoE, ISO 9241-11 / ISO 9241-210: facilidad de uso, claridad, esfuerzo percibido, satisfacción, utilidad, pertinencia, confianza, autonomía, comprensión, baja frustración/presión/saturación/vigilancia e intención de continuidad).
    - Indicadores de Quality of Service (QoS: latencia P50/P95, tasa de error, disponibilidad durante el piloto, tasa de fallback determinista y frescura de actualización de recursos).
    - Indicadores de calidad del componente LLM instrumental (groundedness = 1.0, tasa de alucinaciones sobre recursos = 0.0, fidelidad de extracción, trazabilidad 100%).
    - Checklist verificable de alistamiento del piloto longitudinal.
  - Servicio `@vivu/analytics-service` (`AnalyticsRepository`, `AnalyticsService`, `AnalyticsController`, `analytics.service.spec.ts`).
  - API Gateway (`@vivu/api-gateway`): endpoints `/api/v1/analytics/*` y pruebas E2E (`test/analytics-pilot.e2e-spec.ts`).
  - Frontend (`@vivu/web`): tablero de analítica longitudinal y checklist de preparación del piloto en `ADMIN` + prueba de integración UI en `App.test.tsx`.

