# Sprint 1 Identity & Access Implementation Plan

**Goal:** Implementar autenticación completa (registro exclusivo `STUDENT`, login, refresh rotativo, logout), RBAC (`STUDENT`, `FACILITATOR`, `ADMIN`) en `identity-service` y `api-gateway`, seeds iniciales de usuarios y pantallas de Login, Registro y Shells protegidos por rol en `apps/web`.

**Spec:** `docs/superpowers/specs/2026-11-08-sprint-1-identity-access.md`

---

## Mapa de Archivos del Sprint 1

```text
packages/contracts/src/auth/auth-contracts.ts
packages/contracts/src/auth/auth-contracts.spec.ts
packages/contracts/src/index.ts
services/identity-service/src/domain/user.entity.ts
services/identity-service/src/domain/password-hasher.ts
services/identity-service/src/domain/token.service.ts
services/identity-service/src/application/auth.service.ts
services/identity-service/src/application/auth.service.spec.ts
services/identity-service/src/presentation/auth.controller.ts
services/identity-service/test/auth.e2e-spec.ts
apps/api-gateway/src/auth/jwt-auth.guard.ts
apps/api-gateway/src/auth/roles.guard.ts
apps/api-gateway/src/auth/auth-gateway.controller.ts
apps/api-gateway/test/auth-rbac.e2e-spec.ts
apps/web/src/features/auth/auth-client.ts
apps/web/src/features/auth/AuthContext.tsx
apps/web/src/features/auth/LoginView.tsx
apps/web/src/features/auth/RegisterView.tsx
apps/web/src/features/auth/RoleShell.tsx
apps/web/src/app/App.tsx
apps/web/src/app/App.test.tsx
```

---

## Tareas Secuenciales

### Task 1: Contratos compartidos de Autenticación y RBAC en `@vivu/contracts`
- [ ] Definir `RoleCode` (`'STUDENT' | 'FACILITATOR' | 'ADMIN'`), `AccountStatus` (`'active' | 'disabled' | 'locked'`), `JwtAccessClaims`, `AuthSessionResponse`, `SessionUserDto` y `OfflineSessionSnapshot` en `packages/contracts/src/auth/auth-contracts.ts`.
- [ ] Exportar los contratos desde `packages/contracts/src/index.ts`.
- [ ] Agregar pruebas unitarias en `packages/contracts/src/auth/auth-contracts.spec.ts`.

### Task 2: Dominio de Identidad, Hashing, Sesiones Rotativas y Seeds en `@vivu/identity-service`
- [ ] Implementar `PasswordHasher` con `crypto.scrypt` asíncrono y comparación en tiempo constante (`timingSafeEqual`).
- [ ] Implementar `TokenService` (emisión y verificación de JWT HS256 firmado + hash SHA-256 de refresh tokens).
- [ ] Implementar repositorio en memoria/PostgreSQL desacoplado con seed inicial de los usuarios sintéticos de `docs/architecture/seed-data-spec.md` (`admin.piloto@vivu.local`, `facilitador.ingenieria@vivu.local`, `facilitador.bienestar@vivu.local`, `est.activo@vivu.local`, `est.recuperacion@vivu.local`, `est.nuevo@vivu.local`).
- [ ] Implementar `AuthService`:
  - `registerStudent`: asigna siempre `STUDENT`, emite evento `user.registered.v1` y crea sesión.
  - `login`: verifica credenciales y estado `active`.
  - `refresh`: rota el refresh token y revoca la familia si detecta reuso de un token ya rotado.
  - `logout`: revoca la sesión actual.
  - `getMe`: retorna `SessionUserDto` con capacidades derivadas del rol.
- [ ] Cubrir con pruebas unitarias y E2E en `services/identity-service`.

### Task 3: Frontera de Autenticación y Autorización RBAC en `@vivu/api-gateway`
- [ ] Exponer rutas `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/logout`, `/api/v1/me` y endpoints protegidos por rol (`/api/v1/facilitator/access-check`, `/api/v1/admin/access-check`).
- [ ] Implementar `JwtAuthGuard` y `RolesGuard` con errores estandarizados (`401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`, `correlationId`).
- [ ] Agregar pruebas E2E en `apps/api-gateway/test/auth-rbac.e2e-spec.ts` cubriendo login, registro, rotación, token inválido/expirado y matriz allow/deny para `STUDENT`, `FACILITATOR` y `ADMIN`.

### Task 4: Flujos de Login, Registro, Shells por Rol y Preparación Offline en `@vivu/web`
- [ ] Implementar `auth-client.ts` y `session-storage.ts` (snapshot de sesión PWA-ready sin persistir Bearer token crudo en `localStorage`).
- [ ] Construir `LoginView` (`STU-01`) y `RegisterView` (`STU-02`, sin selector de rol) siguiendo los tokens y copy de `docs/ux/mockup-guide.md`.
- [ ] Construir `RoleShell` con navegación diferenciada para `STUDENT` (mobile-first bottom nav), `FACILITATOR` (sidebar de acompañamiento) y `ADMIN` (sidebar de operación), más vista `403 Acceso no autorizado` y botón `Cerrar sesión`.
- [ ] Agregar pruebas en `apps/web/src/app/App.test.tsx` para Login, Registro, redirección por rol, bloqueo de rol no autorizado y Logout.

### Task 5: Verificación Integral, Handoff y Bitácora
- [ ] Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build`.
- [ ] Actualizar `VIVU_CONTEXT_HANDOFF.md` y `docs/thesis/bitacora-sprints.md` con los resultados del Sprint 1.
