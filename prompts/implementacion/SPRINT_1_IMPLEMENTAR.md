# Prompt de Implementación — Sprint 1: Identidad y Acceso

## Contexto obligatorio
1. Leer `VIVU_CONTEXT_HANDOFF.md`, `docs/00-master-spec.md`, `docs/security/access-control.md` y `docs/ux/mockup-guide.md`.
2. Leer la especificación `docs/superpowers/specs/2026-11-08-sprint-1-identity-access.md` y el plan `docs/superpowers/plans/2026-11-08-sprint-1-identity-access.md`.
3. Trabajar sobre una rama dedicada creada desde `main` actualizado: `feat/sprint-1-identity-access`.

## Alcance a implementar en Sprint 1
- Contratos de autenticación y RBAC en `@vivu/contracts` (`STUDENT`, `FACILITATOR`, `ADMIN`).
- Registro exclusivo para `STUDENT` (`POST /api/v1/auth/register`), login (`POST /api/v1/auth/login`), rotación de refresh tokens (`POST /api/v1/auth/refresh`), logout (`POST /api/v1/auth/logout`) y consulta de sesión (`GET /api/v1/me`).
- Seeds de usuarios sintéticos de prueba definidos en `docs/architecture/seed-data-spec.md`.
- Protección RBAC en `api-gateway` (`JwtAuthGuard`, `RolesGuard`) con validación de casos positivos y negativos (`401`, `403`).
- Pantallas `STU-01` (Login), `STU-02` (Registro sin selector de rol), shells iniciales por rol (`STUDENT`, `FACILITATOR`, `ADMIN`), vista de acceso no autorizado y preparación de snapshot de sesión para futura operación offline.

## Restricciones invariables
- Código e identificadores en inglés; mensajes de usuario, documentación, commits y PR en español.
- No introducir `RESEARCHER`.
- No permitir que el autoregistro asigne `FACILITATOR` ni `ADMIN`.
- No persistir tokens Bearer crudos en `localStorage`.
- Al finalizar: pasar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build`, actualizar `VIVU_CONTEXT_HANDOFF.md` y registrar el sprint en `docs/thesis/bitacora-sprints.md`.
