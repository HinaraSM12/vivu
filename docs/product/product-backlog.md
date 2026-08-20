# Product Backlog V1

## Objetivo

Construir un prototipo web funcional preparado para evolucionar a PWA local-first para `STUDENT`, `FACILITATOR` y `ADMIN` que materialice misiones, progreso, modo recuperación, recomendaciones controladas con IA, recursos institucionales, microcuestionarios y analítica suficiente para la validación formativa y longitudinal.

## Priorización

- **P0 / Must:** imprescindible para considerar la V1 utilizable en piloto.
- **P1 / Should:** aporta valor claro y debe entrar si no compromete la estabilidad del piloto.
- **P2 / Could:** mejora o extensión no crítica.

## Épicas

| ID | Épica | Prioridad | Sprint objetivo | Resultado verificable |
|---|---|---:|---:|---|
| EP-00 | Foundation y DX | P0 | 0 | Monorepo, CI y entorno local reproducible. |
| EP-01 | Identidad y RBAC | P0 | 1 | Los tres roles se autentican y solo acceden a lo permitido. |
| EP-02 | Contexto y consentimiento del estudiante | P0 | 1 | Onboarding, perfil mínimo y consentimiento versionado. |
| EP-03 | Motor de ludificación | P0 | 2 | Catálogo, asignación, estados, progreso y logros personales. |
| EP-04 | Modo recuperación | P0 | 2 | Retorno de baja presión después de baja continuidad. |
| EP-05 | Recursos institucionales | P0 | 3 | Catálogo autorizado, vigente y consultable. |
| EP-06 | Recomendador V1 | P0 | 3 | Rules + scoring + LLM controlado con fallback y trazabilidad. |
| EP-07 | Facilitación | P0 | 4 | Asignaciones, seguimiento, notas y compromisos. |
| EP-08 | Administración | P0 | 5 | Configuración de usuarios, misiones, recursos, reglas y piloto. |
| EP-09 | Microcuestionarios | P0 | 5 | Instrumentos versionados y respuestas vinculables al piloto. |
| EP-10 | Analítica longitudinal | P0 | 5 | Métricas de adherencia, continuidad, misiones, recuperación y uso. |
| EP-11 | Privacidad, auditoría y exportación | P0 | 5-6 | Retiro, auditoría y exportación seudonimizada/anonimizada. |
| EP-12 | Hardening y pilot readiness | P0 | 6 | E2E, accesibilidad, fallos, seguridad y checklist de piloto. |
| EP-13 | PWA local-first y offline | P0 | 2-6 | STUDENT opera offline y sincroniza sin duplicados; FACILITATOR lectura cacheada; ADMIN online. |

## Backlog priorizado

