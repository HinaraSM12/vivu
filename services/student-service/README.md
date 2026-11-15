# Contexto del estudiante — student-service

[Inicio](../../README.md) · [Auditoría y hallazgos compartidos](../../docs/auditoria-arquitectura.md)

## Propósito y estado

Consentimiento, retiro del consentimiento, perfil y preferencias de personalización. El repositorio conserva consentimientos, perfiles y preferencias en mapas del proceso. El gateway contiene una implementación independiente.

## Interfaces y dependencias

`GET/POST /me/consent`, `POST /me/consent/withdraw`, `GET/PUT /me/profile` y `/me/personalization-preferences`. Todos los servicios Node exponen además `GET /health` y `GET /ready`. Estas rutas son internas en Compose; no se ha identificado una conexión HTTP del gateway a este servicio. PostgreSQL y RabbitMQ están configurados por Compose, pero las URL validadas no prueban conexión ni persistencia de negocio.

## Configuración y ejecución

| Variable | Condición |
| --- | --- |
| `NODE_ENV` | `development` por defecto; admite `development`, `test`, `production`. |
| `PORT` | Puerto TCP válido; por defecto `3002`. |
| `DATABASE_URL` | Opcional; si se proporciona, debe ser URL válida. |
| `RABBITMQ_URL` | Opcional; si se proporciona, debe ser URL válida. |

Ejemplos locales: [`.env.example`](.env.example). Desde la raíz: `npm ci` y `npm run dev -w @vivu/student-service`; configurar explícitamente las variables necesarias para el entorno. Compose utiliza puerto `3002` y configura dependencias al iniciar.

## Calidad y mejoras

Seguridad: el consentimiento es una frontera funcional sensible; no se ha verificado su persistencia ni propagación entre procesos. Fiabilidad: el reinicio descarta el estado. Mantenibilidad: hay pruebas unitarias para la configuración y salud, además de las pruebas de dominio cuando existen; no constituyen prueba de integración distribuida.

**Prioridad propuesta:** Definir ownership y persistencia del consentimiento; verificar su aplicación en todos los consumidores y el retiro de datos. La evidencia y los escenarios transversales están en la [auditoría](../../docs/auditoria-arquitectura.md).
