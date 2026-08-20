# Paquete de documentación técnica

Este paquete convierte la **Especificación Técnica Maestra** en artefactos listos para guiar diseño, implementación y trabajo con asistentes de IA.

## Orden de lectura obligatorio para una IA

1. `docs/00-master-spec.md`
2. `docs/adr/001-microservices.md` a `005-pwa-local-first-offline.md`
3. `docs/product/product-backlog.md`
4. El documento específico del subsistema que se va a modificar.
5. El plan de implementación correspondiente, si existe.

## Regla de cambio

Las decisiones marcadas como **FIJAS** en `docs/00-master-spec.md` no se cambian silenciosamente. Un cambio arquitectónico relevante requiere un nuevo ADR que deje constancia de contexto, decisión, consecuencias y plan de migración.

## Atajos

- `PROMPT_CREAR_REPO_PWA_READY.md`: prompt listo para entregar a la IA que creará el repo.
- `CHANGELOG_PWA_V2.md`: resumen de cambios de esta versión.

## Índice

### Producto
- `docs/product/product-backlog.md`
- `docs/product/user-stories.md`
- `docs/product/acceptance-criteria.md`

### Arquitectura
- `docs/architecture/architecture.md`
- `docs/architecture/services.md`
- `docs/architecture/data-model.md`
- `docs/architecture/event-catalog.md`
- `docs/architecture/api-contracts.md`
- `docs/architecture/repository-spec.md`
- `docs/architecture/pwa-offline-sync.md`

### IA
- `docs/ai/recommender-v1.md`
- `docs/ai/llm-policy.md`
- `docs/ai/evaluation.md`

### UX / Figma
- `docs/ux/figma-spec.md`
- `docs/ux/sitemap.md`
- `docs/ux/user-flows.md`

### Seguridad y privacidad
- `docs/security/privacy-and-consent.md`
- `docs/security/access-control.md`

### Testing y analítica
- `docs/testing/test-strategy.md`
- `docs/testing/analytics-events.md`

### ADR
- `docs/adr/001-microservices.md`
- `docs/adr/002-node-python.md`
- `docs/adr/003-rabbitmq.md`
- `docs/adr/004-database-per-service.md`
- `docs/adr/005-pwa-local-first-offline.md`

### Planes de implementación
- `docs/superpowers/plans/2026-08-19-sprint-0-foundation.md`
- `docs/superpowers/plans/2026-08-19-pwa-offline-sync.md`

## Fuentes del proyecto

- `PROYECTO_DE_TESIS_HINARA_SANCHEZ (2).docx`: alcance, estrategia de ludificación, ética, personalización mediante IA, modo recuperación y validación longitudinal.
- `Versión 2_Marco arquitectónico para plataformas de acompañamiento estudiantil_ integración de ludificación e inteligencia artificial desde el diseño de software (1).docx`: separación de responsabilidades, asincronía, broker de eventos, motor de ludificación, IA y persistencia.

## Decisión PWA aprobada

La evolución objetivo del frontend es una **PWA local-first**. `STUDENT` tendrá operación offline completa sobre datos previamente sincronizados; `FACILITATOR` tendrá lectura cacheada limitada y operaciones de acompañamiento online; `ADMIN` requiere conexión para mutaciones administrativas. El recomendador offline usa hard rules + scoring TypeScript con la misma configuración versionada del motor Python; el LLM solo participa online. Ver `docs/architecture/pwa-offline-sync.md` y ADR-005.
