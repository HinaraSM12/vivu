# Encuestas — survey-service

[Inicio](../../README.md) · [Auditoría y hallazgos compartidos](../../docs/auditoria-arquitectura.md)

## Propósito y estado

Definiciones de encuestas, envío y consulta de respuestas por estudiante. Definiciones, respuestas e idempotencia se almacenan en memoria; el gateway implementa un flujo paralelo.

## Interfaces y dependencias

`GET /surveys`, `GET /surveys/:code`, `POST /surveys/students/:studentId/:code/submit`, `GET /surveys/students/:studentId/responses`. Todos los servicios Node exponen además `GET /health` y `GET /ready`. Estas rutas son internas en Compose; no se ha identificado una conexión HTTP del gateway a este servicio. PostgreSQL y RabbitMQ están configurados por Compose, pero las URL validadas no prueban conexión ni persistencia de negocio.

## Configuración y ejecución

| Variable | Condición |
| --- | --- |
| `NODE_ENV` | `development` por defecto; admite `development`, `test`, `production`. |
| `PORT` | Puerto TCP válido; por defecto `3005`. |
| `DATABASE_URL` | Opcional; si se proporciona, debe ser URL válida. |
| `RABBITMQ_URL` | Opcional; si se proporciona, debe ser URL válida. |

Ejemplos locales: [`.env.example`](.env.example). Desde la raíz: `npm ci` y `npm run dev -w @vivu/survey-service`; configurar explícitamente las variables necesarias para el entorno. Compose utiliza puerto `3005` y configura dependencias al iniciar.

## Calidad y mejoras

Seguridad: las respuestas pueden contener información sensible y requieren límites de acceso verificables. Fiabilidad: reinicios eliminan respuestas y claves de idempotencia. Mantenibilidad: hay pruebas unitarias para la configuración y salud, además de las pruebas de dominio cuando existen; no constituyen prueba de integración distribuida.

**Prioridad propuesta:** Persistir respuestas con retención definida; integrar autorización y verificar idempotencia y privacidad de extremo a extremo. La evidencia y los escenarios transversales están en la [auditoría](../../docs/auditoria-arquitectura.md).
