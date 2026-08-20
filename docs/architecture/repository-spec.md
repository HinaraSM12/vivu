# Especificación del repositorio

## Estructura

```text
/
├── apps/
│   ├── web/                    # React/Vite; futura PWA local-first
│   └── api-gateway/
├── services/
│   ├── identity-service/
│   ├── student-service/
│   ├── gamification-service/
│   ├── resource-service/
│   ├── recommendation-service/
│   ├── survey-service/
│   ├── support-service/
│   └── analytics-service/
├── packages/
│   ├── ui/
│   ├── contracts/
│   ├── eslint-config/
│   ├── tsconfig/
│   └── test-utils/
├── infra/
│   ├── postgres/
│   └── rabbitmq/
├── docs/
├── scripts/
├── .github/workflows/
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

## Frontend PWA-ready

Desde Sprint 0, `apps/web` no debe asumir conectividad permanente. La estructura futura contempla:

```text
apps/web/src/
├── app/
├── features/
├── local-data/
├── offline/
│   ├── outbox/
│   ├── sync/
│   └── conflicts/
├── recommendation-offline/
└── platform/
```

No es obligatorio implementar toda la capa PWA en Sprint 0. Sí es obligatorio evitar una arquitectura que acople componentes React directamente a `fetch` sin repositorios/clients sustituibles.

## JavaScript/TypeScript

- Node.js + TypeScript `strict`.
- npm Workspaces.
- React + TypeScript + Vite en `apps/web`.
- Tooling PWA aprobado para la fase correspondiente: `vite-plugin-pwa` + `idb`.
- NestJS en gateway y servicios Node.
- ESLint + Prettier compartidos.

Root `package.json` mínimo:

```json
{
  "private": true,
  "workspaces": ["apps/*", "services/*", "packages/*"],
  "scripts": {
    "dev": "node scripts/dev.mjs",
    "lint": "npm run lint --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "build": "npm run build --workspaces --if-present",
    "typecheck": "npm run typecheck --workspaces --if-present"
  }
}
```

## Python

`services/recommendation-service` usa:

```text
pyproject.toml
src/recommendation_service/
tests/
```

Herramientas: FastAPI, Pydantic, Ruff, Pytest. El entorno Python no se publica como workspace npm; scripts raíz pueden delegar mediante Docker o shell multiplataforma.

## Nombres

- carpetas: `kebab-case` para apps/services; packages con nombres claros.
- TypeScript: archivos `kebab-case.ts`, clases `PascalCase`, variables `camelCase`.
- eventos: `<domain>.<past-tense>.vN`.
- rutas REST: sustantivos en plural; acciones solo cuando el cambio de estado lo justifique.
- variables de entorno: `UPPER_SNAKE_CASE`.

## Git

- Rama principal: `main` protegida.
- Desarrollo por ramas cortas: `feat/...`, `fix/...`, `docs/...`, `chore/...`.
- Conventional Commits.
- PR requiere CI verde y revisión del impacto en contratos/ADR.

## ADR

Cualquier cambio en estilo arquitectónico, lenguaje principal de un dominio, broker, ownership de datos, proveedor de identidad o límites de servicios requiere un ADR nuevo. No editar un ADR aceptado para simular que la decisión original nunca existió.

## Variables de entorno

Cada servicio mantiene `.env.example`. Nunca se versionan secretos reales.

Ejemplos globales:

```text
NODE_ENV=development
POSTGRES_HOST=postgres
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
JWT_ISSUER=student-support-platform
JWT_AUDIENCE=student-support-web
```

## CI

Pipeline mínimo por PR:

1. install/caches;
2. lint;
3. typecheck;
4. unit tests;
5. integration tests definidas;
6. build web + Node services;
7. Python Ruff + Pytest;
8. validación OpenAPI/event schemas;
9. E2E en pipeline separado cuando el entorno esté listo.
10. parity tests de fixtures del recomendador Python/TypeScript cuando el motor offline exista.
11. pruebas offline/red intermitente antes de release de piloto.

## Regla para asistentes de IA

Antes de modificar código: leer `docs/00-master-spec.md`, ADRs relevantes y contrato del servicio. No reorganizar el repo, cambiar tecnologías fijas ni compartir tablas entre dominios sin aprobación y ADR. ADR-005 fija PWA local-first; no añadir un LLM local ni un microservicio de sync sin nuevo ADR.
