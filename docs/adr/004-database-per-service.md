# ADR-004: Ownership de datos por servicio

**Estado:** Aceptado  
**Fecha:** 2026-08-19

## Contexto

Los microservicios pierden autonomía si comparten tablas o realizan joins directos entre dominios. Al mismo tiempo, el piloto no necesita múltiples servidores PostgreSQL físicos.

## Decisión

Cada servicio posee sus tablas, migraciones y credenciales. V1 puede usar un único servidor PostgreSQL con bases/esquemas separados. El acceso entre dominios ocurre por API o eventos, nunca por join directo.

## Consecuencias

- límites y evolución más claros;
- mayor duplicación controlada de vistas/read models;
- consultas agregadas pertenecen a analytics o composición de API, no a SQL cross-domain.

## Regla de revisión

Una necesidad que parezca requerir join directo debe revisarse primero como contrato/evento/read model; no se concede excepción informal.
