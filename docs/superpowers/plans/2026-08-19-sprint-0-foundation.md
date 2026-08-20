# Sprint 0 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear una base de repositorio reproducible que levante web, gateway, servicios esqueleto, PostgreSQL y RabbitMQ, con CI y contratos listos para implementar Sprint 1 y sin bloquear la futura PWA local-first.

**Architecture:** Monorepo con npm Workspaces. React + TypeScript + Vite vive en `apps/web`; gateway y microservicios Node usan NestJS; `recommendation-service` usa Python + FastAPI. PostgreSQL y RabbitMQ se levantan con Docker Compose; cada servicio tendrá ownership lógico de datos.

**Tech Stack:** React, TypeScript, Vite, Node.js, NestJS, npm Workspaces, Python, FastAPI, PostgreSQL, RabbitMQ, Docker Compose, Vitest/Jest, ESLint, Prettier, Ruff, Pytest, GitHub Actions.

**Spec:** `docs/00-master-spec.md`

## Global Constraints

- Microservicios desde V1.
- Frontend: React + TypeScript + Vite.
- Gestor: npm Workspaces.
- Backend de negocio: Node.js + TypeScript + NestJS.
- Recomendador: Python + FastAPI.
- PostgreSQL con ownership por servicio y sin joins directos cross-domain.
- RabbitMQ para eventos asíncronos.
- Docker Compose para desarrollo local.
- Roles fijos: STUDENT, FACILITATOR, ADMIN.
- Secrets nunca en Git.
- TypeScript `strict`.
- No implementar todavía lógica de Sprint 1: autenticación, consentimiento y perfil se planifican aparte.
- ADR-005 fija PWA local-first, pero Sprint 0 solo deja arquitectura PWA-ready; no implementa todavía outbox/sync completo.
- Componentes React no deben acoplarse directamente a APIs de dominio; usar clients/repositorios para permitir backend remoto y repositorio local en fases posteriores.

---

## Mapa de archivos del Sprint 0

```text
package.json
package-lock.json
.editorconfig
.gitignore
.env.example
README.md
docker-compose.yml
.github/workflows/ci.yml
apps/web/...
apps/web/src/platform/...
apps/web/src/local-data/...
apps/web/src/offline/...
apps/api-gateway/...
services/identity-service/...
services/student-service/...
services/gamification-service/...
services/resource-service/...
services/survey-service/...
services/support-service/...
services/analytics-service/...
services/recommendation-service/pyproject.toml
services/recommendation-service/src/recommendation_service/main.py
services/recommendation-service/tests/test_health.py
packages/contracts/package.json
packages/contracts/src/events/event-envelope.ts
packages/contracts/src/events/envelope.schema.json
packages/contracts/src/events/event-envelope.spec.ts
infra/postgres/init.sql
infra/rabbitmq/definitions.json
docs/adr/*.md
```

### Task 1: Inicializar raíz y npm Workspaces

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.editorconfig`
- Create: `.env.example`
- Create: `README.md`

**Interfaces:**
- Produces: scripts raíz `lint`, `test`, `typecheck`, `build` que delegan a workspaces.

- [ ] **Step 1: Crear `package.json` raíz**

```json
{
  "name": "student-support-platform",
  "version": "0.1.0",
  "private": true,
  "workspaces": ["apps/*", "services/*", "packages/*"],
  "scripts": {
    "lint": "npm run lint --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "build": "npm run build --workspaces --if-present"
  },
  "engines": {
    "node": ">=20"
  }
}
```

- [ ] **Step 2: Crear `.gitignore`**

```text
node_modules/
dist/
coverage/
.env
.env.*.local
.venv/
__pycache__/
.pytest_cache/
.ruff_cache/
.vite/
.DS_Store
*.log
```

- [ ] **Step 3: Crear `.editorconfig`**

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.py]
indent_size = 4
```

- [ ] **Step 4: Crear `.env.example`**

```text
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=platform
POSTGRES_PASSWORD=platform_dev_only
POSTGRES_DB=platform
RABBITMQ_URL=amqp://guest:guest@localhost:5672
JWT_ISSUER=student-support-platform
JWT_AUDIENCE=student-support-web
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

- [ ] **Step 5: Crear README mínimo**

```markdown
# Student Support Platform

