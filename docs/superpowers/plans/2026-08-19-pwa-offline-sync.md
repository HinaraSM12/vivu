# PWA Local-First Offline Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir `apps/web` en una PWA local-first donde STUDENT pueda operar los flujos esenciales sin conexión y sincronizar sin duplicados, manteniendo FACILITATOR como lectura cacheada limitada y ADMIN online para mutaciones.

**Architecture:** React/Vite mantiene una réplica mínima en IndexedDB y una outbox de comandos. El API Gateway coordina `sync/bootstrap`, `sync/pull` y `sync/actions`, pero cada microservicio dueño valida y aplica sus comandos de forma idempotente. El recomendador offline corre rules + scoring en TypeScript con la misma configuración versionada y fixtures que el motor Python; el LLM solo existe online.

**Tech Stack:** React, TypeScript, Vite, `vite-plugin-pwa`, `idb`, NestJS, Python/FastAPI, PostgreSQL, RabbitMQ, Vitest/Jest, Pytest, Playwright.

**Spec:** `docs/architecture/pwa-offline-sync.md`

## Global Constraints

- Microservicios desde V1.
- Frontend React + TypeScript + Vite.
- PWA local-first: STUDENT offline completo sobre datos sincronizados.
- FACILITATOR: cache de lectura limitado; sin notas/compromisos offline.
- ADMIN: mutaciones online obligatorias.
- IndexedDB para datos de dominio offline; Cache Storage solo para app shell/activos seguros.
- No persistir bearer tokens en `localStorage`.
- Primer login/bootstrap requiere conexión.
- Outbox con `clientEventId` estable e idempotencia end-to-end.
- No usar `last-write-wins` global.
- LLM solo online; no LLM local/WebGPU.
- Offline recommender = hard rules + scoring determinístico TypeScript + explicación determinística.
- Python y TypeScript consumen configuración versionada compatible y comparten fixtures de paridad.
- Background Sync puede ser mejora, nunca única garantía de sincronización.
- No crear `sync-service`; la coordinación vive en API Gateway y las reglas de dominio permanecen en sus servicios dueños.

---

## Mapa de archivos

```text
apps/web/
├── vite.config.ts
├── src/
│   ├── pwa/register-pwa.ts
│   ├── pwa/PwaUpdateBanner.tsx
│   ├── local-data/offline-db.ts
│   ├── local-data/schema.ts
│   ├── local-data/cache-repository.ts
│   ├── offline/connectivity/connectivity-store.ts
│   ├── offline/outbox/outbox-repository.ts
│   ├── offline/outbox/outbox-types.ts
│   ├── offline/sync/sync-client.ts
│   ├── offline/sync/sync-engine.ts
│   ├── offline/conflicts/conflict-repository.ts
│   ├── offline/conflicts/ProfileConflictDialog.tsx
│   └── recommendation-offline/
│       ├── score-candidate.ts
│       ├── recommend-offline.ts
│       └── recommend-offline.test.ts
apps/api-gateway/src/sync/
├── sync.controller.ts
├── sync.service.ts
├── sync.module.ts
└── sync.service.spec.ts
packages/contracts/src/sync/
├── sync-action.ts
├── sync-bootstrap.ts
└── sync-result.ts
packages/recommendation-fixtures/
├── package.json
└── fixtures/*.json
services/gamification-service/src/idempotency/
services/student-service/src/idempotency/
services/survey-service/src/idempotency/
services/recommendation-service/tests/test_shared_fixtures.py
e2e/pwa-offline.spec.ts
```

