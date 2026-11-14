# Especificación Técnica — Sprint 4: Recursos Institucionales, Microcuestionarios y Modo Recuperación

**Fecha:** 2026-11-11  
**Sprint:** 4  
**Rama objetivo:** `feat/sprint-4-resources-surveys-recovery`  
**Issue relacionado:** #5 (`[Sprint 4] Recursos, microcuestionarios y recuperación`)  
**Servicios involucrados:** `packages/contracts`, `services/resource-service`, `services/survey-service`, `services/gamification-service`, `apps/api-gateway`, `apps/web`

---

## 1. Objetivo del Sprint

Implementar el catálogo y flujo de ingesta/moderación de recursos institucionales en `@vivu/resource-service` (conforme a `ADR-006`), los microcuestionarios breves de seguimiento en `@vivu/survey-service` y el **Modo Recuperación sin castigo** en `@vivu/gamification-service`, exponiéndolos en `@vivu/api-gateway` y construyendo en `@vivu/web` las pantallas `STU-15` (Modo recuperación), `STU-17` (Recursos institucionales verificados), `STU-18` (Microcuestionarios breves) y el flujo de registro de recursos para `PROFESSOR` (`RESOURCE_CONTRIBUTOR`).

---

## 2. Reglas de Dominio, Gobernanza y Ética

1. **Recursos institucionales verificados y ciclo de moderación (`ADR-006`):**
   - Los estudiantes (`STUDENT`) únicamente pueden consultar y recibir recomendaciones de recursos con `status === 'PUBLISHED'` y vigencia activa (`RES-ACAD-01`, `RES-ACAD-02`, `RES-ACA-03`, `RES-WEL-01`, `RES-INT-01`).
   - El recurso histórico `RES-ARCH-01` (`EXPIRED` / `INACTIVE`) nunca aparece en el catálogo estudiantil.
   - Los usuarios con rol `PROFESSOR` (`RESOURCE_CONTRIBUTOR`) pueden proponer recursos estructurados que ingresan en estado `PENDING_REVIEW` sin acceso a datos de estudiantes.
   - Al consultar el detalle de un recurso se emite `resource.viewed.v1` con `subjectId` seudónimo.
2. **Microcuestionarios breves (`SUR-WEEKLY-V1` y `SUR-RECOVERY-V1`):**
   - Máximo 3 a 5 preguntas por instrumento, escalas Likert 1–5 legibles (carga percibida, ajuste al tiempo, utilidad sin presión extra) y comentario opcional.
   - Envío idempotente mediante `clientEventId` y emisión de `survey.submitted.v1` sin PII.
3. **Modo recuperación sin castigo (`STU-15`):**
   - Disponible cuando el estudiante reporta una semana exigente o presenta señal `recovery_suggested`.
   - Opciones de retomada: microacción de 5 minutos (`MICRO_MISSION_5M`), reorganizar una prioridad (`REORGANIZE_PRIORITY`), consultar un recurso de apoyo (`CONSULT_RESOURCE`), pedir acompañamiento (`REQUEST_SUPPORT`) o dejarlo para otro momento (`LATER`).
   - Activar modo recuperación nunca resta nivel ni logros personales y emite `recovery.activated.v1`.

