# Plan de Implementación — Sprint 7: Facilitador (`@vivu/support-service`)

1. **Contratos (`@vivu/contracts`):**
   - Crear `packages/contracts/src/support/support-contracts.ts` y `support-contracts.spec.ts`.
   - Exportar desde `packages/contracts/src/index.ts`.
2. **Servicio de Acompañamiento (`@vivu/support-service`):**
   - Crear `support.types.ts`, `support.repository.ts`, `support.service.ts`, `support.controller.ts` y `support.service.spec.ts`.
   - Registrar en `services/support-service/src/app.module.ts`.
3. **API Gateway (`@vivu/api-gateway`):**
   - Crear `gateway-facilitator.service.ts` y `facilitator-gateway.controller.ts` (`/api/v1/facilitator/*`).
   - Añadir pruebas E2E en `apps/api-gateway/test/facilitator-support.e2e-spec.ts`.
4. **Frontend (`@vivu/web`):**
   - Crear `apps/web/src/features/facilitator/facilitator-client.ts` e integrar vistas `FAC-01..FAC-04` en `apps/web/src/app/App.tsx` y pruebas en `apps/web/src/app/App.test.tsx`.
5. **Documentación y Bitácora:**
   - Actualizar `VIVU_CONTEXT_HANDOFF.md` y `docs/thesis/bitacora-sprints.md`.

