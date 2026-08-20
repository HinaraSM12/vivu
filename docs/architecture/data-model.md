# Modelo de datos lógico V1

## Principios

1. Ownership por servicio.
2. UUID como identificador de dominio.
3. Identidad directa separada de identificadores seudónimos usados en eventos/analítica.
4. Historial/versionado para consentimiento, reglas, misiones y configuración del recomendador.
5. Borrado/desactivación no debe destruir trazabilidad histórica necesaria para el estudio.

## identity-service

### users
- `id: uuid` PK
- `email: varchar` único para autenticación local del piloto
- `password_hash: text`
- `status: active|disabled|locked`
- `created_at`, `updated_at`

### roles
- `id`
- `code: STUDENT|FACILITATOR|ADMIN`

### user_roles
- `user_id`
- `role_id`
- `assigned_at`
- `assigned_by`

### refresh_sessions
- `id`, `user_id`, `token_hash`, `expires_at`, `revoked_at`, `rotated_from`

## student-service

### student_profiles
- `student_id: uuid` PK, referencia lógica al usuario
- `analytics_subject_id: uuid` seudónimo estable para analítica
- `engineering_program`
- `semester`
- `perceived_load`
- `difficult_subjects: jsonb`
- `weekly_availability_minutes`
- `external_responsibilities: jsonb`
- `study_practices: jsonb`
- `interests: jsonb`
- `wellbeing_inputs: jsonb nullable` solo si están autorizados
- `updated_at`

### consent_records
- `id`, `student_id`, `consent_version`, `status`, `accepted_at`, `withdrawn_at`

### personalization_preferences
- `student_id`, `allow_personalization`, `allow_optional_wellbeing_context`, `preferred_tone`, `updated_at`

## gamification-service

### mission_templates
- `id`, `code`, `status`, `category`, `current_version`, `created_by`

### mission_template_versions
- `id`, `mission_id`, `version`, `title`, `description`, `estimated_minutes`, `difficulty`, `eligibility_rules: jsonb`, `completion_rules: jsonb`, `published_at`

### mission_assignments
- `id`, `student_id`, `mission_id`, `mission_version`, `source: recommendation|manual|recovery`, `status`, `assigned_at`, `accepted_at`, `completed_at`, `discarded_at`

### mission_state_history
- `id`, `assignment_id`, `from_state`, `to_state`, `occurred_at`, `reason`

### progress_state
- `student_id`, `level`, `progress_points`, `continuity_state`, `updated_at`

### achievements
- `id`, `student_id`, `achievement_code`, `earned_at`

### recovery_state
- `student_id`, `status`, `activated_at`, `ended_at`, `reason_code`

## resource-service

### institutional_resources
- `id`, `name`, `category_id`, `description`, `url_or_contact`, `status`, `valid_from`, `valid_until`, `source_note`, `last_verified_at`

### resource_categories
- `id`, `code`, `name`

### availability_rules
- `id`, `resource_id`, `rule_json`, `active`

## recommendation-service

### ai_config_versions
- `id`, `version`, `weights_json`, `limits_json`, `created_by`, `created_at`, `active`

### recommendation_runs
- `id`, `student_id_pseudonymous`, `context_hash`, `config_version`, `policy_version`, `provider`, `model`, `prompt_version`, `started_at`, `completed_at`, `status`, `fallback_used`

### recommendation_items
- `id`, `run_id`, `candidate_type`, `candidate_id`, `rank`, `final_score`, `selected`, `explanation`

### score_components
- `id`, `item_id`, `need_fit`, `time_fit`, `difficulty_fit`, `continuity_fit`, `resource_fit`, `diversity_fit`

## survey-service

### survey_definitions / survey_versions / survey_questions
Versionan instrumentos para poder saber exactamente qué respondió cada participante.

### survey_responses / survey_answers
No duplicar respuestas ante reintentos; usar una clave idempotente por estudiante, versión y ventana de aplicación.

## support-service

### facilitator_assignments
- `id`, `facilitator_id`, `student_id`, `status`, `assigned_at`, `ended_at`, `assigned_by`

### support_notes
- `id`, `assignment_id`, `author_id`, `note_text`, `created_at`, `visibility`

### commitments
- `id`, `assignment_id`, `description`, `status`, `due_at nullable`, `created_at`, `closed_at`

## analytics-service

### processed_events
- `event_id` PK, `event_type`, `processed_at`

### event_facts
Persistencia analítica seudonimizada de hechos estrictamente necesarios.

### weekly_metrics
- `subject_id`, `week_index`, `meaningful_interactions`, `missions_accepted`, `missions_completed`, `recovery_activations`, `resources_viewed`, `survey_submitted`

### export_jobs
- `id`, `requested_by`, `scope`, `requested_at`, `completed_at`, `status`, `artifact_hash`

## Clasificación de datos

| Clase | Ejemplos | Tratamiento |
|---|---|---|
| Identidad | email, user_id | Acceso restringido; no va a exports de análisis por defecto. |
| Contexto académico autorreportado | programa, semestre, dificultad | Minimizar y usar solo para funciones aprobadas. |
| Contexto personal opcional | responsabilidades, bienestar | Solo si es necesario y existe consentimiento correspondiente. |
| Interacción | misiones, recursos, recuperación | Seudonimizar para analítica. |
| Acompañamiento | notas/compromisos | Acceso por asignación; no usar para recomendaciones salvo decisión posterior aprobada. |
| Auditoría | actor, acción, timestamp | Retención definida por política del piloto; acceso ADMIN restringido. |


## Persistencia local PWA

IndexedDB no forma parte del modelo transaccional del servidor, pero tiene un esquema versionado propio. Stores conceptuales:

- `meta`: schemaVersion, syncCursor, lastSuccessfulSyncAt, catalogVersions.
- `student_profile_cache`: réplica mínima del perfil permitido.
- `mission_catalog_cache`: plantillas/versiones recibidas.
- `mission_assignment_cache`: asignaciones y estado local.
- `progress_cache`: progreso visible.
- `resource_cache`: recursos autorizados previamente sincronizados.
- `survey_cache`: instrumentos/versiones disponibles.
- `recommendation_cache`: recomendaciones y su `source`.
- `recommendation_config_cache`: última configuración válida de rules/scoring.
- `outbox`: comandos pendientes con `clientEventId`.
- `sync_conflicts`: conflictos que requieren resolución.

No replicar email, hashes, credenciales ni notas de facilitador para el flujo STUDENT. Los caches deben incluir versión y timestamps de sincronización.
