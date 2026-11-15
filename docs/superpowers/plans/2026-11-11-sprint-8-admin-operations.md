# Plan de Implementación — Sprint 8: Administración y Operación del Piloto

1. **Contratos (`@vivu/contracts`):**
   - Crear `packages/contracts/src/admin/admin-contracts.ts` y `admin-contracts.spec.ts`.
   - Exportar desde `packages/contracts/src/index.ts`.
2. **API Gateway (`@vivu/api-gateway`):**
   - Implementar `gateway-admin.service.ts` y `admin-gateway.controller.ts` (`/api/v1/admin/*`).
   - Añadir pruebas E2E en `apps/api-gateway/test/admin-operations.e2e-spec.ts`.
3. **Frontend (`@vivu/web`):**
   - Crear `apps/web/src/features/admin/admin-client.ts` e integrar vistas `ADM-01..ADM-05` en `apps/web/src/app/App.tsx` y pruebas en `apps/web/src/app/App.test.tsx`.
4. **Documentación y Bitácora:**
   - Actualizar `VIVU_CONTEXT_HANDOFF.md` y `docs/thesis/bitacora-sprints.md`.

