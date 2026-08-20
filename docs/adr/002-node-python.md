# ADR-002: Node/NestJS para negocio y Python/FastAPI para recomendaciones

**Estado:** Aceptado  
**Fecha:** 2026-08-19

## Contexto

El frontend y la mayoría del backend se construirán con TypeScript. El recomendador puede evolucionar hacia técnicas de ranking/ML y necesita integración flexible con herramientas de IA.

## Decisión

Usar Node.js + TypeScript + NestJS para gateway y servicios de negocio. Usar Python + FastAPI para `recommendation-service`.

## Consecuencias

- TypeScript mantiene coherencia en producto y dominios transaccionales.
- Python facilita experimentación/IA sin obligar al resto del sistema a usar Python.
- El repositorio debe soportar dos toolchains y CI para ambos.

## Restricción

La frontera HTTP/eventos debe impedir que SDKs o modelos Python se filtren a otros dominios.