Prototipo de acompañamiento académico ludificado con recomendación controlada mediante IA.

## Documentación

Leer primero `docs/00-master-spec.md` y `docs/adr/`.

## Comandos

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```
```

- [ ] **Step 6: Instalar y verificar workspace raíz**

Run: `npm install`

Expected: `package-lock.json` creado sin errores.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json .gitignore .editorconfig .env.example README.md
git commit -m "chore: initialize monorepo workspaces"
```

### Task 2: Crear shell React + Vite con test

**Files:**
- Create: `apps/web/*`
- Modify: `apps/web/package.json`
- Create: `apps/web/src/app/App.tsx`
- Create: `apps/web/src/app/App.test.tsx`
- Create: `apps/web/src/test/setup.ts`
- Modify: `apps/web/vite.config.ts`

**Interfaces:**
- Produces: app React con heading “Acompañamiento académico”, `VITE_API_BASE_URL` y estructura PWA-ready (`platform`, `local-data`, `offline`) sin implementar todavía la sincronización completa.

- [ ] **Step 1: Crear proyecto React TypeScript**

Run:

```bash
npm create vite@latest apps/web -- --template react-ts
npm install
npm install -w apps/web -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

Expected: workspace `apps/web` registrado en lockfile raíz.

- [ ] **Step 2: Configurar scripts de `apps/web/package.json`**

Asegurar al menos:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "test": "vitest run",
    "typecheck": "tsc -b --pretty false"
  }
}
```

- [ ] **Step 3: Configurar Vitest en `apps/web/vite.config.ts`**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

- [ ] **Step 4: Crear `apps/web/src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Escribir test fallido de `App`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the platform shell', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /acompañamiento académico/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Ejecutar el test y verificar fallo**

Run: `npm test -w apps/web`

Expected: FAIL porque el `App` generado por Vite aún no contiene ese heading.

- [ ] **Step 7: Implementar `apps/web/src/app/App.tsx`**

```tsx
export default function App() {
  return (
    <main>
      <h1>Acompañamiento académico</h1>
      <p>Prototipo de ludificación y recomendaciones personalizadas.</p>
    </main>
  );
}
```

Actualizar `main.tsx` para importar `App` desde `./app/App`.

- [ ] **Step 8: Ejecutar test, typecheck y build**

Run:

```bash
npm test -w apps/web
npm run typecheck -w apps/web
npm run build -w apps/web
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add apps/web package-lock.json
git commit -m "feat: add react web shell"
```

### Task 3: Crear API Gateway NestJS con health y correlation ID

**Files:**
- Create: `apps/api-gateway/*`
- Create: `apps/api-gateway/src/health/health.controller.ts`
- Create: `apps/api-gateway/src/health/health.controller.spec.ts`
- Create: `apps/api-gateway/src/common/correlation-id.middleware.ts`
- Modify: `apps/api-gateway/src/app.module.ts`

**Interfaces:**
- Produces: `GET /health` -> `{ "status": "ok" }`; response incluye `x-correlation-id`.

- [ ] **Step 1: Crear NestJS gateway**

Run:

```bash
npx @nestjs/cli new apps/api-gateway --package-manager npm --skip-git
npm install
```

Expected: workspace NestJS instalado bajo lockfile raíz.

- [ ] **Step 2: Escribir test fallido de health**

```ts
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns ok', () => {
    const controller = new HealthController();
    expect(controller.getHealth()).toEqual({ status: 'ok' });
  });
});
```

- [ ] **Step 3: Ejecutar test y confirmar fallo**

Run: `npm test -w apps/api-gateway -- --runInBand`

Expected: FAIL porque `HealthController` no existe.

- [ ] **Step 4: Implementar `health.controller.ts`**

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return { status: 'ok' as const };
  }
}
```

- [ ] **Step 5: Implementar `correlation-id.middleware.ts`**

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const incoming = req.header('x-correlation-id');
    const correlationId = incoming && incoming.length <= 128 ? incoming : randomUUID();
    res.setHeader('x-correlation-id', correlationId);
    res.locals.correlationId = correlationId;
    next();
  }
}
```

- [ ] **Step 6: Registrar controller y middleware en `app.module.ts`**

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CorrelationIdMiddleware } from './common/correlation-id.middleware';
import { HealthController } from './health/health.controller';

@Module({ controllers: [HealthController] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
```

- [ ] **Step 7: Ejecutar tests y build**

Run:

```bash
npm test -w apps/api-gateway -- --runInBand
npm run build -w apps/api-gateway
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add apps/api-gateway package-lock.json
git commit -m "feat: add api gateway foundation"
```

### Task 4: Crear esqueletos NestJS de servicios Node

**Files:**
- Create: `services/identity-service/*`
- Create: `services/student-service/*`
- Create: `services/gamification-service/*`
- Create: `services/resource-service/*`
- Create: `services/survey-service/*`
- Create: `services/support-service/*`
- Create: `services/analytics-service/*`

**Interfaces:**
- Produces: cada servicio expone `GET /health` -> `{ "status": "ok", "service": "<name>" }`.

- [ ] **Step 1: Crear los siete proyectos NestJS**

Run:

```bash
for svc in identity student gamification resource survey support analytics; do
  npx @nestjs/cli new "services/${svc}-service" --package-manager npm --skip-git
done
npm install
```

Expected: siete workspaces NestJS registrados.

- [ ] **Step 2: Reemplazar `app.controller.ts` en cada servicio con health explícito**

Usar este contenido, sustituyendo `SERVICE_NAME` por el nombre literal del servicio:

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppController {
  @Get()
  health() {
    return { status: 'ok' as const, service: 'SERVICE_NAME' };
  }
}
```

Valores exactos: `identity-service`, `student-service`, `gamification-service`, `resource-service`, `survey-service`, `support-service`, `analytics-service`.

- [ ] **Step 3: Reemplazar test de cada `app.controller.spec.ts`**

```ts
import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';

it('returns service health', async () => {
  const moduleRef = await Test.createTestingModule({ controllers: [AppController] }).compile();
  const controller = moduleRef.get(AppController);
  expect(controller.health().status).toBe('ok');
});
```

- [ ] **Step 4: Ejecutar tests, typecheck y build**

Run:

```bash
npm test --workspaces --if-present -- --runInBand
npm run build --workspaces --if-present
```

Expected: todos los servicios NestJS PASS/build.

- [ ] **Step 5: Commit**

```bash
git add services package-lock.json
git commit -m "feat: add node service skeletons"
```

### Task 5: Crear recommendation-service FastAPI

**Files:**
- Create: `services/recommendation-service/pyproject.toml`
- Create: `services/recommendation-service/src/recommendation_service/__init__.py`
- Create: `services/recommendation-service/src/recommendation_service/main.py`
- Create: `services/recommendation-service/tests/test_health.py`

**Interfaces:**
- Produces: `GET /health` -> `{"status":"ok","service":"recommendation-service"}`.

- [ ] **Step 1: Crear `pyproject.toml`**

```toml
[project]
name = "recommendation-service"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "fastapi>=0.115,<1",
  "uvicorn[standard]>=0.30,<1",
  "pydantic>=2.8,<3"
]

[project.optional-dependencies]
dev = [
  "httpx>=0.27,<1",
  "pytest>=8,<9",
  "ruff>=0.6,<1"
]

[tool.pytest.ini_options]
pythonpath = ["src"]

[tool.ruff]
line-length = 100
```

- [ ] **Step 2: Escribir test fallido**

```python
from fastapi.testclient import TestClient
from recommendation_service.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok', 'service': 'recommendation-service'}
```

- [ ] **Step 3: Crear entorno e instalar dev dependencies**

Run:

```bash
cd services/recommendation-service
python -m venv .venv
. .venv/bin/activate
python -m pip install -e '.[dev]'
python -m pytest -q
```

Expected: FAIL porque `app` aún no existe.

- [ ] **Step 4: Implementar `main.py`**

```python
from fastapi import FastAPI

app = FastAPI(title='Recommendation Service', version='0.1.0')


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok', 'service': 'recommendation-service'}
```

- [ ] **Step 5: Ejecutar Ruff y Pytest**

Run:

```bash
cd services/recommendation-service
. .venv/bin/activate
ruff check .
python -m pytest -q
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add services/recommendation-service
git commit -m "feat: add recommendation service foundation"
```

### Task 6: Levantar PostgreSQL y RabbitMQ con Docker Compose

**Files:**
- Create: `docker-compose.yml`
- Create: `infra/postgres/init.sql`
- Create: `infra/rabbitmq/definitions.json`

**Interfaces:**
- Produces: PostgreSQL en `5432`; RabbitMQ AMQP en `5672`; management UI en `15672` solo desarrollo.

- [ ] **Step 1: Crear `infra/postgres/init.sql`**

```sql
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS student;
CREATE SCHEMA IF NOT EXISTS gamification;
CREATE SCHEMA IF NOT EXISTS resource;
CREATE SCHEMA IF NOT EXISTS recommendation;
CREATE SCHEMA IF NOT EXISTS survey;
CREATE SCHEMA IF NOT EXISTS support;
CREATE SCHEMA IF NOT EXISTS analytics;
```

- [ ] **Step 2: Crear `infra/rabbitmq/definitions.json`**

```json
{
  "vhosts": [{"name": "/"}],
  "exchanges": [
    {"name": "domain.events", "vhost": "/", "type": "topic", "durable": true, "auto_delete": false, "internal": false, "arguments": {}}
  ],
  "queues": [],
  "bindings": []
}
```

- [ ] **Step 3: Crear `docker-compose.yml` para infraestructura**

```yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-platform}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-platform_dev_only}
      POSTGRES_DB: ${POSTGRES_DB:-platform}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./infra/postgres/init.sql:/docker-entrypoint-initdb.d/001-init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-platform} -d ${POSTGRES_DB:-platform}"]
      interval: 5s
      timeout: 5s
      retries: 10

  rabbitmq:
    image: rabbitmq:4-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
      - ./infra/rabbitmq/definitions.json:/etc/rabbitmq/definitions.json:ro
    environment:
      RABBITMQ_SERVER_ADDITIONAL_ERL_ARGS: "-rabbitmq_management load_definitions \"/etc/rabbitmq/definitions.json\""
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_data:
  rabbitmq_data:
```

- [ ] **Step 4: Iniciar infraestructura**

Run: `docker compose up -d postgres rabbitmq`

Expected: ambos servicios `healthy`.

- [ ] **Step 5: Verificar PostgreSQL y RabbitMQ**

Run:

```bash
docker compose exec postgres pg_isready -U platform -d platform
docker compose exec rabbitmq rabbitmq-diagnostics -q ping
```

Expected: PostgreSQL acepta conexiones y RabbitMQ responde `Ping succeeded`.

- [ ] **Step 6: Commit**

```bash
git add docker-compose.yml infra
git commit -m "chore: add local postgres and rabbitmq"
```

### Task 7: Crear paquete de contratos de eventos

**Files:**
- Create: `packages/contracts/package.json`
- Create: `packages/contracts/tsconfig.json`
- Create: `packages/contracts/src/events/event-envelope.ts`
- Create: `packages/contracts/src/events/envelope.schema.json`
- Create: `packages/contracts/src/events/event-envelope.spec.ts`

**Interfaces:**
- Produces: `EventEnvelope<TPayload>` con nombres consistentes con `event-catalog.md`.

- [ ] **Step 1: Crear `packages/contracts/package.json`**

```json
{
  "name": "@platform/contracts",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "build": "tsc -p tsconfig.json",
    "lint": "eslint ."
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Crear `event-envelope.spec.ts` antes de la implementación**

```ts
import { describe, expect, it } from 'vitest';
import type { EventEnvelope } from './event-envelope';

describe('EventEnvelope', () => {
  it('represents a versioned domain event', () => {
    const event: EventEnvelope<{ assignmentId: string }> = {
      eventId: '11111111-1111-1111-1111-111111111111',
      eventType: 'mission.completed.v1',
      occurredAt: '2026-08-19T20:00:00Z',
      actorId: 'actor-1',
      subjectId: 'subject-1',
      correlationId: '22222222-2222-2222-2222-222222222222',
      schemaVersion: 1,
      payload: { assignmentId: '33333333-3333-3333-3333-333333333333' },
    };
    expect(event.schemaVersion).toBe(1);
    expect(event.eventType).toBe('mission.completed.v1');
  });
});
```

- [ ] **Step 3: Ejecutar test y verificar fallo de tipo/import**

Run: `npm install && npm test -w @platform/contracts`

Expected: FAIL porque `event-envelope.ts` no existe.

- [ ] **Step 4: Implementar `event-envelope.ts`**

```ts
export interface EventEnvelope<TPayload> {
  eventId: string;
  eventType: string;
  occurredAt: string;
  actorId?: string;
  subjectId?: string;
  correlationId: string;
  schemaVersion: number;
  payload: TPayload;
}
```

- [ ] **Step 5: Crear JSON Schema equivalente**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["eventId", "eventType", "occurredAt", "correlationId", "schemaVersion", "payload"],
  "properties": {
    "eventId": {"type": "string"},
    "eventType": {"type": "string"},
    "occurredAt": {"type": "string", "format": "date-time"},
    "actorId": {"type": "string"},
    "subjectId": {"type": "string"},
    "correlationId": {"type": "string"},
    "schemaVersion": {"type": "integer", "minimum": 1},
    "payload": {"type": "object"}
  },
  "additionalProperties": false
}
```

- [ ] **Step 6: Ejecutar tests y typecheck**

Run:

```bash
npm test -w @platform/contracts
npm run typecheck -w @platform/contracts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add packages/contracts package-lock.json
git commit -m "feat: add shared event contracts"
```

### Task 8: Containerizar gateway y servicios

**Files:**
- Create: `apps/api-gateway/Dockerfile`
- Create: `services/identity-service/Dockerfile`
- Create: `services/student-service/Dockerfile`
- Create: `services/gamification-service/Dockerfile`
- Create: `services/resource-service/Dockerfile`
- Create: `services/survey-service/Dockerfile`
- Create: `services/support-service/Dockerfile`
- Create: `services/analytics-service/Dockerfile`
- Create: `services/recommendation-service/Dockerfile`
- Modify: `docker-compose.yml`

**Interfaces:**
- Produces: gateway en `3000`; servicios en puertos internos; health checks utilizables por Compose.

- [ ] **Step 1: Crear Dockerfile Node por workspace**

Usar este patrón en gateway y cada servicio Node, sustituyendo `WORKSPACE_PATH` y `WORKSPACE_NAME`:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /repo
COPY package*.json ./
COPY apps ./apps
COPY services ./services
COPY packages ./packages
RUN npm ci
RUN npm run build -w WORKSPACE_NAME

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/WORKSPACE_PATH/dist ./dist
COPY --from=build /repo/node_modules ./node_modules
CMD ["node", "dist/main.js"]
```

Ejemplo gateway: `WORKSPACE_PATH=apps/api-gateway` y nombre de workspace igual al `name` real de su `package.json`.

- [ ] **Step 2: Crear Dockerfile Python**

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml ./
COPY src ./src
RUN pip install --no-cache-dir .
ENV PYTHONPATH=/app/src
CMD ["uvicorn", "recommendation_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 3: Añadir gateway y recommendation service a Compose primero**

Añadir:

```yaml
  api-gateway:
    build:
      context: .
      dockerfile: apps/api-gateway/Dockerfile
    environment:
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy

  recommendation-service:
    build:
      context: ./services/recommendation-service
    expose:
      - "8000"
```

Después añadir los siete servicios Node con el mismo patrón, sin exponerlos públicamente salvo necesidad de desarrollo.

- [ ] **Step 4: Construir imágenes**

Run: `docker compose build`

Expected: todas las imágenes construyen sin error.

- [ ] **Step 5: Levantar stack**

Run: `docker compose up -d`

Expected: infraestructura y servicios running/healthy.

- [ ] **Step 6: Consultar health del gateway**

Run: `curl -fsS http://localhost:3000/health`

Expected: `{"status":"ok"}`.

- [ ] **Step 7: Commit**

```bash
git add docker-compose.yml apps services
git commit -m "chore: containerize application services"
```

### Task 9: Configurar CI

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: checks `node-quality`, `python-quality`, `contracts`.

- [ ] **Step 1: Crear workflow completo**

```yaml
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  node-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build

  python-quality:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: services/recommendation-service
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: python -m pip install -e '.[dev]'
      - run: ruff check .
      - run: python -m pytest -q

  contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test -w @platform/contracts
      - run: npm run typecheck -w @platform/contracts
```

- [ ] **Step 2: Validar localmente los mismos comandos de CI**

Run:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
cd services/recommendation-service
. .venv/bin/activate
ruff check .
python -m pytest -q
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add repository quality gates"
```

### Task 10: Verificación final y handoff de Sprint 0

**Files:**
- Modify: `README.md`
- Modify: `docs/architecture/repository-spec.md` solo si los comandos comprobados difieren.

**Interfaces:**
- Produces: instrucciones reproducibles y evidencia de que Sprint 1 puede comenzar.

- [ ] **Step 1: Verificar instalación limpia en clone temporal**

Run:

```bash
repo_dir="$(pwd)"
tmp_dir="$(mktemp -d)"
git clone "$repo_dir" "$tmp_dir/repo"
cd "$tmp_dir/repo"
npm ci
```

Expected: instalación limpia desde lockfile.

- [ ] **Step 2: Ejecutar gates Node**

Run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Expected: PASS.

- [ ] **Step 3: Ejecutar gates Python en clone limpio**

Run:

```bash
cd services/recommendation-service
python -m venv .venv
. .venv/bin/activate
python -m pip install -e '.[dev]'
ruff check .
python -m pytest -q
```

Expected: PASS.

- [ ] **Step 4: Levantar Docker en clone limpio**

Run:

```bash
cd "$tmp_dir/repo"
cp .env.example .env
docker compose up -d --build
docker compose ps
curl -fsS http://localhost:3000/health
```

Expected: dependencias/servicios requeridos running y gateway responde `{"status":"ok"}`.

- [ ] **Step 5: Actualizar README con comandos realmente comprobados**

README debe contener exactamente estas secciones:

```markdown
## Requisitos
- Node.js 22+
- npm
- Python 3.12+
- Docker + Docker Compose

## Instalación
`npm ci`

## Calidad
`npm run lint && npm run typecheck && npm run test && npm run build`

## Recomendador
`cd services/recommendation-service && python -m venv .venv && . .venv/bin/activate && python -m pip install -e '.[dev]'`

## Infraestructura local
`cp .env.example .env && docker compose up -d --build`

## Documentación
Leer `docs/00-master-spec.md`, `docs/adr/` y el plan del sprint antes de implementar.
```

- [ ] **Step 6: Commit final**

```bash
git add README.md docs/architecture/repository-spec.md
git commit -m "docs: finalize sprint zero developer handoff"
```

## Self-review del plan

- **Cobertura:** repo, frontend, gateway, siete servicios Node, FastAPI, PostgreSQL, RabbitMQ, contratos, contenedores y CI tienen tareas explícitas.
- **Fuera de alcance:** autenticación, consentimiento, perfiles, misiones y lógica del recomendador empiezan en planes posteriores.
- **Consistencia:** `EventEnvelope` usa los mismos nombres que `event-catalog.md`; roles y tecnologías coinciden con la master spec.
- **Sin decisiones nuevas:** no define proveedor LLM, cloud, SSO institucional, marca oficial ni instrumentos finales.


## Nota de handoff PWA

Después de Sprint 0, no implementar la PWA completa como trabajo incidental dentro de otra historia. Usar `docs/architecture/pwa-offline-sync.md`, ADR-005 y `docs/superpowers/plans/2026-08-19-pwa-offline-sync.md`. El primer vertical offline recomendado se integra con Gamification Core para demostrar misión offline -> outbox -> sync idempotente.
