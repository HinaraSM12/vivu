# Catálogo de servicios

## api-gateway

**Responsabilidad:** punto de entrada HTTP, validación superficial, autenticación de token, autorización coarse-grained, rate limiting, correlation ID y routing.

**No debe:** contener reglas de dominio ni acceder a tablas de otros servicios. Puede coordinar `sync/bootstrap`, `sync/pull` y `sync/actions`, pero cada microservicio dueño sigue validando/aplicando el comando.

**Dependencias:** identity para flujos de sesión; resto de servicios por HTTP.

## identity-service

**Responsabilidad:** usuarios, credenciales, roles, refresh sessions.

**Owned data:** `users`, `roles`, `user_roles`, `refresh_sessions`.

**Publica:** `user.registered.v1`, `user.role_changed.v1`.

**Notas:** ADMIN inicial por seed seguro; preparar futura sustitución por SSO.

## student-service

**Responsabilidad:** perfil mínimo, consentimientos y preferencias de personalización.

**Owned data:** `student_profiles`, `consent_records`, `personalization_preferences`.

**Publica:** `consent.updated.v1`, `student.profile_updated.v1`.

**Invariante:** no almacenar datos no requeridos por el alcance aprobado.

## gamification-service

**Responsabilidad:** plantillas/asignaciones de misión, estado, progreso, logros personales, continuidad y recuperación.

**Owned data:** `mission_templates`, `mission_template_versions`, `mission_assignments`, `mission_state_history`, `progress_state`, `achievements`, `recovery_state`.

**Publica:** `mission.assigned.v1`, `mission.accepted.v1`, `mission.completed.v1`, `mission.skipped.v1`, `recovery.activated.v1`.

**Invariante:** reglas de ludificación viven en backend y son auditables/versionadas.

## resource-service

**Responsabilidad:** catálogo de apoyos institucionales autorizados, categorías, vigencia y reglas de disponibilidad.

**Owned data:** `institutional_resources`, `resource_categories`, `availability_rules`.

**Publica:** `resource.viewed.v1`; opcionalmente `resource.updated.v1` para invalidar caches.

**Invariante:** un recurso inactivo no puede ser candidato de recomendación.

## recommendation-service

**Tecnología:** Python + FastAPI.

**Responsabilidad:** construir contexto normalizado, aplicar hard rules, scoring, `LLMProvider`, validación posterior, explicación, fallback y trazabilidad.

**Owned data:** `recommendation_runs`, `recommendation_items`, `score_components`, `ai_config_versions`, `prompt_policy_versions`.

**Publica:** `recommendation.generated.v1`.

**Invariante:** el LLM nunca puede saltarse hard rules ni inventar IDs.

## survey-service

**Responsabilidad:** definiciones/versiones de microcuestionarios y respuestas.

**Owned data:** `survey_definitions`, `survey_versions`, `survey_questions`, `survey_responses`, `survey_answers`.

**Publica:** `survey.submitted.v1`.

## support-service

**Responsabilidad:** asignación facilitador-estudiante, notas y compromisos.

**Owned data:** `facilitator_assignments`, `support_notes`, `commitments`.

**Publica:** `facilitator.note_created.v1`, `commitment.updated.v1`.

**Invariante:** acceso requiere asignación activa o privilegio ADMIN explícito.

## analytics-service

**Responsabilidad:** consumir hechos, construir métricas longitudinales, dashboards y exportaciones.

**Owned data:** `processed_events`, `event_facts`, `weekly_metrics`, `pilot_snapshots`, `export_jobs`, `audit_views`.

**Consume:** eventos de dominio definidos en `event-catalog.md`.

**Invariante:** un evento con `eventId` ya procesado no vuelve a impactar métricas.

## Dependencias permitidas

- `recommendation-service` puede consultar Student, Gamification, Resources y Survey mediante contratos internos o recibir un contexto agregado desde una capa orquestadora definida; nunca consulta directamente sus bases.
- `analytics-service` consume eventos y ofrece APIs de lectura; no debe convertirse en fuente transaccional del dominio.
- `support-service` puede consultar Resources para mostrar orientación, sin copiar datos innecesarios.

## Capa cliente PWA (no es microservicio)

`apps/web` incluye repositorios locales, IndexedDB, outbox, Sync Engine y motor determinístico offline. Esta capa no posee autoridad global ni accede a bases de servicios. Usa contratos versionados y solo sincroniza mediante el API Gateway.
