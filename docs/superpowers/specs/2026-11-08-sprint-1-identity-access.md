# Especificación Técnica — Sprint 1: Identidad y Acceso

**Fecha:** 2026-11-08  
**Sprint:** 1  
**Rama objetivo:** `feat/sprint-1-identity-access`  
**Issue relacionado:** #2 (`[Sprint 1] Identidad y acceso`)  
**Servicios involucrados:** `packages/contracts`, `services/identity-service`, `apps/api-gateway`, `apps/web`

---

## 1. Objetivo del Sprint

Implementar el subsistema completo de identidad, autenticación, sesiones con rotación de refresh tokens, control de acceso basado en roles (`STUDENT`, `FACILITATOR`, `ADMIN`) y pantallas iniciales de acceso/shells por rol en `@vivu/web`, manteniendo fronteras preparadas para la operación offline futura de `STUDENT` definida en `ADR-005`.

---

## 2. Reglas de Dominio e Invariantes Obligatorias

1. **Roles únicos permitidos:** `STUDENT`, `FACILITATOR`, `ADMIN`. No existe `RESEARCHER`.
2. **Autoregistro exclusivo para `STUDENT`:**
   - El endpoint público `POST /api/v1/auth/register` crea cuentas únicamente con rol `STUDENT`.
   - Cualquier intento de enviar `role` o `roles` distintos en el registro es rechazado o ignorado explícitamente; el usuario nunca elige su rol al registrarse.
   - Las cuentas `ADMIN` y `FACILITATOR` se inicializan mediante seed seguro de entorno local/piloto (y en Sprint 8 mediante administración autenticada por `ADMIN`).
3. **Almacenamiento seguro de contraseñas:**
   - Hash con algoritmo resistente (Argon2id o `scrypt` con sal criptográfica aleatoria y parámetros seguros). Nunca almacenar contraseñas en texto plano ni exponer `passwordHash` en DTOs, respuestas o eventos.
4. **Tokens y Sesiones:**
   - Access Token JWT de corta duración con claims mínimos: `sub` (UUID del usuario), `roles` (`RoleCode[]`), `iss`, `aud`, `iat`, `exp`, `jti`.
   - Refresh Token opaco/firmado vinculado a `refresh_sessions` (`id`, `userId`, `tokenHash`, `expiresAt`, `revokedAt`, `rotatedFromId`).
   - Rotación estricta en `POST /api/v1/auth/refresh`: invalida el refresh token anterior y emite un nuevo par (`accessToken`, `refreshToken`). Si se detecta reutilización de un token ya rotado, revoca las sesiones activas del usuario.
   - Usuarios con `status !== 'active'` (`disabled` o `locked`) no pueden iniciar sesión ni refrescar tokens (`403 USER_DISABLED`).
5. **Autorización en Capas (RBAC):**
   - `api-gateway` valida el JWT Bearer, adjunta el contexto autenticado (`userId`, `roles`, `correlationId`) y protege las rutas por rol con guards (`JwtAuthGuard`, `RolesGuard`).
   - El `subjectId` de las rutas `/api/v1/me/*` se deriva exclusivamente del `sub` del token verificado, nunca de parámetros enviados por el cliente.
6. **Eventos de Dominio:**
   - Al registrar un usuario se construye un evento `user.registered.v1` usando `EventEnvelope` de `@vivu/contracts` con payload `{ userRole: 'STUDENT' }` (sin email ni credenciales).
7. **Preparación para Sesión Offline Futura (PWA-ready):**
   - No almacenar Bearer tokens en `localStorage` en producción; mantener el token de acceso en memoria del cliente de sesión y exponer un contrato `SessionSnapshot` (`userId`, `roles`, `lastValidatedOnlineAt`, `offlineAccessExpiresAt`) en `apps/web/src/local-data` para que el Sprint 6 (PWA) habilite apertura offline dentro de la ventana autorizada sin acoplar los componentes React.

---