| ID | Historia / trabajo | Pri. | Dependencias | Criterio de salida resumido |
|---|---|---:|---|---|
| PB-001 | Crear monorepo con npm Workspaces y estructura aprobada. | P0 | - | `npm install`, lint y build funcionan desde raíz. |
| PB-002 | Levantar PostgreSQL y RabbitMQ con Docker Compose. | P0 | PB-001 | Health checks verdes y datos persistentes en volumen local. |
| PB-003 | Crear API Gateway y health/readiness. | P0 | PB-001 | Gateway responde y propaga correlation ID. |
| PB-004 | Crear CI con lint, typecheck, test y build. | P0 | PB-001 | PR falla si cualquiera de los checks falla. |
| PB-005 | Implementar usuarios, login, JWT y refresh rotativo. | P0 | PB-003 | Sesión válida, expiración y rotación probadas. |
| PB-006 | Implementar roles STUDENT/FACILITATOR/ADMIN. | P0 | PB-005 | Pruebas allow/deny por rol. |
| PB-007 | Consentimiento versionado. | P0 | PB-005 | No se habilita tratamiento del piloto sin consentimiento vigente. |
| PB-008 | Onboarding y perfil básico del estudiante. | P0 | PB-006,007 | Perfil mínimo persistido y actualizable. |
| PB-009 | Catálogo y editor de plantillas de misión. | P0 | PB-006 | ADMIN crea, versiona, publica y desactiva misiones. |
| PB-010 | Asignación y estados de misión. | P0 | PB-008,009 | STUDENT acepta, inicia, pospone, descarta y completa. |
| PB-011 | Progreso personal y logros no competitivos. | P0 | PB-010 | Progreso se actualiza sin ranking público. |
| PB-012 | Continuidad semanal. | P0 | PB-010 | Estado de continuidad calculado de forma trazable. |
| PB-013 | Modo recuperación. | P0 | PB-012 | Ofrece acciones mínimas viables sin castigo. |
| PB-014 | Catálogo de recursos institucionales. | P0 | PB-006 | ADMIN gestiona recursos y STUDENT/FACILITATOR consultan autorizados. |
| PB-015 | Construir `RecommendationContext`. | P0 | PB-008,010,014 | Solo incluye datos permitidos y necesarios. |
| PB-016 | Hard rules de elegibilidad. | P0 | PB-015 | Recursos inactivos/no autorizados nunca son candidatos. |
| PB-017 | Scoring determinístico versionado. | P0 | PB-016 | Componentes y pesos quedan registrados por ejecución. |
| PB-018 | `LLMProvider` y explicación controlada. | P0 | PB-017 | Salida estructurada, validada y sin IDs inventados. |
| PB-019 | Fallback del recomendador sin LLM. | P0 | PB-017 | Recomendación sigue disponible si el proveedor falla. |
| PB-020 | Trazabilidad de recomendaciones. | P0 | PB-017,018 | Se registra versión de reglas, score, proveedor/modelo y resultado. |
| PB-021 | Asignación Facilitator-Student. | P0 | PB-006 | FACILITATOR solo ve asignados. |
| PB-022 | Vista de seguimiento de facilitador. | P0 | PB-021 | Muestra continuidad y actividad permitida, no etiquetas absolutas. |
| PB-023 | Notas y compromisos de acompañamiento. | P0 | PB-021 | Crear, actualizar y cerrar compromisos con auditoría. |
| PB-024 | Gestión ADMIN de usuarios y asignaciones. | P0 | PB-006,021 | Operaciones auditadas. |
| PB-025 | Gestión ADMIN de reglas/configuración del recomendador. | P0 | PB-017 | Cambios versionados y dentro de límites seguros. |
| PB-026 | Microcuestionarios versionados. | P0 | PB-006 | ADMIN publica y STUDENT responde versiones vigentes. |
| PB-027 | Eventos de dominio hacia RabbitMQ. | P0 | PB-002 | Envelope común, schemaVersion y correlationId. |
| PB-028 | Analytics consumer e idempotencia. | P0 | PB-027 | Un evento duplicado no duplica métricas. |
| PB-029 | Métricas longitudinales. | P0 | PB-028 | Hitos y métricas del estudio son calculables. |
| PB-030 | Exportación seudonimizada/anonimizada. | P0 | PB-029 | No incluye credenciales ni identificadores innecesarios. |
| PB-031 | Retiro de consentimiento. | P0 | PB-007 | Detiene nuevos tratamientos y deja trazabilidad de la solicitud. |
| PB-032 | Auditoría de acciones sensibles. | P0 | PB-006 | Configuración, roles, exportaciones y accesos sensibles auditados. |
| PB-033 | E2E Student principal. | P0 | PB-008,010,011 | onboarding -> misión -> progreso pasa en Playwright. |
| PB-034 | E2E recuperación. | P0 | PB-013 | baja continuidad -> recuperación -> misión mínima pasa. |
| PB-035 | E2E recomendación y recurso. | P0 | PB-018,019 | recomendación válida + explicación + recurso autorizado. |
| PB-036 | E2E Facilitator. | P0 | PB-022,023 | asignado -> nota -> compromiso pasa. |
| PB-037 | E2E Admin. | P0 | PB-024,025,026 | crear/configurar/publicar y observar efecto pasa. |
| PB-038 | Accesibilidad y estados UX críticos. | P0 | frontend funcional | Teclado, labels, loading, empty y error revisados. |
| PB-039 | Métricas técnicas mínimas. | P1 | PB-003 | latency/error count/backlog/recommendation latency visibles. |
| PB-040 | Feature flags simples administrables. | P1 | PB-024 | Activación controlada de funciones del piloto. |
| PB-041 | Notificaciones complejas. | P2 | evidencia de necesidad | No entra al núcleo V1 sin validación de carga/saturación. |
| PB-042 | Preparar arquitectura frontend para repositorios locales y sync. | P0 | PB-001 | Componentes no dependen directamente de conectividad permanente. |
| PB-043 | Implementar shell PWA instalable y actualización segura. | P0 | PB-042 | App abre shell sin red tras instalación. |
| PB-044 | IndexedDB versionado y bootstrap local. | P0 | PB-043, PB-008 | Datos mínimos del STUDENT persisten tras reload. |
| PB-045 | Outbox + `clientEventId` + replay idempotente de misiones. | P0 | PB-010, PB-044 | Completar misión offline sincroniza una sola vez. |
| PB-046 | Sync pull/cursor y actualización de catálogos. | P0 | PB-014, PB-044 | Recursos/misiones cambian localmente después de sync. |
| PB-047 | Resolución de conflictos de perfil/versiones. | P0 | PB-008, PB-045 | Conflicto concurrente no sobrescribe silenciosamente. |
| PB-048 | Surveys y recuperación offline. | P0 | PB-013, PB-026, PB-045 | Acciones persisten y sincronizan con versión/timestamp. |
| PB-049 | Motor TypeScript offline del recomendador. | P0 | PB-017, PB-044 | Genera `OFFLINE_RULES` sin red ni LLM. |
| PB-050 | Fixtures compartidos Python/TypeScript y gate de paridad. | P0 | PB-049 | CI falla ante divergencia de ranking/score. |
| PB-051 | UX de conectividad, pendientes y conflictos. | P0 | PB-045, PB-047 | Estados offline/sync son comprensibles y no alarmistas. |
| PB-052 | Cache FACILITATOR read-only y bloqueo ADMIN offline. | P0 | PB-022, PB-024, PB-044 | No hay escrituras de soporte/admin offline. |
| PB-053 | E2E PWA con red intermitente. | P0 | PB-043..052 | Flujos offline/reconexión pasan sin duplicados ni pérdida. |

## Definition of Ready

Una historia puede entrar a sprint cuando tiene: actor, objetivo, criterios de aceptación, datos necesarios, permisos, eventos relevantes, dependencias y diseño UX suficiente para implementarse sin inventar comportamiento.

## Definition of Done

Una historia está terminada cuando: implementación y migraciones están versionadas; pruebas unitarias/integración relevantes pasan; autorización está verificada; documentación/contrato se actualizó; logs no exponen datos indebidos; CI está verde; y el flujo puede demostrarse con datos de prueba.

## Trazabilidad

Este backlog materializa los productos esperados de la tesis: requisitos/backlog, prototipo funcional, casos de prueba, registros anonimizados y validación longitudinal. La tesis define como flujos esenciales perfil, misiones, progreso, recuperación, recomendaciones y eventos, y plantea un piloto pequeño de diez semanas.
