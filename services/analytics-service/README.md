# Analítica — analytics-service

[Inicio](../../README.md) · [Auditoría y hallazgos compartidos](../../docs/auditoria-arquitectura.md)

## Propósito y estado

Actualmente solo ofrece endpoints de salud; la analítica es una responsabilidad prevista. El módulo registra únicamente configuración y controlador de salud; no se observa procesamiento de eventos de negocio.

## Interfaces y dependencias

`GET /health` y `GET /ready`. Todos los servicios Node exponen además `GET /health` y `GET /ready`. Estas rutas son internas en Compose; no se ha identificado una conexión HTTP del gateway a este servicio. PostgreSQL y RabbitMQ están configurados por Compose, pero las URL validadas no prueban conexión ni persistencia de negocio.

## Configuración y ejecución

| Variable | Condición |
| --- | --- |
| `NODE_ENV` | `development` por defecto; admite `development`, `test`, `production`. |
| `PORT` | Puerto TCP válido; por defecto `3007`. |
| `DATABASE_URL` | Opcional; si se proporciona, debe ser URL válida. |
| `RABBITMQ_URL` | Opcional; si se proporciona, debe ser URL válida. |

Ejemplos locales: [`.env.example`](.env.example). Desde la raíz: `npm ci` y `npm run dev -w @vivu/analytics-service`; configurar explícitamente las variables necesarias para el entorno. Compose utiliza puerto `3007` y configura dependencias al iniciar.

## Calidad y mejoras

Adecuación funcional: no se evidencia agregación ni exportación en este servicio. Privacidad: cualquier futura analítica necesita reglas de minimización y acceso. Mantenibilidad: hay pruebas unitarias para la configuración y salud, además de las pruebas de dominio cuando existen; no constituyen prueba de integración distribuida.

**Prioridad propuesta:** Definir métricas y contratos de eventos, minimización y retención; implementar y probar el flujo antes de afirmar disponibilidad analítica. La evidencia y los escenarios transversales están en la [auditoría](../../docs/auditoria-arquitectura.md).
