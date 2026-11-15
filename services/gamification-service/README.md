# Misiones y progreso — gamification-service

[Inicio](../../README.md) · [Auditoría y hallazgos compartidos](../../docs/auditoria-arquitectura.md)

## Propósito y estado

Catálogo, asignaciones, transiciones de misiones, logros, continuidad y recuperación. Las plantillas, asignaciones, logros, continuidad e idempotencia se mantienen en memoria. El gateway mantiene lógica y estado separados.

## Interfaces y dependencias

`GET /missions/catalog`; rutas `/students/:studentId/missions`, `/progress` y `/recovery`, con acciones de misión y activación de recuperación. Todos los servicios Node exponen además `GET /health` y `GET /ready`. Estas rutas son internas en Compose; no se ha identificado una conexión HTTP del gateway a este servicio. PostgreSQL y RabbitMQ están configurados por Compose, pero las URL validadas no prueban conexión ni persistencia de negocio.

## Configuración y ejecución

| Variable | Condición |
| --- | --- |
| `NODE_ENV` | `development` por defecto; admite `development`, `test`, `production`. |
| `PORT` | Puerto TCP válido; por defecto `3003`. |
| `DATABASE_URL` | Opcional; si se proporciona, debe ser URL válida. |
| `RABBITMQ_URL` | Opcional; si se proporciona, debe ser URL válida. |

Ejemplos locales: [`.env.example`](.env.example). Desde la raíz: `npm ci` y `npm run dev -w @vivu/gamification-service`; configurar explícitamente las variables necesarias para el entorno. Compose utiliza puerto `3003` y configura dependencias al iniciar.

## Calidad y mejoras

Adecuación funcional: existen reglas y pruebas unitarias de dominio. Fiabilidad: reinicios y réplicas comprometen continuidad e idempotencia. Mantenibilidad: hay pruebas unitarias para la configuración y salud, además de las pruebas de dominio cuando existen; no constituyen prueba de integración distribuida.

**Prioridad propuesta:** Consolidar reglas en un único propietario, persistir transiciones e idempotencia y probar concurrencia y recuperación. La evidencia y los escenarios transversales están en la [auditoría](../../docs/auditoria-arquitectura.md).
