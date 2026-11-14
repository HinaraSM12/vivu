# Plan de Implementación — Sprint 4: Recursos Institucionales, Microcuestionarios y Modo Recuperación

**Sprint:** 4  
**Rama:** `feat/sprint-4-resources-surveys-recovery`  
**Spec de referencia:** `docs/superpowers/specs/2026-11-11-sprint-4-resources-surveys-recovery.md`

---

## Pasos de Ejecución

1. **Contratos compartidos (`@vivu/contracts`):**
   - Crear `packages/contracts/src/survey/survey-contracts.ts` y `packages/contracts/src/survey/survey-contracts.spec.ts` (definiciones de `SUR-WEEKLY-V1`, `SUR-RECOVERY-V1`, respuestas idempotentes, estado y opciones del Modo Recuperación `STU-15`) y exportar en `packages/contracts/src/index.ts`.
2. **Servicio de Recursos (`@vivu/resource-service`):**
   - Implementar `resource.types.ts`, `resource.repository.ts`, `resource.service.ts`, `resource.controller.ts` y `resource.service.spec.ts` con los 26 campos de `ADR-006`, filtrado estricto de `PUBLISHED`, historial `resource_versions`, detección de duplicados, propuestas de `PROFESSOR` (`PENDING_REVIEW`) y evento `resource.viewed.v1`.
3. **Servicio de Encuestas (`@vivu/survey-service`):**
   - Implementar `survey.types.ts`, `survey.repository.ts`, `survey.service.ts`, `survey.controller.ts` y `survey.service.spec.ts` con `SUR-WEEKLY-V1` y `SUR-RECOVERY-V1`, idempotencia por `clientEventId` y emisión de `survey.submitted.v1`.
4. **Modo Recuperación en `@vivu/gamification-service`:**
   - Añadir consulta y activación de Modo Recuperación (`GET /students/:studentId/recovery`, `POST /students/:studentId/recovery/activate`) con selección de misiones elegibles de bajo esfuerzo (`isRecoveryEligible === true && effort === 'LOW'`) y emisión de `recovery.activated.v1`.
5. **API Gateway (`@vivu/api-gateway`) y Frontend (`@vivu/web`):**
   - Exponer `/api/v1/resources/*`, `/api/v1/surveys/*` y `/api/v1/recovery/*` en `@vivu/api-gateway` con pruebas E2E en `apps/api-gateway/test/resources-surveys-recovery.e2e-spec.ts`.
   - Implementar en `@vivu/web` las pantallas `STU-15` (Modo recuperación), `STU-17` (Catálogo y detalle de recursos institucionales), `STU-18` (Microcuestionario breve) y la vista de envío de recursos para `PROFESSOR`.

