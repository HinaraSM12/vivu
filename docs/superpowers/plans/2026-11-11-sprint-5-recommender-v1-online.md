# Plan de Implementación — Sprint 5: Recomendador V1 Online

1. **Contratos (`@vivu/contracts`):**
   - Crear `packages/contracts/src/recommendation/recommendation-contracts.ts` y `recommendation-contracts.spec.ts`.
   - Exportar tipos y helpers desde `packages/contracts/src/index.ts`.
2. **Servicio Python (`services/recommendation-service`):**
   - Implementar `src/recommendation_service/engine.py` con motor de reglas deterministas (`rule_version = "1.0.0"`), abstracción `LLMProvider` con guardia anti-alucinación/anti-estigma y fallback determinista, trazabilidad y sanitización de PII para extracción asistida (`ADR-006`).
   - Exponer endpoints en `src/recommendation_service/main.py` y pruebas en `tests/test_recommender.py`.
3. **API Gateway (`@vivu/api-gateway`):**
   - Crear `gateway-recommendation.service.ts` y `recommendation-gateway.controller.ts` (`/api/v1/recommendations`, `/api/v1/recommendations/refresh`, `/api/v1/recommendations/:recommendationId/action`, `/api/v1/recommendations/traces`).
   - Añadir pruebas E2E en `apps/api-gateway/test/recommendations.e2e-spec.ts`.
4. **Frontend (`@vivu/web`):**
   - Crear `apps/web/src/features/recommendations/recommendation-client.ts` e integrar `STU-16` en `apps/web/src/app/App.tsx` con explicación trazable y las 5 acciones de agencia del estudiante.
   - Añadir pruebas en `apps/web/src/app/App.test.tsx`.
5. **Documentación y Bitácora:**
   - Actualizar `VIVU_CONTEXT_HANDOFF.md` y `docs/thesis/bitacora-sprints.md`.
