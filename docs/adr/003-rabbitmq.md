# ADR-003: RabbitMQ como broker de eventos V1

**Estado:** Aceptado  
**Fecha:** 2026-08-19

## Contexto

El sistema necesita analítica y propagación asíncrona sin bloquear operaciones de usuario. El volumen del piloto es pequeño y no justifica infraestructura de streaming más compleja.

## Decisión

Usar RabbitMQ para eventos de dominio y procesamiento asíncrono V1.

## Consecuencias

- desacopla analytics y procesos secundarios;
- permite retry/DLQ;
- requiere idempotencia, versionado de mensajes y observabilidad del backlog.

## No decisión

No se adopta Kafka ni service mesh en V1. Un cambio futuro requerirá ADR y evidencia de necesidad.
