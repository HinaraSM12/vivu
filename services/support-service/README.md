# Acompañamiento — support-service

[Inicio](../../README.md) · [Auditoría y hallazgos compartidos](../../docs/auditoria-arquitectura.md)

## Propósito y estado

Actualmente solo ofrece endpoints de salud; el dominio de acompañamiento es una responsabilidad prevista. El módulo registra únicamente configuración y controlador de salud; no hay controlador de notas de acompañamiento.

## Interfaces y dependencias

`GET /health` y `GET /ready`. Todos los servicios Node exponen además `GET /health` y `GET /ready`. Estas rutas son internas en Compose; no se ha identificado una conexión HTTP del gateway a este servicio. PostgreSQL y RabbitMQ están configurados por Compose, pero las URL validadas no prueban conexión ni persistencia de negocio.

## Configuración y ejecución

| Variable | Condición |
| --- | --- |
| `NODE_ENV` | `development` por defecto; admite `development`, `test`, `production`. |
| `PORT` | Puerto TCP válido; por defecto `3006`. |
| `DATABASE_URL` | Opcional; si se proporciona, debe ser URL válida. |
| `RABBITMQ_URL` | Opcional; si se proporciona, debe ser URL válida. |

Ejemplos locales: [`.env.example`](.env.example). Desde la raíz: `npm ci` y `npm run dev -w @vivu/support-service`; configurar explícitamente las variables necesarias para el entorno. Compose utiliza puerto `3006` y configura dependencias al iniciar.

## Calidad y mejoras

Adecuación funcional: no se evidencia aún una API de acompañamiento. Disponibilidad: readiness devuelve una respuesta fija sin comprobar dependencias. Mantenibilidad: hay pruebas unitarias para la configuración y salud, además de las pruebas de dominio cuando existen; no constituyen prueba de integración distribuida.

**Prioridad propuesta:** Definir alcance y autorización del dominio antes de implementarlo; incorporar comprobaciones reales de dependencias cuando existan. La evidencia y los escenarios transversales están en la [auditoría](../../docs/auditoria-arquitectura.md).
