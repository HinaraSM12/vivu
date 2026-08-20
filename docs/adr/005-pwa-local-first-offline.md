# ADR-005: PWA local-first con sincronización offline

**Estado:** Aceptado  
**Fecha:** 2026-08-19

## Contexto

El prototipo debe evolucionar a una PWA y el usuario aprobó un objetivo de **operación offline completa para STUDENT**. El recomendador online usa Python/FastAPI y un LLM opcional, por lo que se requiere un mecanismo de degradación offline que no dependa de conectividad ni replique un LLM en el dispositivo.

## Decisión

1. `apps/web` evolucionará a una PWA **local-first**.
2. STUDENT podrá operar offline sobre los flujos principales previamente sincronizados: misiones, progreso local, recuperación, recursos cacheados, microcuestionarios y cambios permitidos de perfil.
3. FACILITATOR será principalmente online; podrá consultar cache de lectura limitado, pero no crear notas/compromisos offline.
4. ADMIN requiere conexión para operaciones administrativas.
5. IndexedDB será la persistencia de datos de dominio offline; Cache Storage se usa para app shell/activos, no como almacén general de datos autenticados.
6. Se implementará una outbox con `clientEventId` estable e idempotencia end-to-end.
7. El API Gateway tendrá un módulo de coordinación de sincronización; no se crea un `sync-service` separado en esta etapa.
8. Los conflictos se resuelven por dominio; no se adopta `last-write-wins` global.
9. El recomendador offline ejecutará hard rules + scoring determinístico en TypeScript usando la misma configuración versionada que el motor Python.
10. No se ejecutará un LLM local. El LLM solo participa online y nunca es requisito para las funciones esenciales.
11. CI tendrá fixtures compartidos para verificar paridad de scoring Python/TypeScript.

## Consecuencias positivas

- El estudiante puede continuar durante cortes de conectividad.
- La experiencia no depende del proveedor LLM.
- Se conserva trazabilidad de acciones realizadas offline.
- Los microservicios siguen siendo la autoridad definitiva de sus dominios.
- La decisión puede implementarse gradualmente sin crear un servicio adicional.

## Costos y riesgos

- Mayor complejidad del frontend: versionado local, outbox, conflictos y migraciones IndexedDB.
- Se requieren pruebas E2E con red intermitente.
- Se debe evitar almacenar datos innecesarios en dispositivo.
- Una cuenta revocada o consentimiento retirado en otro dispositivo solo puede detectarse al recuperar conexión; por eso el acceso offline tendrá una ventana máxima configurable antes del piloto.

## Alternativas descartadas

### PWA principalmente online
Más simple, pero no cumple el objetivo aprobado de operación offline completa para STUDENT.

### LLM local/WebGPU
Aumenta peso, requisitos de hardware, consumo y superficie de privacidad. No es necesario para la tesis ni para la función de recomendación offline.

### Microservicio de sincronización dedicado
Añade complejidad y un nuevo ownership sin necesidad demostrada. El gateway puede coordinar y cada microservicio sigue validando/aplicando sus comandos.

## Documentos vinculados

- `docs/architecture/pwa-offline-sync.md`
- `docs/ai/recommender-v1.md`
- `docs/testing/test-strategy.md`
