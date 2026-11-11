# Bitácora de Implementación por Sprints — Tesis Vivu

**Propósito:** Registrar sistemáticamente la evidencia técnica, decisiones arquitectónicas, pruebas y resultados de cada sprint para alimentar directamente el capítulo de diseño, implementación y validación técnica del documento de tesis.

> **Regla operativa:** Al cerrar cada sprint (antes o inmediatamente después del merge del PR a `main`), se debe diligenciar la ficha correspondiente en esta bitácora y actualizar `VIVU_CONTEXT_HANDOFF.md`.

---

## Resumen de Sprints

| Sprint | Nombre | Estado | Rama | PR | Fecha cierre |
|---:|---|---|---|---|---|
| 0 | Fundación técnica | Completado | `chore/sprint-0-foundation` | [#1](https://github.com/HinaraSM12/vivu/pull/1) | 2026-08-19 / Merge inicial |
| 1 | Identidad y acceso | Completado | `feat/sprint-1-identity-access` | [#21](https://github.com/HinaraSM12/vivu/pull/21) | 2026-11-10 |
| 2 | Consentimiento, onboarding y perfil | Completado | `feat/sprint-2-consent-onboarding-profile` | [#22](https://github.com/HinaraSM12/vivu/pull/22) | 2026-11-11 |
| 3 | Misiones, ludificación y progreso | Implementado (en revisión PR) | `feat/sprint-3-missions-gamification` | PR Sprint 3 | 2026-11-11 |
| 4 | Recursos, microcuestionarios y recuperación | Pendiente | `feat/sprint-4-resources-surveys-recovery` | — | — |
| 5 | Recomendador V1 online | Pendiente | `feat/sprint-5-recommender-v1-online` | — | — |
| 6 | PWA local-first y sincronización offline | Pendiente | `feat/sprint-6-pwa-offline-sync` | — | — |
| 7 | Facilitador | Pendiente | `feat/sprint-7-facilitator-support` | — | — |
| 8 | Administración | Pendiente | `feat/sprint-8-admin-operations` | — | — |
| 9 | Analítica y preparación del piloto | Pendiente | `feat/sprint-9-analytics-pilot-readiness` | — | — |

---

## Sprint 0 — Fundación técnica

- **Fecha:** 2026-08-19 (alineación documental y gobernanza actualizada el 2026-11-08)
- **Rama:** `chore/sprint-0-foundation`
- **Pull Request:** PR #1 (`Merge pull request #1 from HinaraSM12/chore/sprint-0-foundation`, commit `20a7e29`)
- **Objetivo del Sprint:** Establecer la arquitectura base de microservicios, el monorepo con `npm Workspaces`, el servicio Python de recomendación, la infraestructura local reproducible con Docker Compose (PostgreSQL + RabbitMQ), los contratos iniciales y el pipeline de integración continua (CI).
- **Historias / Entregables implementados:**
  - `PB-001`: Configuración del monorepo con `npm Workspaces` (`apps/web`, `apps/api-gateway`, 7 servicios NestJS en `services/*`, paquetes compartidos en `packages/*`).
  - `PB-002`: Infraestructura local con `docker-compose.yml` para PostgreSQL 17 (con inicialización separada por servicio) y RabbitMQ 4.
  - `PB-003`: Construcción de `api-gateway` (NestJS) con endpoints de salud (`/health`, `/health/ready`), propagación de `x-correlation-id` y documentación OpenAPI inicial.
  - `PB-004`: Pipeline de GitHub Actions (`.github/workflows/ci.yml`) con tres jobs: `Calidad Node y TypeScript`, `Calidad Python` y `Contrato de Docker Compose`.
  - `PB-027` (base): Definición del contrato `EventEnvelope` en `@vivu/contracts` con soporte para trazabilidad online y offline (`clientEventId`, `clientOccurredAt`, `connectivityMode`).
  - `PB-042` (base): Fronteras iniciales en `@vivu/web` preparadas para evolución a PWA local-first.
- **Evidencias de pruebas y calidad:**
  - `npm run lint` (`lint:node` + `lint:python` con Ruff): Verde.
  - `npm run typecheck` (`typecheck:node` + `typecheck:python` con Mypy): Verde.
  - `npm run test` (`test:node` con Vitest/Jest + `test:python` con Pytest): Verde.
  - `npm run build`: Verde.
  - `docker compose config --quiet`: Verde.
- **Problemas encontrados y solución:**
  - *Problema:* Directorios temporales de validación local y artefactos de caché podían ensuciar el árbol de Git.  
    *Solución:* Se ajustó `.gitignore` (commit `7fa71de`) y se documentó el entorno reproducible en `README.md`.
  - *Problema:* Desfase documental entre el roadmap inicial de 6 sprints en `docs/00-master-spec.md` y el roadmap detallado de 9 sprints en `VIVU_CONTEXT_HANDOFF.md` / `docs/roadmap/vivu-sprint-roadmap.md`.  
    *Solución:* Se unificó toda la documentación maestra al roadmap de 9 sprints y se añadieron plantillas de gobernanza (`.github/dependabot.yml`, PR/Issue templates), especificación de seeds sintéticos (`docs/architecture/seed-data-spec.md`) e instrumentos del piloto (`docs/research/instrumentos-piloto.md`).
- **Decisiones arquitectónicas / ADR:**
  - `ADR-001`: Microservicios por dominio desde V1 con API Gateway único.
  - `ADR-002`: Node.js + NestJS para servicios transaccionales de dominio y Python + FastAPI para `recommendation-service`.
  - `ADR-003`: RabbitMQ como broker de eventos asíncronos con envelope versionado.
  - `ADR-004`: Propiedad estricta de datos por servicio en PostgreSQL (sin joins entre dominios).
  - `ADR-005`: Estrategia PWA local-first con IndexedDB, Outbox, idempotencia y recomendador determinístico offline en TypeScript.
- **Resultado:** Sprint 0 completado satisfactoriamente. Base técnica estable y verificada en CI para iniciar el desarrollo funcional en Sprint 1.

---

## Sprint 1 — Identidad y acceso

- **Fecha:** 2026-11-09
- **Rama:** `feat/sprint-1-identity-access`
- **Issue relacionado:** [#2](https://github.com/HinaraSM12/vivu/issues/2)
- **Objetivo del Sprint:** Implementar autenticación, gestión de sesiones con JWT y refresh token rotativo, control de acceso basado en roles (`STUDENT`, `FACILITATOR`, `ADMIN`), autoregistro exclusivo para `STUDENT`, protección de rutas en `api-gateway` y `web`, y preparación de estado de sesión para futura operación offline.
- **Historias implementadas:**
  - `PB-005`: Usuarios, login, emisión de JWT HS256 (`sub`, `roles`, `iss`, `aud`, `iat`, `exp`, `jti`) y refresh token rotativo con revocación de familia ante intento de reutilización.
  - `PB-006`: Roles `STUDENT`, `FACILITATOR` y `ADMIN` con guards `JwtAuthGuard` y `RolesGuard` en `api-gateway` y pruebas allow/deny E2E.
  - `PB-027` (evento de identidad): Emisión de `user.registered.v1` con `schemaVersion: 1` y payload `{ userRole: 'STUDENT' }` sin PII.
  - `PB-042` (frontera de sesión PWA): `SessionSnapshotStore` en `@vivu/web` con ventana de acceso offline (`offlineAccessWindowSeconds`) para `STUDENT` sin almacenar Bearer tokens en `localStorage`.
  - Pantallas `STU-01` (Login), `STU-02` (Registro exclusivo `STUDENT` sin selector de rol), shells iniciales por rol y vista `403 Acceso no autorizado`.
- **Evidencias de pruebas y calidad:**
  - `@vivu/contracts`: pruebas de roles permitidos y derivación de capacidades online/offline.
  - `@vivu/identity-service`: 7 pruebas unitarias en `auth.service.spec.ts` (registro `STUDENT`, bloqueo de inyección de rol, colisión de email, login por rol con seeds, rechazo de cuenta deshabilitada, rotación y revocación de familia de refresh tokens, logout).
  - `@vivu/api-gateway`: pruebas E2E en `test/auth-rbac.e2e-spec.ts` verificando registro, login, `/api/v1/me`, matriz allow/deny `403 FORBIDDEN_ROLE` entre `STUDENT`, `FACILITATOR` y `ADMIN`, y rotación/revocación de refresh tokens.
  - `@vivu/web`: 4 pruebas de integración UI con Testing Library en `App.test.tsx` (Login, Registro de `STUDENT`, bloqueo `403` al intentar acceder a ruta `ADMIN`, cambio de rol y Logout).
- **Problemas encontrados y solución:**
  - *Problema:* El Git Credential Manager de Windows bloqueaba operaciones `git push` no interactivas.  
    *Solución:* Se utilizó el token de sesión de GitHub CLI (`gh auth token`) por cabecera HTTP sin depender del prompt interactivo del sistema.
- **Decisiones arquitectónicas / ADR:**
  - Cumplimiento estricto de `ADR-001` (frontera en `api-gateway`), `ADR-004` (aislamiento de datos en `identity-service`) y `ADR-005` (no persistir Bearer tokens en `localStorage`, preparando `OfflineSessionSnapshot` únicamente para `STUDENT`).
- **Resultado:** Sprint 1 implementado con todas las pruebas unitarias, de integración y E2E en verde.

---

## Sprint 2 — Consentimiento, onboarding y perfil

- **Fecha:** 2026-11-10
- **Rama:** `feat/sprint-2-consent-onboarding-profile`
- **Issue relacionado:** [#3](https://github.com/HinaraSM12/vivu/issues/3)
- **Objetivo del Sprint:** Implementar consentimiento informado versionado (`1.0`), flujo de retiro voluntario, wizard de onboarding paso a paso (`STU-03` a `STU-08`), perfil actualizable del estudiante en `student-service` (`STU-19`, `STU-20`) y emisión de eventos `consent.updated.v1` y `student.profile_updated.v1` con seudonimización.
- **Historias implementadas:**
  - `PB-007`: Consentimiento informado versionado (`consentVersion: "1.0"`); bloqueo `403 CONSENT_REQUIRED` si se intenta guardar perfil o preferencias sin consentimiento activo.
  - `PB-008`: Onboarding en 5 pasos y perfil básico editable del estudiante con validación de minimización de datos (rechazo `400 UNSUPPORTED_SENSITIVE_FIELD` ante `gpa`, `grades`, `academicHistory`, `clinicalDiagnosis`).
  - `PB-031`: Retiro voluntario del consentimiento (`POST /api/v1/me/consent/withdraw`), deteniendo personalización futura y limpiando `wellbeingInputs` opcionales.
  - `PB-027` (eventos de estudiante): Emisión de `consent.updated.v1` y `student.profile_updated.v1` utilizando `analyticsSubjectId` seudónimo como `subjectId` y `changedFieldCodes` sin PII.
- **Evidencias de pruebas y calidad:**
  - `@vivu/contracts`: pruebas de estados de consentimiento y detector de campos sensibles prohibidos (`student-contracts.spec.ts`).
  - `@vivu/student-service`: 4 pruebas unitarias en `student-context.service.spec.ts` (bloqueo sin consentimiento, aceptación + onboarding + eventos seudónimos, rechazo de calificaciones, retiro voluntario).
  - `@vivu/api-gateway`: pruebas E2E en `test/student-context.e2e-spec.ts` cubriendo el ciclo completo de consentimiento, onboarding, rechazo de `gpa`, retiro de consentimiento y bloqueo RBAC `403` para roles no `STUDENT`.
  - `@vivu/web`: pruebas de integración UI en `App.test.tsx` verificando el flujo `Registro -> Consentimiento (STU-03) -> Wizard de 5 pasos (STU-04..08) -> Inicio`, edición de perfil (`STU-19`) y retiro de consentimiento (`STU-20`).
- **Problemas encontrados y solución:**
  - Ningún incidente bloqueante; integración limpia con los guards RBAC del Sprint 1.
- **Decisiones arquitectónicas / ADR:**
  - Separación estricta entre `studentId` (identidad) y `analyticsSubjectId` (seudónimo de analítica) dentro de `student-service` conforme a `docs/security/privacy-and-consent.md` y `ADR-004`.
- **Resultado:** Sprint 2 implementado con todas las puertas de calidad en verde.

---

## Actualización Integral — Alineación Tesis V7 (PRISMA V5) y Arquitectura Vivu (45 Requerimientos)

- **Fecha:** 2026-11-10
- **Rama:** `feat/sprint-2-consent-onboarding-profile`
- **Objetivo:** Alinear integralmente el documento maestro de tesis (`PROYECTO_DE_TESIS_HINARA_SANCHEZ (6).docx`) con la versión definitiva de la revisión sistemática (`Articulo_Revision_Sistematica_PRISMA_v5_FINAL.docx`) y reflejar los 45 lineamientos conceptuales, metodológicos, arquitectónicos y de gobernanza tanto en el documento `.docx` como en las especificaciones y contratos del monorepo Vivu.
- **Entregables implementados:**
  1. **Actualización del documento Word de Tesis y figuras PRISMA V5:**
     - Actualización in-place de `PROYECTO_DE_TESIS_HINARA_SANCHEZ (6).docx`, generación de `PROYECTO_DE_TESIS_HINARA_SANCHEZ_v7_ACTUALIZADO.docx` y espejo Markdown en `docs/thesis/proyecto-tesis-actualizado-v7.md`.
     - Reemplazo de cifras antiguas por PRISMA V5 (Scopus, IEEE Xplore, ERIC; 2014–2026; 6.573 identificados; 1.240 duplicados; 5.333 únicos; 249 buscados; 72 recuperados; 63 evaluados humanamente; **57 estudios empíricos primarios**) y actualización de las 6 figuras PNG embebidas en el `.docx`.
     - Precisión conceptual: *sistema de ludificación adaptativa asistido por un modelo de lenguaje de gran escala* (LLM como componente instrumental ≠ ML predictivo de deserción).
  2. **Arquitectura de ingesta multifuente, moderación, recomendador híbrido y gobernanza (`docs/`):**
     - `docs/adr/006-multi-source-resource-ingestion-and-moderation.md`: conectores `InstitutionalWebCollector` (whitelist), `InstitutionalMailConnector` (API/IMAP con sanitización PII obligatoria antes del LLM) y carga manual por `PROFESSOR` (`RESOURCE_CONTRIBUTOR`) y `ADMIN`; ciclo de vida `DRAFT` -> `PUBLISHED`; entidad `Resource` de 26 campos; `resource_versions`; deduplicación y jerarquía de prioridad de fuentes.
     - `docs/security/data-governance-matrix.md`: matriz de gobernanza de datos de 11 columnas y listado de datos prohibidos por defecto.
     - Actualización de `docs/ai/llm-policy.md`, `docs/ai/recommender-v1.md`, `docs/ai/evaluation.md` (KPIs de uso/continuidad, recomendación, QoE ISO 9241-11/210, QoS y calidad del componente LLM), `docs/testing/analytics-events.md` (16 eventos canónicos seudonimizados) y `docs/research/instrumentos-piloto.md` (dimensión de valor percibido de la universidad y constructos no clínicos).
  3. **Contratos y código del prototipo (`packages/`, `services/`, `apps/`):**
     - `@vivu/contracts`: `resource-contracts.ts` + `resource-contracts.spec.ts` (modelos de recursos, versiones, extracción LLM, trazabilidad de recomendaciones, telemetría, guardia `canRecommendInstitutionalResource` y sanitizador `sanitizeEmailContentBeforeLlm`); adición de rol `PROFESSOR` en `auth-contracts.ts`; adición de `organizationDifficulty` no clínico en `student-contracts.ts`.
     - Actualización sincronizada en `@vivu/identity-service`, `@vivu/student-service`, `@vivu/api-gateway` y `@vivu/web`.

---

## Sprint 3 — Misiones, ludificación y progreso

- **Fecha:** 2026-11-11
- **Rama:** `feat/sprint-3-missions-gamification`
- **Issue relacionado:** [#4](https://github.com/HinaraSM12/vivu/issues/4)
- **Objetivo del Sprint:** Implementar el motor de ludificación no competitiva y gestión de misiones en `@vivu/gamification-service`, su exposición segura en `@vivu/api-gateway` y las vistas del estudiante (`STU-09` a `STU-14`) en `@vivu/web`.
- **Historias implementadas:**
  - `PB-009`: Catálogo oficial de 7 misiones (`MIS-PLAN-01` a `MIS-REC-01`) con versión, duración, esfuerzo, pasos mínimos y recurso institucional relacionado.
  - `PB-010`: Ciclo de vida completo de misión (`available`, `accepted`, `in_progress`, `paused`, `skipped`, `completed`) con pausa y posposición sin castigo e idempotencia mediante `clientEventId` / `Idempotency-Key`.
  - `PB-011`: Cálculo determinístico de niveles personales (`1: Exploración`, `2: Constancia inicial`, `3: Ritmo autónomo`, `4: Autorregulación consolidada`), señal de continuidad semanal flexible y desbloqueo de logros personales no competitivos (`ACH-FIRST-STEP`, `ACH-INITIAL-CONSISTENCY`, `ACH-BALANCED-EXPLORER`).
  - `PB-012` / `PB-027`: Emisión de eventos `mission.accepted.v1`, `mission.completed.v1` y `mission.skipped.v1` con `subjectId` seudónimo (`analyticsSubjectId`).
  - Pantallas `STU-09` (Inicio semanal), `STU-10` (Misiones y filtros), `STU-11` (Detalle de misión), `STU-12` (Misión en progreso), `STU-13` (Feedback positivo al completar) y `STU-14` (Progreso personal).
- **Evidencias de pruebas y calidad:**
  - `@vivu/contracts`: pruebas de niveles personales y detector de campos competitivos prohibidos (`gamification-contracts.spec.ts`).
  - `@vivu/gamification-service`: 4 pruebas unitarias en `gamification.service.spec.ts` (catálogo de 7 misiones, subida de Nivel 1 a Nivel 2 al completar la 3.ª misión + logro + evento seudónimo, idempotencia por `clientEventId`, pausa y posposición sin penalización).
  - `@vivu/api-gateway`: pruebas E2E en `test/gamification.e2e-spec.ts` cubriendo flujo completo de `STUDENT` y restricción RBAC `403` para mutaciones por roles no `STUDENT`.
  - `@vivu/web`: prueba de integración UI en `App.test.tsx` recorriendo `STU-09 -> STU-10 -> STU-11 -> STU-13 -> STU-14`.
- **Decisiones arquitectónicas / ADR:**
  - Cumplimiento de `ADR-001` (reglas de ludificación en backend bajo `ruleVersion: "1.0.0"`), `ADR-003` (eventos versionados seudonimizados) y `ADR-005` (idempotencia por `clientEventId` lista para sincronización offline en Sprint 6).
- **Resultado:** Sprint 3 implementado con todas las puertas de calidad en verde.

---

## Sprints 4 a 9 *(Se completarán iterativamente siguiendo la misma estructura)*

