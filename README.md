# Vivu

Vivu es un prototipo de acompañamiento académico con ludificación y recomendaciones controladas mediante inteligencia artificial. Busca ayudar a estudiantes a convertir su contexto y objetivos en misiones pequeñas, progreso personal, recuperación sin castigo y acceso a recursos institucionales autorizados.

Sprint 0 entrega únicamente la fundación técnica. La autenticación, el onboarding, las misiones funcionales, el recomendador completo y la sincronización offline se implementarán en incrementos posteriores.

## Arquitectura

```text
React/Vite
    |
API Gateway (NestJS)
    |
    +-- Identity Service
    +-- Student Service
    +-- Gamification Service
    +-- Resource Service
    +-- Survey Service
    +-- Support Service
    +-- Analytics Service
    +-- Recommendation Service (FastAPI)
             |
       PostgreSQL + RabbitMQ
```

El gateway es el único punto de entrada externo. Cada servicio posee sus datos, esquema, credenciales y futuras migraciones. No se permiten consultas SQL directas entre dominios.

## Stack

- React, TypeScript y Vite.
- Node.js, TypeScript y NestJS.
- Python, FastAPI, Pydantic, Ruff, Mypy y Pytest.
- PostgreSQL 17.
- RabbitMQ 4.
- Docker y Docker Compose.
- npm Workspaces.
- Vitest, Jest y Testing Library.
- OpenAPI y JSON Schema.
- GitHub Actions.

## Requisitos

- Node.js 22 o superior.
- npm 10 o superior.
- Python 3.12 o superior.
- Docker Desktop o Docker Engine con Compose.
- Git.

El entorno local validado durante Sprint 0 utilizó Node.js 24, npm 11, Python 3.14, Docker 29 y Docker Compose 5.

## Instalación

Desde la raíz:

```powershell
npm ci
py -m venv services/recommendation-service/.venv
& services/recommendation-service/.venv/Scripts/Activate.ps1
python -m pip install -e "services/recommendation-service[dev]"
```

En Linux o macOS:

```bash
npm ci
python -m venv services/recommendation-service/.venv
source services/recommendation-service/.venv/bin/activate
python -m pip install -e 'services/recommendation-service[dev]'
```

## Variables de entorno

`.env.example` documenta las variables generales. Cada aplicación o servicio incluye además su propio `.env.example`.

Para crear una configuración local en PowerShell:

```powershell
Copy-Item .env.example .env
```

En Linux o macOS:

```bash
cp .env.example .env
```

Los valores terminados en `_dev_only` son credenciales conocidas exclusivamente para desarrollo local. No deben reutilizarse en ambientes compartidos. Los archivos `.env` y secretos reales están excluidos de Git.

## Docker Compose

Iniciar la infraestructura y los servicios:

```powershell
docker compose up -d --build
docker compose ps
```

Comprobar el gateway:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Servicios expuestos al host:

- API Gateway: http://localhost:3000
- OpenAPI del gateway: http://localhost:3000/api/docs
- PostgreSQL: `localhost:5432`
- RabbitMQ AMQP: `localhost:5672`
- RabbitMQ Management: http://localhost:15672

Los microservicios internos solo son accesibles desde la red de Compose.

Para detener contenedores sin eliminar los volúmenes:

```powershell
docker compose stop
```

## Desarrollo

### Frontend

```powershell
npm run dev -w @vivu/web
```

### API Gateway

```powershell
npm run dev -w @vivu/api-gateway
```

### Servicios NestJS

Ejemplo:

```powershell
npm run dev -w @vivu/identity-service
```

`npm run dev` desde la raíz inicia en paralelo el frontend, gateway y los siete servicios Node. PostgreSQL, RabbitMQ y FastAPI se inician por separado mediante Docker Compose o sus comandos específicos.

### Recommendation Service

Con el entorno virtual activo:

```powershell
python -m uvicorn recommendation_service.main:app --app-dir services/recommendation-service/src --reload --port 8000
```

## Calidad

Con el entorno virtual Python activo, los comandos raíz son:

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```

Comandos separados:

```powershell
npm run lint:node
npm run lint:python
npm run typecheck:node
npm run typecheck:python
npm run test:node
npm run test:python
```

Las pruebas actuales cubren el shell web, la frontera HTTP, health/readiness, correlation IDs, validación de configuración y el contrato de eventos.

## Estructura del monorepo

```text
apps/
  web/
  api-gateway/
services/
  identity-service/
  student-service/
  gamification-service/
  resource-service/
  survey-service/
  support-service/
  analytics-service/
  recommendation-service/
packages/
  contracts/
  eslint-config/
  test-utils/
  tsconfig/
  ui/
infra/
  postgres/
  rabbitmq/
docs/
scripts/
.github/workflows/
```

## PWA local-first

La arquitectura futura mantiene estas reglas:

- `STUDENT`: operación offline completa sobre datos previamente sincronizados.
- `FACILITATOR`: principalmente online, con lectura cacheada limitada.
- `ADMIN`: mutaciones administrativas únicamente online.
- IndexedDB almacenará datos de dominio; Cache Storage se limitará al shell y activos seguros.
- La sincronización utilizará outbox, `clientEventId`, idempotencia y conflictos por dominio.
- El recomendador offline será determinístico en TypeScript y no ejecutará un LLM local.

Sprint 0 solo establece fronteras sustituibles para estas capacidades; no implementa todavía la PWA completa.

## Estrategia de ramas

- `main`: rama estable.
- `chore/sprint-0-foundation`: fundación técnica del Sprint 0.
- Ramas cortas posteriores: `feat/*`, `fix/*`, `docs/*` y `chore/*`.

Los commits siguen Conventional Commits con descripción en español. Los cambios se integran mediante Pull Request y CI verde; no se realiza force push sobre `main`.

## Documentación

La fuente de verdad está en:

1. `docs/00-master-spec.md`
2. `docs/adr/`
3. `docs/architecture/`
4. `docs/product/`
5. `docs/ai/`, `docs/security/` y `docs/testing/`
6. `docs/superpowers/plans/`

ADR-005 fija la estrategia PWA local-first. Cualquier cambio de arquitectura, broker, tecnología principal, ownership de datos o límites de servicios requiere aprobación y un ADR nuevo.

## Contribución

Antes de abrir un Pull Request:

1. Revisa la especificación y los ADR aplicables.
2. No incluyas secretos ni datos reales de estudiantes.
3. Actualiza contratos y pruebas cuando corresponda.
4. Ejecuta lint, typecheck, tests y build.
5. Usa un commit Conventional Commit con descripción clara en español.
6. Documenta cualquier impacto arquitectónico o de privacidad.
