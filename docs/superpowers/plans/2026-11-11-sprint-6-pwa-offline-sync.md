# Plan de Implementación — Sprint 6: PWA Local-First y Sincronización Offline

1. **Contratos (`@vivu/contracts`):**
   - Crear `packages/contracts/src/sync/sync-contracts.ts` y `sync-contracts.spec.ts` (paridad determinista `OFFLINE_RULES` vs Python `1.0.0`, tipos de `Outbox` y lotes de sincronización).
   - Exportar desde `packages/contracts/src/index.ts`.
2. **API Gateway (`@vivu/api-gateway`):**
   - Implementar `gateway-sync.service.ts` y `sync-gateway.controller.ts` (`/api/v1/sync/bootstrap`, `/api/v1/sync/pull`, `/api/v1/sync/actions`).
   - Crear pruebas E2E en `apps/api-gateway/test/sync-offline.e2e-spec.ts`.
3. **Frontend (`@vivu/web`):**
   - Crear `apps/web/src/features/sync/offline-sync-client.ts` (gestión de modo `ONLINE`/`OFFLINE`, cola `Outbox`, sincronización por lotes y recomendador local `OFFLINE_RULES`).
   - Integrar banner global de conectividad y vista `STU-21` (*Sincronización*) en `apps/web/src/app/App.tsx` y pruebas en `apps/web/src/app/App.test.tsx`.
4. **Documentación y Bitácora:**
   - Actualizar `VIVU_CONTEXT_HANDOFF.md` y `docs/thesis/bitacora-sprints.md`.