## 3. Contratos HTTP (`/api/v1`)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Público | Registra cuenta `STUDENT`, crea sesión inicial y devuelve tokens + perfil de sesión. |
| `POST` | `/api/v1/auth/login` | Público | Autentica email/contraseña y devuelve tokens + perfil de sesión. |
| `POST` | `/api/v1/auth/refresh` | Público (con refresh token) | Rota el refresh token y emite nuevo par de tokens. |
| `POST` | `/api/v1/auth/logout` | Autenticado | Revoca la sesión de refresh actual. |
| `GET` | `/api/v1/me` | Autenticado (`STUDENT`, `FACILITATOR`, `ADMIN`) | Devuelve identidad de sesión (`userId`, `email`, `roles`, `status`, `capabilities`). |
| `GET` | `/api/v1/admin/ping` (o ruta protegida por rol) | `ADMIN` | Verificación de guard RBAC para `ADMIN` (`403` para `STUDENT` y `FACILITATOR`). |
| `GET` | `/api/v1/facilitator/ping` (o ruta protegida por rol) | `FACILITATOR`, `ADMIN` | Verificación de guard RBAC para `FACILITATOR` (`403` para `STUDENT`). |

---

## 4. Pantallas y Flujos Frontend (`@vivu/web`)

Alineado con `docs/ux/mockup-guide.md` (`STU-01`, `STU-02`, shells por rol):

1. **Login (`STU-01`):**
   - Email, contraseña, botón mostrar/ocultar contraseña, CTA `"Entrar"`, enlace a `"Crear cuenta"`, manejo accesible de errores (`INVALID_CREDENTIALS`, `USER_DISABLED`, sin conexión) y copy *"Vuelve a tus próximos pasos."*
2. **Registro (`STU-02`):**
   - Exclusivo para `STUDENT` (sin selector de rol): email, contraseña, confirmación de contraseña, validación de requisitos mínimos y CTA `"Crear cuenta"`.
3. **Protección de rutas y Shells iniciales por rol:**
   - Redirección automática según rol autenticado:
     - `STUDENT` -> Shell móvil-primero con navegación inferior (`Inicio`, `Misiones`, `Progreso`, `Recursos`, `Perfil`).
     - `FACILITATOR` -> Shell desktop con barra lateral (`Resumen`, `Estudiantes asignados`, `Seguimientos`, `Recursos`, `Perfil`).
     - `ADMIN` -> Shell desktop con barra lateral (`Resumen`, `Usuarios y asignaciones`, `Misiones`, `Recursos`, `Reglas de ludificación`, `Recomendaciones / IA`, `Microcuestionarios`, `Analítica`, `Exportaciones`).
   - Vista de **Acceso no autorizado (`403`)** cuando un rol intenta abrir una vista que no le corresponde, con acción clara para volver a su inicio y botón de cerrar sesión (`Logout`).

---

## 5. Criterios de Aceptación y Pruebas

- [ ] Registro público asigna siempre `STUDENT` e impide escalamiento de privilegios.
- [ ] Login con credenciales válidas para `STUDENT`, `FACILITATOR` y `ADMIN` (usuarios seed de `docs/architecture/seed-data-spec.md`).
- [ ] Login con credenciales inválidas devuelve `401 INVALID_CREDENTIALS` con formato estándar de error (`code`, `message`, `correlationId`, `details`).
- [ ] Rotación de refresh token funciona y el reuso de un token ya rotado es rechazado (`401`) y revoca la familia de sesión.
- [ ] Pruebas de autorización allow/deny en `api-gateway` verifican que `STUDENT` recibe `403` en rutas de `FACILITATOR` y `ADMIN`, y `FACILITATOR` recibe `403` en rutas exclusivas de `ADMIN`.
- [ ] Pruebas de UI en `@vivu/web` verifican Login, Registro, transición al shell del rol correspondiente, bloqueo de vista no autorizada y Logout.
- [ ] `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build` pasan en verde.

