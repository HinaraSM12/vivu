# Auditoría arquitectónica de Vivu (Actualización Post-Sprint 9 y Remediación A1–A7)

**Corte:** código base `c0286cb` + remediación `A1–A7`, 18 de noviembre de 2026 (Sprints 0 al 9 completados). **Alcance:** revisión estática y verificación automatizada del monorepo, contratos (`@vivu/contracts`), configuración, pruebas unitarias/E2E y documentación. Se trata de una evaluación técnica verificable para el piloto longitudinal exploratorio, no de una certificación ISO formal ni de una medición de carga masiva en producción.

## Método y contexto

Se utiliza [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html), modelo de calidad de producto de la familia SQuaRE, como referencia para organizar atributos, y [Software Architecture in Practice, cuarta edición](https://insights.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) (Bass, Clements y Kazman, 2021) para analizar componentes, conectores, escenarios y compromisos.

Las prioridades expresan juicio arquitectónico: **P0** antes de uso compartido con datos reales; **P1** antes de ampliar el piloto; **P2** evolución posterior. Todos los hallazgos identificados en el corte preliminar (`4b330ad`, Sprint 5) han sido remediados o cubiertos por pruebas automatizadas tras completar los Sprints 6 a 9.

## Arquitectura observada y evolución Sprints 6–9

- **Sprints 0–5 (`4b330ad`):** Fundación, identidad, consentimiento/perfil, ludificación, recursos/encuestas/recuperación y recomendador híbrido (`@vivu/recommendation-service` en Python/FastAPI).
- **Sprint 6 (`7c7ac0b`):** PWA local-first (`ADR-005`), cola `Outbox`, paridad matemática `OFFLINE_RULES` (TypeScript) vs `ONLINE_RULES` (Python) e idempotencia por `clientEventId` en `/api/v1/sync/{bootstrap,pull,actions}`.
- **Sprint 7 (`265d2a3`):** Implementación completa de `@vivu/support-service` (acompañamiento del facilitador, aislamiento por cohorte `403 FACILITATOR_STUDENT_NOT_ASSIGNED`, lenguaje no estigmatizante, notas y acuerdos compartidos).
- **Sprint 8 (`aba2508`):** Operaciones administrativas online-only (`ADR-003`, `ADR-005`), validación de suma de pesos (`1.00`), bloqueo `409 ADMIN_OFFLINE_MUTATION_FORBIDDEN`, bitácora de auditoría y exportación anonimizada con `containsPii: false`.
- **Sprint 9 (`c0286cb`):** Implementación completa de `@vivu/analytics-service` con los 16 eventos canónicos seudonimizados (`schemaVersion: "1.0.0"`), KPIs longitudinales (semanas 1, 4 y 10), KPIs de recomendaciones, QoE (ISO 9241-11/210), QoS, calidad del componente LLM (`groundednessRate = 1.0`, `hallucinationCount = 0`) y checklist de alistamiento del piloto.
- **Remediación Post-Sprint 9 (`A1–A7`):** Persistencia duradera de snapshots (`GatewayJsonSnapshotStore` con `VIVU_STATE_SNAPSHOT_PATH`), validación fail-fast de secretos JWT en producción (`resolveGatewayJwtSecret`, `resolveServiceJwtSecret`) y desactivación de seeds demo en producción (`shouldSeedGatewayDemoAccounts`), diagnóstico estructurado en `/ready` y propagación transversal del retiro de consentimiento hacia recomendaciones y analítica (`test/audit-hardening.e2e-spec.ts`).

## Estado de Hallazgos (`A1–A7`)

| ID | Prioridad y atributos | Hallazgo original (corte `4b330ad`) | Estado actual y evidencia verificada |
| --- | --- | --- | --- |
| A1 | P0 · fiabilidad, integridad | Estado únicamente en memoria; reiniciar el proceso perdía misiones completadas o progreso. | **Remediado para el piloto:** `GatewayJsonSnapshotStore` ([`json-snapshot.store.ts`](../apps/api-gateway/src/common/persistence/json-snapshot.store.ts)) persiste misiones completadas, retiros de consentimiento y `clientEventId` en `VIVU_STATE_SNAPSHOT_PATH` y los restaura tras reinicio, verificado en [`audit-hardening.e2e-spec.ts`](../apps/api-gateway/test/audit-hardening.e2e-spec.ts). |
| A2 | P0 · seguridad | Secretos JWT por defecto, discrepancia `JWT_ACCESS_SECRET` vs `JWT_SECRET` y cuentas seed cargadas siempre. | **Remediado:** `.env.example`, [`GatewayAuthService`](../apps/api-gateway/src/auth/gateway-auth.service.ts) y [`TokenService`](../services/identity-service/src/auth/token.service.ts) aceptan `JWT_ACCESS_SECRET`/`JWT_SECRET`, fallan en `NODE_ENV=production` ante secretos débiles o `_dev_only` (`PRODUCTION_JWT_SECRET_INVALID`) y desactivan cuentas seed en producción salvo `ENABLE_SEED_DEMO_ACCOUNTS=true`. |
| A3 | P1 · compatibilidad, mantenibilidad | Implementaciones paralelas entre web, gateway y servicios. | **Mitigado con paridad verificada:** `@vivu/contracts` centraliza los contratos y pruebas de paridad matemática (`evaluateOfflineRuleRecommendationParity`, `validateRecommenderWeightsSum`, `findForbiddenPiiKeysInExport`). |
| A4 | P1 · fiabilidad, observabilidad | `/ready` devolvía una constante fija sin inspeccionar configuración ni almacenamiento. | **Remediado:** [`HealthController.ready()`](../apps/api-gateway/src/health/health.controller.ts) devuelve diagnósticos estructurados (`checks.authSecretConfigured`, `checks.persistenceStoreReady`, `checks.domainServicesReady`, `checks.canonicalEventCatalogReady`). |
| A5 | P1 · privacidad, adecuación funcional | El retiro de consentimiento no demostraba propagación hacia recomendaciones y analítica. | **Remediado:** `POST /api/v1/me/consent/withdraw` ([`student-gateway.controller.ts`](../apps/api-gateway/src/student/student-gateway.controller.ts)) desactiva personalización, limpia `wellbeingInputs`, purga recomendaciones personalizadas (`purgeForWithdrawnConsent`), fuerza fallback `ONLINE_RULES` y emite `consent.updated.v1`. |
| A6 | P1 · adecuación funcional | `support-service` y `analytics-service` solo exponían `/health` en el corte Sprint 5. | **Remediado en Sprints 7 y 9:** [`@vivu/support-service`](../services/support-service/src/support/support.service.ts) y [`@vivu/analytics-service`](../services/analytics-service/src/analytics/analytics.service.ts) implementan lógica de negocio completa y pruebas unitarias/E2E. |
| A7 | P2 · interoperabilidad, mantenibilidad | Catálogo de eventos documentado sin flujo integrado hacia analítica en el gateway. | **Remediado para el piloto:** Los 16 eventos canónicos (`CANONICAL_TELEMETRY_EVENT_NAMES`) están tipados en `@vivu/contracts`, validados contra PII en `AnalyticsService` / `GatewayAnalyticsService` y conectados con flujos de dominio. |

[Informe visual actualizado](informe-auditoria.html).
