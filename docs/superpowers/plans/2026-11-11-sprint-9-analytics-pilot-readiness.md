# Plan Sprint 9 — Analítica Longitudinal y Preparación del Piloto

1. **Contratos (`@vivu/contracts`)**:
   - Crear `packages/contracts/src/analytics/analytics-contracts.ts` y `analytics-contracts.spec.ts`.
   - Exportar en `packages/contracts/src/index.ts`.
2. **Microservicio (`@vivu/analytics-service`)**:
   - Implementar `services/analytics-service/src/analytics/analytics.types.ts`, `analytics.repository.ts`, `analytics.service.ts`, `analytics.controller.ts` y `analytics.service.spec.ts`.
   - Registrar en `services/analytics-service/src/app.module.ts`.
3. **API Gateway (`@vivu/api-gateway`)**:
   - Implementar `apps/api-gateway/src/analytics/gateway-analytics.service.ts` y `analytics-gateway.controller.ts` (`/api/v1/analytics/events`, `/api/v1/analytics/pilot-summary`, `/api/v1/analytics/pilot-readiness`).
   - Crear `apps/api-gateway/test/analytics-pilot.e2e-spec.ts`.
4. **Frontend (`@vivu/web`)**:
   - Crear `apps/web/src/features/analytics/analytics-client.ts`.
   - Integrar tablero de KPIs longitudinales (uso, recomendaciones, QoE, QoS, LLM) y checklist de alistamiento del piloto en `apps/web/src/app/App.tsx` y `App.test.tsx`.
5. **Cierre del Roadmap (Sprints 0–9)**:
   - Actualizar `VIVU_CONTEXT_HANDOFF.md` y `docs/thesis/bitacora-sprints.md` dejando los 9 sprints completados.
   - Ejecutar todas las suites de pruebas, linter, typecheck y build, abrir PR (`Closes #10`), verificar CI verde y fusionar a `main`.

