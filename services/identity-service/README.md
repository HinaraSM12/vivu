# Identidad y sesiones — identity-service

[Inicio](../../README.md) · [Auditoría y hallazgos compartidos](../../docs/auditoria-arquitectura.md)

## Propósito y estado

Registro de estudiantes, inicio y cierre de sesión, renovación de tokens y consulta de identidad. Las contraseñas se derivan con scrypt y los refresh tokens se almacenan por hash; el repositorio y las sesiones viven en memoria. El gateway mantiene otra implementación y almacén propios.

## Interfaces y dependencias

`POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`; `GET /me`. Todos los servicios Node exponen además `GET /health` y `GET /ready`. Estas rutas son internas en Compose; no se ha identificado una conexión HTTP del gateway a este servicio. PostgreSQL y RabbitMQ están configurados por Compose, pero las URL validadas no prueban conexión ni persistencia de negocio.

## Configuración y ejecución

| Variable | Condición |
| --- | --- |
| `NODE_ENV` | `development` por defecto; admite `development`, `test`, `production`. |
| `PORT` | Puerto TCP válido; por defecto `3001`. |
| `DATABASE_URL` | Opcional; si se proporciona, debe ser URL válida. |
| `RABBITMQ_URL` | Opcional; si se proporciona, debe ser URL válida. |
| `JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE` | Opcionales; configuración de tokens con valores por defecto de desarrollo. |

Ejemplos locales: [`.env.example`](.env.example). Desde la raíz: `npm ci` y `npm run dev -w @vivu/identity-service`; configurar explícitamente las variables necesarias para el entorno. Compose utiliza puerto `3001` y configura dependencias al iniciar.

## Calidad y mejoras

Seguridad: hay hash de contraseñas y controles de sesión, pero existen usuarios y secreto de desarrollo predeterminados. Fiabilidad: reiniciar pierde registros y sesiones. Mantenibilidad: hay pruebas unitarias para la configuración y salud, además de las pruebas de dominio cuando existen; no constituyen prueba de integración distribuida.

**Prioridad propuesta:** Eliminar secretos y usuarios de ejemplo de entornos compartidos; unificar identidad y persistir sesiones antes de operar con datos reales. La evidencia y los escenarios transversales están en la [auditoría](../../docs/auditoria-arquitectura.md).