### Task 1: Convertir el shell web en PWA instalable

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/vite.config.ts`
- Create: `apps/web/src/pwa/register-pwa.ts`
- Create: `apps/web/src/pwa/PwaUpdateBanner.tsx`
- Test: `apps/web/src/pwa/PwaUpdateBanner.test.tsx`

**Interfaces:**
- Produces: manifest, service worker para app shell/assets, callback `onNeedRefresh`, callback `onOfflineReady`.
- Does not produce: cache de datos de dominio ni sync.

- [ ] **Step 1: Instalar tooling PWA**

Run:

```bash
npm install -w apps/web vite-plugin-pwa
```

Expected: `apps/web/package.json` y lockfile incluyen `vite-plugin-pwa`.

- [ ] **Step 2: Escribir test fallido del banner de actualización**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PwaUpdateBanner } from './PwaUpdateBanner';

describe('PwaUpdateBanner', () => {
  it('offers a non-blocking reload when a new version is ready', () => {
    render(<PwaUpdateBanner updateAvailable onReload={vi.fn()} />);
    expect(screen.getByText(/nueva versión disponible/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Ejecutar el test y comprobar fallo**

Run: `npm test -w apps/web -- PwaUpdateBanner.test.tsx`

Expected: FAIL porque el componente no existe.

- [ ] **Step 4: Implementar registro PWA y banner mínimo**

Configurar `VitePWA` con `registerType: 'prompt'`, manifest con `display: 'standalone'`, `start_url: '/'`, nombre de la aplicación e iconos propios del proyecto. El service worker precachea assets construidos y navegación del shell; no añadir runtime caching genérico de `/api/*`.

Implementar `register-pwa.ts` para exponer estado de `needRefresh`/`offlineReady` a la capa UI. Implementar `PwaUpdateBanner` con botón explícito de recarga.

- [ ] **Step 5: Verificar build e instalación del service worker**

Run:

```bash
npm test -w apps/web -- PwaUpdateBanner.test.tsx
npm run build -w apps/web
```

Expected: PASS y build genera manifest/service worker.

- [ ] **Step 6: Commit**

```bash
git add apps/web package-lock.json
git commit -m "feat(web): add installable pwa shell"
```

### Task 2: Crear esquema IndexedDB versionado

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/src/local-data/schema.ts`
- Create: `apps/web/src/local-data/offline-db.ts`
- Create: `apps/web/src/local-data/offline-db.test.ts`

**Interfaces:**
- Produces: `getOfflineDb(): Promise<IDBPDatabase<OfflineDbSchema>>`.
- Stores: `meta`, `studentProfile`, `missionCatalog`, `missionAssignments`, `progress`, `resources`, `surveys`, `recommendations`, `recommendationConfig`, `outbox`, `conflicts`.

- [ ] **Step 1: Instalar wrapper IndexedDB**

Run: `npm install -w apps/web idb`

Expected: dependency `idb` registrada.

- [ ] **Step 2: Definir tipos del schema**

`schema.ts` debe exportar tipos con `id`, `version`, `updatedAt` y datos mínimos. `outbox` usa `clientEventId` como key. `meta` almacena `syncCursor`, `lastSuccessfulSyncAt` y versiones de catálogo.

- [ ] **Step 3: Escribir test de creación de base**

Usar el entorno de test soportado por el proyecto para comprobar que `getOfflineDb()` crea todos los object stores esperados y que la versión inicial es `1`.

- [ ] **Step 4: Ejecutar y comprobar fallo**

Run: `npm test -w apps/web -- offline-db.test.ts`

Expected: FAIL porque `getOfflineDb` no existe.

- [ ] **Step 5: Implementar `offline-db.ts`**

Usar `openDB<OfflineDbSchema>('student-support-offline', 1, { upgrade(db) { ... } })`. Crear stores nombrados exactamente como los tipos del contrato. No introducir datos de demo durante upgrade.

- [ ] **Step 6: Ejecutar pruebas**

Run: `npm test -w apps/web -- offline-db.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/web package-lock.json
git commit -m "feat(web): add versioned offline database"
```

### Task 3: Definir contratos de sincronización compartidos

**Files:**
- Create: `packages/contracts/src/sync/sync-action.ts`
- Create: `packages/contracts/src/sync/sync-result.ts`
- Create: `packages/contracts/src/sync/sync-bootstrap.ts`
- Modify: `packages/contracts/src/index.ts`
- Test: `packages/contracts/src/sync/sync-action.spec.ts`

**Interfaces:**
- Produces: `SyncAction`, `SyncActionResult`, `SyncBootstrapResponse`, `SyncPullResponse`.

- [ ] **Step 1: Escribir test de contrato**

Verificar que un `SyncAction` válido contiene `clientEventId`, `actionType`, `aggregateId`, `clientOccurredAt` y `payload`, y que los resultados solo aceptan `applied|already_applied|conflict|rejected|retryable_error`.

- [ ] **Step 2: Ejecutar test y comprobar fallo**

Run: `npm test -w packages/contracts -- sync-action.spec.ts`

Expected: FAIL porque los contratos no existen.

- [ ] **Step 3: Implementar tipos y schemas**

Usar el mecanismo de validación ya adoptado por `packages/contracts`; no crear una segunda librería de schemas. `aggregateVersion` y `ruleVersion` son opcionales; `clientEventId` y `clientOccurredAt` son obligatorios.

- [ ] **Step 4: Ejecutar test + typecheck**

```bash
npm test -w packages/contracts -- sync-action.spec.ts
npm run typecheck -w packages/contracts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/contracts
git commit -m "feat(contracts): define offline sync contracts"
```

### Task 4: Implementar repositorio de outbox

**Files:**
- Create: `apps/web/src/offline/outbox/outbox-types.ts`
- Create: `apps/web/src/offline/outbox/outbox-repository.ts`
- Test: `apps/web/src/offline/outbox/outbox-repository.test.ts`

**Interfaces:**
- Produces:
  - `enqueueAction(input): Promise<OfflineAction>`
  - `listPendingActions(limit): Promise<OfflineAction[]>`
  - `markSyncing(clientEventId): Promise<void>`
  - `markApplied(clientEventId): Promise<void>`
  - `markConflict(clientEventId, detail): Promise<void>`
  - `markRejected(clientEventId, code): Promise<void>`

- [ ] **Step 1: Escribir tests de identidad estable**

Comprobar que `enqueueAction` genera UUID una sola vez y que leer/reintentar conserva el mismo `clientEventId`.

- [ ] **Step 2: Ejecutar y comprobar fallo**

Run: `npm test -w apps/web -- outbox-repository.test.ts`

Expected: FAIL.

- [ ] **Step 3: Implementar repositorio**

Persistir en el store `outbox`. Estados permitidos: `pending`, `syncing`, `applied`, `conflict`, `rejected`. Ante arranque de aplicación, cualquier item dejado en `syncing` por cierre abrupto vuelve a `pending` antes del siguiente replay.

- [ ] **Step 4: Ejecutar pruebas**

Run: `npm test -w apps/web -- outbox-repository.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/offline/outbox
git commit -m "feat(web): add durable offline outbox"
```

### Task 5: Crear endpoints `sync/bootstrap`, `sync/pull` y `sync/actions`

**Files:**
- Create: `apps/api-gateway/src/sync/sync.module.ts`
- Create: `apps/api-gateway/src/sync/sync.controller.ts`
- Create: `apps/api-gateway/src/sync/sync.service.ts`
- Test: `apps/api-gateway/src/sync/sync.service.spec.ts`
- Modify: `apps/api-gateway/src/app.module.ts`

**Interfaces:**
- Consumes: contratos Task 3.
- Produces: `/api/v1/sync/bootstrap`, `/api/v1/sync/pull`, `/api/v1/sync/actions`.

- [ ] **Step 1: Escribir test de dispatch**

Construir un `SyncAction` `mission.complete` y comprobar que `SyncService` lo delega al client de Gamification con `Idempotency-Key = clientEventId`, sin aplicar reglas de estado en el gateway.

- [ ] **Step 2: Ejecutar test y comprobar fallo**

Run: `npm test -w apps/api-gateway -- sync.service.spec.ts`

Expected: FAIL.

- [ ] **Step 3: Implementar tabla explícita de action handlers**

Mapear solo action types aprobados, por ejemplo `mission.accept`, `mission.postpone`, `mission.discard`, `mission.complete`, `profile.update`, `recovery.activate`, `survey.submit`. Un `actionType` desconocido retorna `rejected` con código estable; nunca ejecutar rutas construidas dinámicamente desde input.

- [ ] **Step 4: Implementar bootstrap/pull**

El gateway agrega únicamente datos necesarios del usuario actual desde Student, Gamification, Resources, Survey y configuración del recomendador. `pull` usa cursor opaco emitido por servidor; no acepta timestamps arbitrarios como autoridad de versión.

- [ ] **Step 5: Ejecutar tests**

```bash
npm test -w apps/api-gateway -- sync.service.spec.ts
npm run typecheck -w apps/api-gateway
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/api-gateway
git commit -m "feat(gateway): add offline sync coordinator"
```

### Task 6: Hacer comandos de misión idempotentes

**Files:**
- Create: `services/gamification-service/src/idempotency/idempotency-record.entity.ts`
- Create: `services/gamification-service/src/idempotency/idempotency.service.ts`
- Modify: handlers de `accept/postpone/discard/complete`
- Test: `services/gamification-service/src/missions/complete-mission.spec.ts`
- Create migration: tabla `idempotency_records`

**Interfaces:**
- Consumes: `Idempotency-Key` propagado desde gateway.
- Produces: mismo resultado lógico para reintento con la misma key.

- [ ] **Step 1: Escribir test de completar dos veces con misma key**

Primera llamada debe aplicar transición y progreso. Segunda llamada con la misma key debe retornar el recibo previo sin crear segundo historial/evento.

- [ ] **Step 2: Ejecutar test y comprobar fallo**

Run: `npm test -w services/gamification-service -- complete-mission.spec.ts`

Expected: FAIL porque el comando se aplica dos veces o no existe ledger.

- [ ] **Step 3: Implementar ledger idempotente transaccional**

Persistir `key`, `operation`, `subjectId`, `requestHash`, `resultJson`, `createdAt`. Si se reutiliza la key con payload diferente, rechazar con código `IDEMPOTENCY_KEY_REUSE_MISMATCH`.

- [ ] **Step 4: Ejecutar test**

Run: `npm test -w services/gamification-service -- complete-mission.spec.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add services/gamification-service
git commit -m "feat(gamification): make mission commands idempotent"
```

### Task 7: Implementar Sync Engine del cliente

**Files:**
- Create: `apps/web/src/offline/connectivity/connectivity-store.ts`
- Create: `apps/web/src/offline/sync/sync-client.ts`
- Create: `apps/web/src/offline/sync/sync-engine.ts`
- Test: `apps/web/src/offline/sync/sync-engine.test.ts`

**Interfaces:**
- Produces: `syncNow(): Promise<SyncSummary>` y estado observable `idle|syncing|offline|error`.

- [ ] **Step 1: Escribir test de replay**

Con dos acciones pendientes, mockear respuesta `applied`/`already_applied`; comprobar que ambas salen de pending y que el engine conserva sus IDs.

- [ ] **Step 2: Escribir test de fallo transitorio**

Simular `503`: la acción vuelve a `pending`, incrementa `retryCount` y no se marca como rechazada.

- [ ] **Step 3: Ejecutar tests y comprobar fallo**

Run: `npm test -w apps/web -- sync-engine.test.ts`

Expected: FAIL.

- [ ] **Step 4: Implementar motor**

Secuencia: verificar `navigator.onLine`; revalidar sesión mediante endpoint existente; leer lote pending; marcar syncing; enviar `/sync/actions`; persistir resultados; ejecutar `/sync/pull`; actualizar cursor/lastSuccessfulSyncAt. Añadir backoff con límite y reintento al evento `online` y al foreground de la app.

- [ ] **Step 5: Ejecutar tests**

Run: `npm test -w apps/web -- sync-engine.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/offline
git commit -m "feat(web): add offline synchronization engine"
```

### Task 8: Entregar el primer vertical de misión offline

**Files:**
- Modify: repositorio/feature de misiones en `apps/web/src/features/missions/`
- Test: tests de feature de misiones
- Test E2E later: `e2e/pwa-offline.spec.ts`

**Interfaces:**
- Online y offline usan la misma interfaz de application repository.
- Offline `complete` actualiza cache optimista y encola `mission.complete`.

- [ ] **Step 1: Escribir test de completar misión sin red**

Con connectivity false, ejecutar completar y comprobar: estado local `completed_pending_sync`, una sola acción outbox y ninguna llamada HTTP inmediata.

- [ ] **Step 2: Ejecutar y comprobar fallo**

Run: `npm test -w apps/web -- missions`

Expected: FAIL.

- [ ] **Step 3: Implementar repository local-first de misión**

La UI llama al application service, no a `fetch` directo. Si online puede mantener comportamiento optimista, pero toda ruta apta para offline genera el mismo `clientEventId` y actualiza el cache de manera consistente.

- [ ] **Step 4: Probar reconexión**

Simular retorno online y `syncNow`; comprobar que el estado cambia de `completed_pending_sync` a `completed` y se aplica `serverVersion`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/missions
git commit -m "feat(web): support offline mission completion"
```

### Task 9: Implementar conflictos de perfil

**Files:**
- Modify: `student-service` profile update para versionado
- Create: `apps/web/src/offline/conflicts/conflict-repository.ts`
- Create: `apps/web/src/offline/conflicts/ProfileConflictDialog.tsx`
- Tests: service + UI

**Interfaces:**
- `profile.update` incluye `aggregateVersion`/baseVersion.
- Server conflict retorna campos en conflicto y serverVersion, sin stack/internal data.

- [ ] **Step 1: Escribir test servidor**

Dos updates basados en versión 4 cambian el mismo campo. El primero produce versión 5; el segundo retorna `conflict`, no sobrescribe.

- [ ] **Step 2: Escribir test UI**

Con conflicto persistido, mostrar valor local y valor de servidor con acción explícita para elegir y reenviar.

- [ ] **Step 3: Implementar y ejecutar tests**

Run:

```bash
npm test -w services/student-service
npm test -w apps/web -- ProfileConflictDialog
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add services/student-service apps/web/src/offline/conflicts
git commit -m "feat(sync): add explicit profile conflict resolution"
```

### Task 10: Extender offline a recovery y surveys

**Files:**
- Modify: web recovery application service
- Modify: web survey application service
- Modify: `survey-service` idempotency/version validation
- Tests: recovery + survey sync tests

**Interfaces:**
- `recovery.activate` idempotente.
- `survey.submit` contiene `surveyVersion`, `clientOccurredAt`, `clientEventId`.

- [ ] **Step 1: Escribir test de survey offline**

Persistir respuesta offline, cerrar/reabrir DB y verificar que el payload conserva versión e instante original.

- [ ] **Step 2: Escribir test de ventana cerrada**

Servidor recibe respuesta cuya `clientOccurredAt` está fuera de la ventana permitida y retorna `rejected` con código estable; cliente conserva el resultado para informar al usuario, no reintenta infinitamente.

- [ ] **Step 3: Implementar y verificar**

Run:

```bash
npm test -w apps/web -- survey
npm test -w services/survey-service
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/web services/survey-service services/gamification-service
git commit -m "feat(sync): support offline recovery and surveys"
```

### Task 11: Implementar motor de recomendación offline y fixtures compartidos

**Files:**
- Create: `packages/recommendation-fixtures/package.json`
- Create: `packages/recommendation-fixtures/fixtures/recovery-low-time.json`
- Create: `packages/recommendation-fixtures/fixtures/inactive-resource.json`
- Create: `apps/web/src/recommendation-offline/score-candidate.ts`
- Create: `apps/web/src/recommendation-offline/recommend-offline.ts`
- Test: `apps/web/src/recommendation-offline/recommend-offline.test.ts`
- Test: `services/recommendation-service/tests/test_shared_fixtures.py`

**Interfaces:**
- TypeScript `recommendOffline(ctx, catalog, config): OfflineRecommendationResult`.
- Python test consumes the same JSON fixture files.

- [ ] **Step 1: Crear fixture canónico**

`recovery-low-time.json` debe contener contexto sintético, candidatos, config exacta y `expectedRanking`. No incluir datos reales.

- [ ] **Step 2: Escribir test TypeScript fallido**

Cargar fixture y verificar ranking y score components dentro de tolerancia `1e-9` para operaciones simples.

- [ ] **Step 3: Implementar score TypeScript**

Reproducir exactamente fórmula/config versionada; no usar LLM ni random. Rechazar config con `schemaVersion` desconocido.

- [ ] **Step 4: Escribir test Python sobre el mismo fixture**

Leer JSON desde `packages/recommendation-fixtures/fixtures` y comparar el motor Python con `expectedRanking`.

- [ ] **Step 5: Ejecutar ambos motores**

Run:

```bash
npm test -w apps/web -- recommend-offline.test.ts
cd services/recommendation-service && pytest tests/test_shared_fixtures.py -q
```

Expected: PASS en ambos.

- [ ] **Step 6: Verificar cero LLM offline**

Test TypeScript debe fallar si alguna dependencia de red/LLM es invocada; el motor recibe solo datos y config local.

- [ ] **Step 7: Commit**

```bash
git add packages/recommendation-fixtures apps/web/src/recommendation-offline services/recommendation-service/tests
git commit -m "feat(ai): add offline recommender parity fixtures"
```

### Task 12: Aplicar capacidades offline por rol

**Files:**
- Modify: auth/capability layer web
- Modify: facilitator screens
- Modify: admin mutation guards
- Tests: capability tests

**Interfaces:**
- Produce: `OfflineCapabilities` derivado de rol + conectividad.

- [ ] **Step 1: Escribir matriz de tests**

Comprobar:
- STUDENT offline: mission/profile/recovery/survey permitidos según cache.
- FACILITATOR offline: lectura cacheada permitida; nota/compromiso bloqueados.
- ADMIN offline: mutaciones bloqueadas con mensaje de conexión requerida.

- [ ] **Step 2: Implementar capability guard central**

No dispersar `navigator.onLine` por componentes. Toda UI consulta la misma política de capacidad.

- [ ] **Step 3: Ejecutar tests**

Run: `npm test -w apps/web -- offline-capabilities`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/web
git commit -m "feat(web): enforce role-specific offline capabilities"
```

### Task 13: Implementar limpieza local y revalidación

**Files:**
- Create: `apps/web/src/local-data/clear-offline-data.ts`
- Modify: logout flow
- Modify: consent withdrawal flow
- Tests: `clear-offline-data.test.ts`

**Interfaces:**
- Produces: `clearOfflineData(reason: 'logout'|'consent_withdrawn'|'account_revoked')`.

- [ ] **Step 1: Escribir test de logout**

Poblar stores con datos sintéticos, ejecutar logout/clear y comprobar que se eliminan datos sujetos a política, incluyendo outbox no aplicable; conservar solo metadatos técnicos permitidos si la política lo requiere.

- [ ] **Step 2: Escribir test de revalidación fallida**

Servidor responde cuenta deshabilitada/consentimiento retirado durante sync: no enviar más acciones y ejecutar limpieza/inutilización definida.

- [ ] **Step 3: Implementar y verificar**

Run: `npm test -w apps/web -- clear-offline-data.test.ts`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/local-data apps/web/src/features
git commit -m "feat(security): clear offline data on revoked access"
```

### Task 14: Añadir UX de conectividad y conflictos

**Files:**
- Create: components `ConnectivityIndicator`, `SyncStatus`, `LastSyncLabel`
- Modify: Student home/mission/recommendation/profile screens
- Tests: component tests

**Interfaces:**
- Copy approved: “Sin conexión”, “Guardado en este dispositivo”, “Pendiente de sincronizar”, “Sincronizado”, “Hay un cambio que necesita tu revisión”.

- [ ] **Step 1: Escribir tests de estados**

Verificar que una misión pending muestra “Pendiente de sincronizar” y no se presenta como error; un conflicto muestra una acción de revisión explícita.

- [ ] **Step 2: Implementar componentes**

No mostrar toasts repetitivos por cada retry. El indicador global debe ser discreto y accesible; los estados específicos viven junto al contenido afectado.

- [ ] **Step 3: Ejecutar tests y accesibilidad básica**

Run: `npm test -w apps/web -- SyncStatus`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src
git commit -m "feat(web): add offline and sync status ux"
```

### Task 15: E2E de PWA offline y CI

**Files:**
- Create: `e2e/pwa-offline.spec.ts`
- Modify: `.github/workflows/ci.yml`
- Modify: Playwright config if needed

**Interfaces:**
- Produces: gate automatizado para misión offline y paridad del recomendador.

- [ ] **Step 1: Escribir E2E misión offline**

Flujo exacto:
1. login online;
2. bootstrap;
3. poner contexto offline;
4. completar misión;
5. reload;
6. comprobar estado local pendiente;
7. volver online;
8. esperar sync;
9. consultar backend y verificar una sola transición/evento.

- [ ] **Step 2: Escribir E2E admin offline**

Poner offline en una pantalla ADMIN y verificar que el control de mutación está bloqueado y explica que requiere conexión.

- [ ] **Step 3: Ejecutar E2E**

Run: `npm run e2e -- pwa-offline.spec.ts`

Expected: PASS.

- [ ] **Step 4: Añadir gates CI**

CI ejecuta tests TS, Pytest shared fixtures y E2E PWA en job con browser. Una divergencia Python/TypeScript o duplicación en sync falla el pipeline.

- [ ] **Step 5: Ejecutar verificación global**

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run e2e -- pwa-offline.spec.ts
cd services/recommendation-service && ruff check . && pytest -q
```

Expected: todos los comandos PASS.

- [ ] **Step 6: Commit**

```bash
git add e2e .github apps services packages
git commit -m "test(pwa): verify offline sync end to end"
```

## Self-review del plan

- Cobertura: installability, IndexedDB, outbox, sync push/pull, idempotencia, conflictos, roles, IA offline, paridad, limpieza local y E2E están mapeados a tareas.
- No se añade un microservicio de sync.
- El LLM permanece únicamente online.
- No se usa Background Sync como única garantía.
- Los nombres `clientEventId`, `SyncAction`, `OFFLINE_RULES` y estados de resultado son consistentes con la spec.
