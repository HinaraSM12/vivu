# Bitácora de Implementación por Sprints — Tesis Vivu

**Propósito:** Registrar sistemáticamente la evidencia técnica, decisiones arquitectónicas, pruebas y resultados de cada sprint para alimentar directamente el capítulo de diseño, implementación y validación técnica del documento de tesis.

> **Regla operativa:** Al cerrar cada sprint (antes o inmediatamente después del merge del PR a `main`), se debe diligenciar la ficha correspondiente en esta bitácora y actualizar `VIVU_CONTEXT_HANDOFF.md`.

---

## Resumen de Sprints

| Sprint | Nombre | Estado | Rama | PR | Fecha cierre |
|---:|---|---|---|---|---|
| 0 | Fundación técnica | Completado | `chore/sprint-0-foundation` | [#1](https://github.com/HinaraSM12/vivu/pull/1) | 2026-08-19 / Merge inicial |
| 1 | Identidad y acceso | Implementado (en revisión PR) | `feat/sprint-1-identity-access` | PR Sprint 1 | 2026-11-09 |
| 2 | Consentimiento, onboarding y perfil | Pendiente | `feat/sprint-2-consent-onboarding-profile` | — | — |
| 3 | Misiones, ludificación y progreso | Pendiente | `feat/sprint-3-missions-gamification` | — | — |
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

## Sprint 2 — Consentimiento, onboarding y perfil *(Plantilla)*

- **Fecha:** Pendiente
- **Rama:** `feat/sprint-2-consent-onboarding-profile`
- **Pull Request:** Pendiente
- **Objetivo del Sprint:** Implementar consentimiento informado versionado, flujo de retiro, wizard de onboarding paso a paso, perfil actualizable del estudiante en `student-service` y emisión de eventos correspondientes.
- **Historias implementadas:** (`PB-007`, `PB-008`, `PB-031`, ...)
- **Evidencias de pruebas y calidad:** Pendiente
- **Problemas encontrados y solución:** Pendiente
- **Decisiones arquitectónicas / ADR:** Pendiente
- **Resultado:** Pendiente

---

## Sprints 3 a 9 *(Se completarán iterativamente siguiendo la misma estructura)*

