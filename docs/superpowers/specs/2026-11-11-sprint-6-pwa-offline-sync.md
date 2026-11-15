# Especificación Técnica — Sprint 6: PWA Local-First y Sincronización Offline (`ADR-005`)

## 1. Objetivo del Sprint
Implementar la arquitectura local-first y sincronización diferida (`Outbox`, `SyncEngine`, recomendador determinista offline `OFFLINE_RULES` con paridad matemática `v1.0.0` frente a Python, endpoints `/api/v1/sync/{bootstrap,pull,actions}` en `@vivu/api-gateway` y pantalla `STU-21` con banner de conectividad en `@vivu/web`).

## 2. Reglas de Sincronización e Idempotencia (`ADR-005`)
- Cada mutación generada sin conexión se almacena en la cola `Outbox` con un `clientEventId` único.
- Al recuperar conexión, `POST /api/v1/sync/actions` procesa el lote de manera idempotente (`APPLIED` en primera recepción, `IDEMPOTENT_DUPLICATE` en reintentos).
- Mientras el dispositivo está `OFFLINE`, el motor local genera hasta 3 recomendaciones deterministas (`source = "OFFLINE_RULES"`, `ruleVersion = "1.0.0"`) sin invocar al LLM.
- Las operaciones administrativas (`ADMIN`) requieren conexión activa (`ONLINE`) y nunca se encolan en modo offline.

