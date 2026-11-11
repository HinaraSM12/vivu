# Plan de Implementación — Sprint 3: Misiones, Ludificación y Progreso

**Sprint:** 3  
**Rama:** `feat/sprint-3-missions-gamification`  
**Spec de referencia:** `docs/superpowers/specs/2026-11-11-sprint-3-missions-gamification.md`

---

## Pasos de Ejecución

1. **Contratos compartidos (`@vivu/contracts`):**
   - Crear `packages/contracts/src/gamification/gamification-contracts.ts` con los tipos, constantes, calculadores determinísticos de nivel (`computeProgressLevel`), logros personales (`evaluatePersonalAchievements`), eventos de dominio (`mission.assigned.v1`, `mission.accepted.v1`, `mission.completed.v1`, `mission.skipped.v1`) y validador anti-ranking (`hasForbiddenCompetitiveFields`).
   - Crear pruebas unitarias en `packages/contracts/src/gamification/gamification-contracts.spec.ts` y exportar en `packages/contracts/src/index.ts`.
2. **Microservicio de Ludificación (`@vivu/gamification-service`):**
   - Implementar `gamification.types.ts` y `gamification.repository.ts` con el catálogo oficial de 7 misiones (`MIS-PLAN-01` a `MIS-REC-01`), asignaciones iniciales para `usr-stu-001` y `usr-stu-002`, y registro de `clientEventId` para idempotencia.
   - Implementar `gamification.service.ts` y `gamification.controller.ts` para listado con filtros, detalle, aceptación, inicio, pausa, posposición sin castigo, finalización idempotente con desbloqueo de logros y cálculo de progreso personal.
   - Crear pruebas unitarias en `services/gamification-service/src/gamification/gamification.service.spec.ts`.
3. **API Gateway (`@vivu/api-gateway`):**
   - Implementar `gateway-gamification.service.ts` y `gamification-gateway.controller.ts` bajo `/api/v1/missions/*` y `/api/v1/progress` con protección `JwtAuthGuard` y `RolesGuard`.
   - Crear pruebas E2E en `apps/api-gateway/test/gamification.e2e-spec.ts`.
4. **Frontend (`@vivu/web`):**
   - Implementar `apps/web/src/features/gamification/gamification-client.ts`.
   - Actualizar `apps/web/src/app/App.tsx` con las pantallas `STU-09` (Inicio semanal accionable), `STU-10` (Catálogo y filtros de misiones), `STU-11` (Detalle de misión), `STU-12` (Misión en progreso con pausa y posposición), `STU-13` (Feedback de misión completada) y `STU-14` (Progreso personal y logros no competitivos).
   - Ampliar pruebas de integración UI en `apps/web/src/app/App.test.tsx`.
5. **Verificación y Documentación:**
   - Actualizar `VIVU_CONTEXT_HANDOFF.md` y `docs/thesis/bitacora-sprints.md`.
   - Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build`.

