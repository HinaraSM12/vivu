# Prompt para la IA que creará el repositorio

Quiero que crees la fundación técnica de este proyecto siguiendo estrictamente los documentos entregados.

## Antes de modificar archivos

Lee, en este orden:

1. `docs/00-master-spec.md`
2. `docs/adr/001-microservices.md`
3. `docs/adr/002-node-python.md`
4. `docs/adr/003-rabbitmq.md`
5. `docs/adr/004-database-per-service.md`
6. `docs/adr/005-pwa-local-first-offline.md`
7. `docs/architecture/architecture.md`
8. `docs/architecture/pwa-offline-sync.md`
9. `docs/architecture/repository-spec.md`
10. `docs/product/product-backlog.md`
11. `docs/superpowers/plans/2026-08-19-sprint-0-foundation.md`

La documentación es la fuente de verdad. No cambies tecnologías, roles, límites de servicios ni decisiones PWA por preferencia personal. Si detectas una contradicción real, detente y explícala antes de editar.

## Objetivo actual

Implementa **solo Sprint 0 / Foundation**.

Quiero un monorepo reproducible que deje listos:

- React + TypeScript + Vite;
- npm Workspaces;
- API Gateway NestJS;
- microservicios NestJS esqueleto;
- `recommendation-service` Python + FastAPI;
- PostgreSQL;
- RabbitMQ;
- Docker Compose;
- lint, typecheck, tests y build;
- CI;
- health/readiness;
- `.env.example`;
- documentación incluida.

## Decisión PWA que debes preservar

El frontend evolucionará a una **PWA local-first**.

No implementes todavía toda la PWA/offline dentro de Sprint 0, pero tampoco construyas una arquitectura que luego obligue a reescribir el frontend.

Restricciones:

- STUDENT tendrá operación offline completa sobre datos previamente sincronizados.
- FACILITATOR será principalmente online y solo tendrá cache de lectura limitado.
- ADMIN requerirá conexión para mutaciones.
- IndexedDB será el almacén de datos de dominio offline.
- Cache Storage se reservará para app shell/activos seguros.
- Offline sync usará outbox + `clientEventId` + idempotencia + conflictos por dominio.
- No se creará un `sync-service`; el API Gateway coordinará sync y cada microservicio validará sus propias reglas.
- El recomendador offline será hard rules + scoring TypeScript con configuración versionada compartida con Python.
- No habrá LLM local.
- No uses Background Sync como única garantía.

En Sprint 0 solo deja el frontend **PWA-ready**: separa componentes UI de acceso remoto mediante clients/repositorios y crea la estructura prevista por `repository-spec.md`. No implementes outbox/sync completo salvo que el plan de Sprint 0 lo exija expresamente.

## Stack fijo

- React + TypeScript + Vite
- npm Workspaces
- Node.js + TypeScript + NestJS
- Python + FastAPI para Recommendation Service
- PostgreSQL
- RabbitMQ
- Docker Compose
- REST/OpenAPI + eventos RabbitMQ
- Roles: `STUDENT`, `FACILITATOR`, `ADMIN`

No introduzcas pnpm, Yarn, Nx, Turborepo, Kafka, Kubernetes, Redis, service mesh o un LLM local sin aprobación y ADR.

## Forma de trabajo

Sigue exactamente `docs/superpowers/plans/2026-08-19-sprint-0-foundation.md`.

Para cada tarea:

1. identifica archivos;
2. escribe primero la prueba cuando el plan lo indique;
3. ejecuta la prueba y confirma el fallo esperado;
4. implementa lo mínimo necesario;
5. ejecuta test/lint/typecheck/build correspondiente;
6. corrige antes de avanzar;
7. haz un commit pequeño con Conventional Commits.

No afirmes que algo funciona sin mostrar el comando ejecutado y su resultado.

## No implementar todavía

- onboarding funcional completo;
- dashboards completos;
- scoring final;
- LLM real con claves;
- outbox PWA completo;
- motor offline final;
- sync push/pull completo;
- conflictos offline completos;
- integración institucional;
- Kubernetes/cloud producción.

La PWA completa tiene su propio plan posterior: `docs/superpowers/plans/2026-08-19-pwa-offline-sync.md`.

## Gate antes de empezar

Antes de crear/modificar archivos, responde con:

1. resumen de la arquitectura entendida;
2. árbol de directorios que crearás;
3. tareas de Sprint 0 que ejecutarás;
4. cómo preservarás la futura PWA local-first sin implementarla completa ahora;
5. contradicciones/bloqueos encontrados.

**No modifiques archivos hasta que yo apruebe ese resumen.**
