# Cambios del paquete v2 - PWA local-first

## Decisiones incorporadas

- PWA local-first como objetivo de frontend.
- STUDENT: operación offline completa sobre datos previamente sincronizados.
- FACILITATOR: lectura cacheada limitada; escrituras de acompañamiento online.
- ADMIN: mutaciones online obligatorias.
- IndexedDB para persistencia de dominio offline.
- Service Worker/Cache Storage para app shell y activos seguros.
- Outbox con `clientEventId` estable, replay idempotente y conflictos por dominio.
- API Gateway como coordinador de `sync/bootstrap`, `sync/pull` y `sync/actions`; no se añade microservicio de sync.
- Recomendador offline: rules + scoring determinístico TypeScript.
- Configuración versionada compartida entre motor Python y TypeScript.
- Fixtures compartidos y gate de paridad en CI.
- LLM solo online; no LLM local/WebGPU.
- Trazabilidad `OFFLINE_RULES | ONLINE_RULES | ONLINE_AI`.

## Documentos nuevos

- `docs/adr/005-pwa-local-first-offline.md`
- `docs/architecture/pwa-offline-sync.md`
- `docs/superpowers/plans/2026-08-19-pwa-offline-sync.md`
- `PROMPT_CREAR_REPO_PWA_READY.md`

## Documentos actualizados

Master spec, arquitectura, servicios, datos, APIs, eventos, repo spec, recomendador, política LLM, evaluación, backlog, historias, criterios de aceptación, seguridad, testing, analítica, Figma, sitemap, user flows y Sprint 0.
