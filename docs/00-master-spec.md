# Especificación Técnica Maestra
## Plataforma de ludificación e inteligencia artificial para apoyo a la autorregulación académica

**Versión:** 1.1  
**Fecha:** 2026-08-19  
**Estado:** Base aprobada para continuar diseño e implementación  
**Uso principal:** fuente de verdad para desarrolladores y asistentes de IA que continúen el proyecto.

> **Regla de continuidad:** una IA que reciba este documento debe conservar las decisiones marcadas como **FIJAS**. Si necesita cambiarlas, debe explicar el motivo y pedir aprobación explícita antes de modificar arquitectura, roles, alcance o principios éticos.

---

# 1. Propósito y contexto

El proyecto implementará un prototipo funcional de una plataforma de ludificación con inteligencia artificial para apoyar acciones de autorregulación académica en estudiantes de ingeniería de la Facultad de Minas de la Universidad Nacional de Colombia, sede Medellín.

La plataforma debe convertir necesidades y señales del contexto del estudiante en acciones concretas y realizables: misiones, progreso, retroalimentación, modo recuperación y recomendaciones de recursos institucionales. La inteligencia artificial es un componente instrumental para personalizar o adaptar recomendaciones; no reemplaza la autonomía del estudiante ni constituye una decisión académica automatizada.

La primera versión se construirá como un prototipo funcional completo para tres tipos de usuario: **Student**, **Facilitator** y **Admin**. Aunque la validación de tesis se concentra en un piloto controlado, la arquitectura se diseñará para evolucionar posteriormente hacia una plataforma institucional más amplia.

## 1.1 Jerarquía de fuentes para futuras decisiones

1. **Decisiones explícitas del usuario incorporadas en esta especificación.**
2. **Alcance, ética y objetivos del proyecto de tesis.**
3. **Marco arquitectónico de ludificación e inteligencia artificial.**
4. **Decisiones técnicas de implementación de esta especificación.**
5. Nuevas propuestas de una IA o desarrollador, solo después de verificar que no contradicen los puntos 1-4.

# 2. Decisiones fijas

| Área | Decisión FIJA |
|---|---|
| Alcance arquitectónico | Microservicios desde V1. |
| Frontend | React + TypeScript + Vite, preparado para evolucionar a PWA local-first. |
| Gestor JavaScript | npm con npm Workspaces. No se requiere pnpm ni Turborepo inicialmente. |
| Backend de negocio | Node.js + TypeScript + NestJS. |
| Recomendador / IA | Microservicio separado en Python + FastAPI. |
| Base de datos | PostgreSQL. Propiedad de datos por servicio; no se permiten consultas directas entre dominios. |
| Mensajería | RabbitMQ para eventos asíncronos. |
| Desarrollo local | Docker Compose. |
| API | HTTP/REST + OpenAPI para operaciones síncronas; RabbitMQ para eventos. |
| Roles funcionales | STUDENT, FACILITATOR, ADMIN. No existe RESEARCHER. Las funciones de operación del piloto corresponden a ADMIN. |
| Filosofía IA | Rules + scoring determinístico + LLM controlado. El LLM no es el recomendador completo. |
| Proveedor LLM | Abstraído mediante interfaz `LLMProvider`; proveedor/modelo quedan abiertos. |
| Ludificación | Las reglas se ejecutan en backend, no en componentes React. |
| Privacidad | Minimización de datos, consentimiento, control de acceso, trazabilidad, seudonimización/anonimización para análisis. |
| UX motivacional | Progreso individual, autonomía, metas alcanzables y recuperación; sin rankings públicos ni comparación competitiva obligatoria. |
| PWA / offline | Objetivo aprobado: PWA local-first. STUDENT con operación offline completa sobre datos sincronizados; FACILITATOR con lectura cacheada limitada; ADMIN online para mutaciones. |
| Persistencia cliente | IndexedDB para datos de dominio offline; Cache Storage solo para app shell/activos seguros. |
| Sincronización | Outbox + `clientEventId` estable + idempotencia end-to-end + resolución de conflictos por dominio. |
| IA offline | Hard rules + scoring determinístico en TypeScript con configuración versionada compartida con Python. Sin LLM local. |
| Tooling PWA | `vite-plugin-pwa` para integración PWA y `idb` como wrapper de IndexedDB. Cambiar estas dependencias requiere justificarlo en ADR. |

# 3. Alcance funcional V1

## 3.1 STUDENT

El estudiante es el usuario principal del sistema.

Funciones V1:

- Registro/inicio de sesión y aceptación de consentimiento.
- Onboarding y perfil básico actualizable.
- Registro de programa, semestre, disponibilidad, carga percibida, materias de dificultad, prácticas de estudio y preferencias relevantes.
- Dashboard semanal.
- Visualización de misiones recomendadas y disponibles.
- Aceptar, iniciar, posponer y completar misiones.
- Visualizar progreso personal, niveles/logros personales y continuidad.
- Activar o recibir propuesta de **modo recuperación** después de periodos de baja continuidad.
- Consultar recomendaciones personalizadas con explicación legible.
- Consultar recursos institucionales autorizados.
- Responder microcuestionarios breves de seguimiento.
- Consultar y modificar preferencias de personalización y privacidad permitidas.
- Retirar consentimiento y solicitar cierre de participación según el flujo definido para el piloto.
- Usar los flujos esenciales previamente sincronizados sin conexión: consultar/gestionar misiones, progreso local, recuperación, recursos cacheados, microcuestionarios y recomendaciones determinísticas offline.
- Ver el estado de sincronización de sus acciones sin mensajes alarmistas.

## 3.2 FACILITATOR

El facilitador/tutor acompaña participantes asignados y no administra la configuración global.

Funciones V1:

- Inicio de sesión con rol FACILITATOR.
- Listado únicamente de estudiantes asignados.
- Vista de seguimiento por estudiante con información limitada y pertinente.
- Señales de continuidad como: activo, baja continuidad, recuperación activada o seguimiento pendiente.
- Historial resumido de misiones, uso de recursos y microcuestionarios cuando el consentimiento lo permita.
- Registro de notas de acompañamiento y compromisos.
- Cierre o actualización de compromisos.
- Consulta de recursos institucionales para orientar al estudiante.
- Sin permisos para modificar reglas de ludificación, configuración IA, usuarios globales o catálogo institucional.
- Sin etiquetas públicas o absolutas de “alto riesgo”.
- Puede consultar un cache de lectura limitado cuando no haya conexión, pero notas y compromisos requieren conexión para escribirse.

## 3.3 ADMIN

ADMIN agrupa administración de plataforma y operación del prototipo/piloto.

Funciones V1:

- Gestión de usuarios y estados de cuenta.
- Asignación de estudiantes a facilitadores.
- Gestión del catálogo de misiones.
- Gestión de categorías, dificultad, duración, elegibilidad y reglas de misiones.
- Gestión de recursos institucionales autorizados.
- Gestión de configuración de ludificación.
- Gestión de parámetros configurables del recomendador.
- Activación/desactivación de funciones del piloto mediante feature flags simples.
- Gestión de instrumentos/microcuestionarios.
- Vista de analítica global del piloto.
- Auditoría de eventos administrativos relevantes.
- Exportación de datos anonimizados o seudonimizados para análisis.
- Revisión de versiones de reglas, configuración del recomendador y plantillas de mensajes.
- Las mutaciones administrativas requieren conexión; no se promete administración offline.

# 4. No objetivos de V1

- No desarrollar una plataforma institucional definitiva de producción.
- No integrar obligatoriamente sistemas académicos oficiales en V1.
- No consumir calificaciones, historia académica restringida ni datos sensibles sin autorización formal.
- No construir ni validar un modelo avanzado propio de predicción de deserción.
- No comparar múltiples arquitecturas algorítmicas como objetivo principal.
- No permitir decisiones académicas automatizadas obligatorias.
- No crear rankings públicos entre estudiantes.
- No asumir escalabilidad masiva de producción; se diseña modularidad y desacoplamiento para evolución futura.

# 5. Arquitectura de alto nivel

```text
React Web / PWA (Student | Facilitator | Admin)
  | Local-first: IndexedDB + Outbox + Sync Engine
                |
             HTTPS
                v
          API Gateway
      NestJS + AuthZ + Routing
                |
   +------------+-------------+----------------+
   |            |             |                |
Identity     Student     Gamification      Resources
Service      Service        Service          Service
   |            |             |                |
   +------------+-------------+----------------+
                |
     Recommendation Service
        Python + FastAPI
                |
       Rules + Score + LLM
                |
   +------------+-------------+
   |                          |
Survey Service          Support Service
   |                          |
   +-------------+------------+
                 |
              RabbitMQ
                 |
          Analytics Service

PostgreSQL: cada servicio posee sus tablas/esquema y credenciales.
```

## 5.1 Principios arquitectónicos

1. **Microservicios por dominio, no por pantalla.**
2. Cada servicio debe poder explicar su responsabilidad, contrato y datos propios.
3. Ningún servicio consulta directamente las tablas de otro servicio.
4. Operaciones que requieren respuesta inmediata usan HTTP/REST.
5. Analítica, auditoría y propagación de cambios usan eventos cuando sea posible.
6. El fallo del servicio de IA no debe impedir completar misiones o usar funciones esenciales.
7. El motor de ludificación mantiene reglas auditables y versionadas en backend.
8. Los contratos de eventos incluyen versión de esquema y correlation ID.
9. La infraestructura inicial debe poder levantarse con Docker Compose en una máquina de desarrollo.
10. La PWA mantiene estado local mínimo y versionado; el servidor continúa siendo autoridad definitiva.
11. Toda acción offline sincronizable debe ser idempotente mediante `clientEventId`/`Idempotency-Key`.
12. Los conflictos se resuelven por dominio; no existe `last-write-wins` global.
13. El recomendador offline no puede depender del LLM ni inventar reglas/pesos.

## 5.2 Capa PWA local-first

La PWA se documenta en detalle en `docs/architecture/pwa-offline-sync.md`. No añade un microservicio nuevo. El frontend incorpora repositorios locales, IndexedDB, outbox y un Sync Engine. El API Gateway incorpora un módulo de coordinación de sincronización que delega cada acción al servicio dueño del dominio.

Política por rol:

- **STUDENT:** operación offline completa sobre datos previamente sincronizados.
- **FACILITATOR:** principalmente online; cache de lectura limitado, sin escrituras offline de acompañamiento.
- **ADMIN:** mutaciones administrativas online obligatorias.

El primer login/primer bootstrap requieren conexión. Al reconectar, el servidor revalida sesión, rol y consentimiento antes de aplicar outbox.

# 6. Catálogo de microservicios

| Servicio | Tecnología | Responsabilidad | Datos propios principales |
|---|---|---|---|
| `api-gateway` | NestJS | Punto de entrada, autenticación de token, autorización, routing, rate limit y agregación puntual. | Sin dominio persistente; solo configuración/telemetría. |
| `identity-service` | NestJS | Usuarios, credenciales, roles, sesiones y refresh tokens. | users, roles, user_roles, refresh_sessions. |
| `student-service` | NestJS | Perfil, consentimiento, preferencias y contexto mínimo del estudiante. | student_profiles, consent_records, personalization_preferences. |
| `gamification-service` | NestJS | Catálogo de misiones, asignaciones, estados, progreso, logros personales, continuidad y modo recuperación. | mission_templates, mission_assignments, progress_state, achievements, recovery_state. |
| `resource-service` | NestJS | Recursos institucionales autorizados y metadatos vigentes. | institutional_resources, resource_categories, availability_rules. |
| `recommendation-service` | FastAPI | Candidatos, reglas de elegibilidad, scoring, integración LLM, explicación y trazabilidad. | recommendation_runs, recommendation_items, score_components, ai_config_versions. |
| `survey-service` | NestJS | Microcuestionarios, versiones e interacción de respuestas. | survey_definitions, survey_versions, survey_responses. |
| `support-service` | NestJS | Asignaciones facilitador-estudiante, notas y compromisos. | facilitator_assignments, support_notes, commitments. |
| `analytics-service` | NestJS | Consumo de eventos, métricas longitudinales, dashboards y exportaciones. | event_facts, weekly_metrics, export_jobs, audit_views. |

## 6.1 Servicio diferido

`notification-service` se deja **fuera del núcleo V1**. La tesis contempla presión/saturación por notificaciones como posible efecto no deseado; por tanto, no se incorporará un subsistema complejo de notificaciones hasta que exista una necesidad de validación clara. Si se añade, será un microservicio separado y configurable.

# 7. Comunicación y eventos

## 7.1 HTTP síncrono

Se usa para:

- login/refresh;
- consultar/editar perfil;
- consultar/aceptar/completar misión;
- consultar recursos;
- solicitar recomendaciones;
- enviar microcuestionarios;
- operaciones de soporte y administración que requieren confirmación inmediata.

## 7.2 Eventos RabbitMQ

Eventos base:

- `user.registered.v1`
- `user.role_changed.v1`
- `consent.updated.v1`
- `student.profile_updated.v1`
- `mission.assigned.v1`
- `mission.accepted.v1`
- `mission.completed.v1`
- `mission.skipped.v1`
- `recovery.activated.v1`
- `resource.viewed.v1`
- `survey.submitted.v1`
- `recommendation.generated.v1`
- `facilitator.note_created.v1`
- `commitment.updated.v1`
- `sync.action_applied.v1` (operacional; sin payload sensible)
- `recommendation.offline_used.v1`

Envelope común:

```json
{
  "eventId": "uuid",
  "eventType": "mission.completed.v1",
  "occurredAt": "ISO-8601",
  "actorId": "pseudonymous-user-id",
  "subjectId": "pseudonymous-student-id",
  "correlationId": "uuid",
  "schemaVersion": 1,
  "payload": {}
}
```

# 8. Autenticación, autorización y RBAC

## 8.1 Estrategia inicial

- `identity-service` emite JWT de acceso de corta duración y refresh token rotativo.
- Contraseñas almacenadas con algoritmo resistente a fuerza bruta (preferencia: Argon2id).
- Roles incluidos como claims verificables, pero la autorización final se aplica en gateway y servicios.
- Cuenta ADMIN inicial creada por seed seguro, no por registro público.
- Preparar contrato para sustituir autenticación local por SSO institucional en el futuro sin alterar los dominios.

## 8.2 Matriz de permisos resumida

| Acción | STUDENT | FACILITATOR | ADMIN |
|---|:---:|:---:|:---:|
| Ver/editar su propio perfil | Sí | No | Soporte limitado |
| Ver misiones propias | Sí | No | Configura catálogo |
| Completar misión | Sí | No | No |
| Ver estudiantes asignados | No | Sí | Sí |
| Registrar nota de acompañamiento | No | Sí | Sí, si es necesario |
| Gestionar catálogo de misiones | No | No | Sí |
| Gestionar recursos | No | No | Sí |
| Configurar recomendador | No | No | Sí |
| Ver analítica agregada | Propia | Asignados | Global |
| Exportar datos anonimizados | No | No | Sí |
| Gestionar usuarios/roles | No | No | Sí |

# 9. Recomendador V1

## 9.1 Decisión central

El recomendador **NO** será un LLM que recibe todos los datos y decide libremente. La V1 usa:

**reglas de negocio + scoring determinístico + LLM controlado + validación posterior**.

Esto hace que el sistema sea explicable, reproducible y funcional incluso si el proveedor LLM está caído. En la PWA, el mismo baseline de reglas y scoring se ejecuta en TypeScript cuando no hay conexión; el LLM solo participa online.

## 9.2 Datos de entrada permitidos

El contexto puede incluir únicamente datos mínimos y autorizados necesarios para la recomendación:

- programa de ingeniería;
- semestre;
- carga académica percibida;
- materias de dificultad reportadas;
- disponibilidad de tiempo;
- responsabilidades externas;
- intereses relevantes;
- motivación, estrés o bienestar cuando exista consentimiento para ese uso;
- prácticas de estudio;
- historial reciente de interacción;
- misiones aceptadas/completadas;
- continuidad semanal;
- activación del modo recuperación;
- recursos institucionales autorizados y vigentes;
- respuestas resumidas de microcuestionarios pertinentes.

No incluir calificaciones, historias académicas restringidas ni datos sensibles adicionales sin aprobación formal.

## 9.3 Flujo

1. `student-service`, `gamification-service`, `survey-service` y `resource-service` aportan contexto mínimo.
2. Se construye un objeto `RecommendationContext` normalizado.
3. Se generan candidatos de misiones y recursos autorizados.
4. Se aplican **hard rules** de elegibilidad.
5. Se calcula un score determinístico por candidato.
6. Se selecciona Top-N.
7. Opcionalmente se llama a `LLMProvider` para explicación, tono y reformulación controlada.
8. Se valida la salida: JSON Schema, IDs permitidos, límites y políticas.
9. Se persiste trazabilidad de la recomendación.
10. Se devuelve recomendación al estudiante.

## 9.4 Baseline de scoring configurable

La fórmula inicial de implementación será configurable, no una afirmación empírica de la tesis:

```text
score =
  0.30 * need_fit
+ 0.20 * time_fit
+ 0.15 * difficulty_fit
+ 0.15 * continuity_fit
+ 0.15 * resource_fit
+ 0.05 * diversity_fit
```

Todos los componentes se normalizan en `[0,1]`. Los pesos se almacenan como configuración versionada y ADMIN puede modificarlos en un rango seguro.

Definiciones:

- `need_fit`: relación entre necesidad reportada y objetivo de la misión.
- `time_fit`: compatibilidad con disponibilidad estimada.
- `difficulty_fit`: esfuerzo adecuado para el momento del estudiante.
- `continuity_fit`: favorece continuidad o recuperación sin castigar interrupciones.
- `resource_fit`: calidad de asociación con recurso institucional autorizado.
- `diversity_fit`: evita repetir siempre el mismo tipo de misión.

## 9.5 Reglas obligatorias V1

- Nunca recomendar recursos inactivos o no autorizados.
- Nunca devolver IDs que no pertenezcan al conjunto de candidatos permitido.
- Limitar el número de recomendaciones simultáneas para evitar saturación.
- En modo recuperación, priorizar metas mínimas viables y menor carga.
- No penalizar públicamente rachas interrumpidas.
- No usar lenguaje coercitivo, diagnóstico o de vigilancia.
- Permitir al estudiante descartar una recomendación y registrar motivo opcional.
- Toda recomendación debe incluir una explicación breve del tipo “por qué te la sugerimos”.

## 9.6 Uso del LLM

El LLM se usa para:

- adaptar tono dentro de límites;
- explicar una recomendación ya seleccionada;
- elegir entre candidatos de score similar cuando se permita;
- producir variantes de texto de una misión sin alterar su intención ni requisitos;
- resumir contexto no sensible cuando sea necesario.

El LLM **no puede**:

- inventar recursos institucionales;
- inventar servicios, horarios o dependencias;
- crear acciones académicas obligatorias;
- emitir diagnósticos psicológicos o médicos;
- clasificar al estudiante con etiquetas definitivas de riesgo;
- saltarse reglas de elegibilidad;
- modificar puntajes o estados directamente;
- acceder a una base de datos sin pasar por contratos controlados.

## 9.7 `LLMProvider`

Interfaz conceptual:

```text
LLMProvider.generateRecommendationExplanation(input) -> StructuredResult
LLMProvider.rewriteMissionCopy(input) -> StructuredResult
LLMProvider.health() -> ProviderStatus
```

Requisitos:

- salida JSON estructurada y validada;
- baja aleatoriedad para tareas de explicación;
- `provider`, `model`, `promptVersion` y `policyVersion` registrados;
- no registrar prompts completos con datos personales en logs generales;
- fallback por plantillas determinísticas;
- timeouts y circuit breaker.

## 9.8 No entrenamiento V1

La V1 no requiere entrenar un modelo de machine learning propio. Los datos longitudinales obtenidos durante el piloto pueden servir posteriormente para evaluar si tiene sentido introducir un modelo de ranking o clasificación, pero eso será una decisión futura independiente.


## 9.9 Modo offline de recomendación

Cuando no hay conectividad, la PWA usa el último `RecommendationConfig` válido sincronizado y ejecuta **hard rules + scoring determinístico + explicación determinística** en TypeScript. No se ejecuta un LLM local.

La configuración versionada es el contrato canónico entre motores. Python y TypeScript deben pasar los mismos fixtures de paridad. Toda recomendación registra `source = OFFLINE_RULES | ONLINE_RULES | ONLINE_AI`, `ruleVersion`, `catalogVersion`, componentes de score y timestamps de cliente/servidor. Una recomendación offline no se reescribe retroactivamente al reconectar; puede generarse una nueva recomendación online para el estado actual.

# 10. Persistencia y propiedad de datos

## 10.1 Regla

Un único servidor PostgreSQL puede alojar V1 para reducir complejidad operativa, pero cada servicio tendrá:

- base o esquema propio;
- usuario/credenciales propias;
- migraciones propias;
- prohibición de joins directos entre dominios.

## 10.2 Identificadores

- UUIDs para entidades de dominio.
- ID interno de identidad separado de cualquier código institucional.
- `studentId` seudónimo para eventos y analítica.
- Identificadores externos solo cuando exista necesidad y autorización.

## 10.3 Retención y retirada

El diseño debe permitir:

- registrar la versión del consentimiento;
- detener nuevos tratamientos al retirar consentimiento;
- separar información identificable de exportaciones de análisis;
- generar exportaciones anonimizadas/seudonimizadas;
- auditar quién exportó datos y cuándo.

## 10.4 Persistencia local PWA

IndexedDB almacena únicamente la réplica mínima necesaria para operación offline: perfil permitido, misiones/catálogos versionados, asignaciones, progreso, recursos, surveys, recomendaciones/configuración y outbox. Cache Storage se reserva para app shell y activos.

Los datos locales tienen versión, `lastSuccessfulSyncAt` y política de limpieza. Logout, retiro de consentimiento y cambios de autorización deben invalidar o limpiar el cache según la política aprobada. No se persisten bearer tokens en `localStorage`.

# 11. APIs iniciales

## 11.1 Gateway público

Prefijo: `/api/v1`

Rutas principales:

```text
/auth/*
/me/*
/students/*
/missions/*
/progress/*
/recovery/*
/recommendations/*
/resources/*
/surveys/*
/facilitator/*
/admin/*
/analytics/*
/sync/bootstrap
/sync/pull
/sync/actions
```

## 11.2 Convenciones

- JSON UTF-8.
- OpenAPI generado automáticamente.
- Errores con `code`, `message`, `correlationId`, `details` seguro.
- Paginación cursor-based o page-based consistente por dominio.
- `Idempotency-Key` para operaciones críticas susceptibles a reintentos; acciones offline reutilizan el mismo `clientEventId` como clave estable.
- Fechas en ISO-8601 UTC; presentación convertida en frontend.
- Validación de DTOs en todos los límites de servicio.

# 12. Monorepo

Estructura propuesta:

```text
/
├── apps/
│   ├── web/                         # React + TypeScript + Vite; PWA local-first
│   └── api-gateway/                 # NestJS
├── services/
│   ├── identity-service/            # NestJS
│   ├── student-service/             # NestJS
│   ├── gamification-service/        # NestJS
│   ├── resource-service/            # NestJS
│   ├── recommendation-service/      # Python + FastAPI
│   ├── survey-service/              # NestJS
│   ├── support-service/             # NestJS
│   └── analytics-service/           # NestJS
├── packages/
│   ├── ui/                          # componentes React compartidos
│   ├── contracts/                   # DTOs/event schemas generables
│   ├── eslint-config/
│   ├── tsconfig/
│   └── test-utils/
├── infra/
│   ├── docker/
│   ├── rabbitmq/
│   └── postgres/
├── docs/
│   ├── adr/
│   ├── api/
│   ├── architecture/
│   └── figma/
├── scripts/
├── .github/workflows/
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

## 12.1 npm Workspaces

Root `package.json`:

```json
{
  "private": true,
  "workspaces": [
    "apps/*",
    "services/*",
    "packages/*"
  ]
}
```

El servicio Python permanece en el mismo repositorio, pero su entorno se administra con `pyproject.toml` + `venv/pip`; no debe forzarse a comportarse como paquete npm.

# 13. Convenciones de desarrollo

## TypeScript / Node

- TypeScript `strict`.
- NestJS por módulos de dominio.
- ESLint + Prettier.
- Validación DTO estricta.
- No lógica de dominio en controllers.
- Repositorios/adapters para infraestructura.
- Migrations versionadas.

## Python

- Python moderno con type hints.
- FastAPI + Pydantic.
- `pyproject.toml`.
- Ruff para lint/format.
- Pytest.
- Dependencias del proveedor LLM aisladas en adapters.

## General

- Conventional Commits.
- ADR para decisiones arquitectónicas relevantes.
- `.env.example` sin secretos.
- Secrets nunca en Git.
- Correlation ID propagado entre gateway, servicios y eventos.
- Logs estructurados en JSON en entornos desplegados.

# 14. Testing

Pirámide mínima:

1. **Unit tests** de dominio y reglas.
2. **Integration tests** con PostgreSQL/RabbitMQ reales efímeros o contenedores de prueba.
3. **Contract tests** para APIs y eventos críticos.
4. **E2E** con Playwright sobre flujos de Student, Facilitator y Admin.
5. **Golden tests del recomendador**: contextos sintéticos con candidatos y resultados esperados de reglas/scoring, ejecutados en Python y TypeScript para verificar paridad offline/online.
6. **Pruebas de fallback**: recomendador debe funcionar sin LLM.
7. **Pruebas PWA/offline**: persistencia tras reload, outbox, reconexión, idempotencia, conflictos y actualización de catálogos.
7. **Pruebas de autorización**: cada endpoint sensible debe tener casos de allow/deny por rol.

Flujos E2E obligatorios:

- Student: onboarding -> recibir misión -> aceptar -> completar -> progreso.
- Student: baja continuidad -> activar recuperación -> recibir misión mínima viable.
- Student: recomendación -> explicación -> recurso institucional.
- Facilitator: ver asignado -> registrar nota -> compromiso.
- Admin: crear misión -> publicar -> verla disponible para reglas elegibles.
- Admin: exportar dataset anonimizado.

# 15. Seguridad, privacidad y ética por diseño

Requisitos no negociables:

- consentimiento informado y versionado;
- participación voluntaria y posibilidad de retiro;
- minimización de datos;
- control de acceso por rol y asignación;
- separación entre identidad y analítica cuando sea posible;
- no usar correos personales, datos sensibles no autorizados, calificaciones o historia académica restringida sin aprobación formal;
- transparencia sobre uso de IA;
- explicación de recomendaciones;
- recomendaciones opcionales;
- no etiquetado público de estudiantes en riesgo;
- auditoría de acciones administrativas y exportaciones;
- cifrado TLS en tránsito;
- secretos gestionados fuera del código;
- backups y restauración documentados para entornos de prueba/piloto.

# 16. Analítica para validación longitudinal

El sistema debe registrar suficiente información para observar, sin afirmar causalidad:

- adherencia semanal;
- participantes activos en hitos de seguimiento;
- misiones aceptadas y completadas;
- proporción de finalización;
- continuidad de acciones;
- uso del modo recuperación;
- claridad/facilidad mediante instrumentos;
- utilidad percibida;
- pertinencia de recomendaciones;
- presión o saturación percibida;
- intención de continuidad;
- incidencias técnicas y errores.

El `analytics-service` no debe convertirse en un sistema de vigilancia. Su propósito es apoyar la validación formativa y longitudinal del prototipo.

# 17. Diseño UX/UI y brief para Figma

## 17.1 Principios

- **Autonomía:** el estudiante puede aceptar, posponer o descartar recomendaciones.
- **Competencia:** progreso visible, metas alcanzables y feedback positivo.
- **Relación:** conexión con facilitadores y recursos institucionales.
- **Recuperación sin castigo:** una interrupción no “rompe” la experiencia; activa opciones de retorno.
- **Baja presión:** evitar saturación, culpa, urgencia artificial y comparaciones públicas.
- **Transparencia IA:** toda recomendación personalizada muestra una explicación breve y acceso a “cómo se eligió”.

## 17.2 Information architecture - Student

```text
Inicio
├── Tu semana
├── Misiones recomendadas
├── Progreso
└── Acceso a recuperación

Misiones
├── Recomendadas
├── Disponibles
└── Historial

Recursos
├── Académicos
├── Bienestar
├── Integración
└── Orientación / apoyos

Seguimiento
├── Microcuestionario
└── Progreso personal

Perfil
├── Datos y preferencias
├── Personalización
└── Privacidad / consentimiento
```

## 17.3 Information architecture - Facilitator

```text
Dashboard
├── Resumen de asignados
└── Seguimientos pendientes

Estudiantes asignados
└── Detalle
    ├── Continuidad
    ├── Misiones / recursos
    ├── Notas
    └── Compromisos

Recursos
└── Catálogo autorizado
```

## 17.4 Information architecture - Admin

```text
Dashboard
Usuarios y asignaciones
Misiones
Recursos
Reglas de ludificación
Recomendador / IA
Cuestionarios
Analítica del piloto
Exportaciones
Auditoría
Configuración
```

## 17.5 Pantallas mínimas a diseñar

### Student
1. Login.
2. Consentimiento.
3. Onboarding paso a paso.
4. Home semanal.
5. Lista de misiones.
6. Detalle de misión.
7. Finalización + feedback.
8. Progreso.
9. Modo recuperación.
10. Recomendación explicada.
11. Catálogo/detalle de recurso.
12. Microcuestionario.
13. Perfil y privacidad.

### Facilitator
1. Login.
2. Dashboard.
3. Lista de asignados.
4. Detalle del estudiante.
5. Timeline de seguimiento.
6. Nueva nota/compromiso.
7. Recursos.

### Admin
1. Dashboard.
2. Usuarios y roles.
3. Asignaciones.
4. Catálogo de misiones.
5. Editor de misión.
6. Recursos.
7. Reglas de ludificación.
8. Configuración del recomendador.
9. Cuestionarios.
10. Analítica.
11. Exportación.
12. Auditoría.

## 17.6 Archivo Figma recomendado

Páginas:

```text
00 Cover & Notes
01 Foundations
02 Components
10 Student
20 Facilitator
30 Admin
40 Responsive
90 Prototype
99 Dev Handoff
```

Breakpoints prioritarios:

- Student: 390 px mobile primero, con comportamiento PWA/instalable y 1440 px desktop.
- Facilitator/Admin: desktop 1440 px primero; responsive tablet después.

Componentes base:

- buttons, inputs, selects, chips;
- mission card y mission status;
- progress indicator;
- achievement/badge personal;
- recovery callout;
- recommendation card + “por qué”; 
- resource card;
- survey scale;
- data table;
- timeline;
- empty/loading/error states;
- confirmation modal;
- toast no intrusivo;
- privacy/consent panel;
- connectivity/sync indicator;
- pending sync state;
- conflict resolution state;
- update-available banner no intrusivo.

No usar identidad gráfica oficial de la Universidad como hecho consumado hasta confirmar autorización y lineamientos de marca. El primer mockup puede usar una identidad académica neutral.

# 18. Observabilidad

V1 debe incluir:

- health endpoint por servicio;
- readiness/liveness en contenedores;
- logs estructurados;
- correlation ID;
- métricas mínimas: request count, latency, errors, RabbitMQ backlog, recommendation latency;
- auditoría separada de logs técnicos;
- panel simple de estado para ADMIN o herramientas de desarrollo.

No se requiere una plataforma observability empresarial completa en la primera iteración.

# 19. Desarrollo local e infraestructura

`docker-compose.yml` debe levantar como mínimo:

- PostgreSQL;
- RabbitMQ + management UI en desarrollo;
- API Gateway;
- todos los servicios Node;
- recommendation-service Python;
- opcionalmente web o ejecutar web con `npm run dev` fuera de Docker para HMR.

Comandos objetivo desde raíz:

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
npm run e2e
```

Para Python, scripts root pueden delegar al servicio o Docker Compose para que el desarrollador no memorice múltiples comandos.

# 20. Roadmap de implementación

Los sprints se plantean de 2-3 semanas, coherentes con el enfoque Scrum adaptado del proyecto.

## Sprint 0 - Foundation

- crear repositorio y workspaces;
- Docker Compose;
- PostgreSQL/RabbitMQ;
- API Gateway;
- CI básico;
- conventions/ADRs;
- shell de React y design system base;
- estructura preparada para PWA local-first sin implementar todavía toda la sincronización.

## Sprint 1 - Identity + Student Context

- auth/RBAC;
- consentimiento;
- onboarding;
- perfil;
- seed ADMIN;
- pruebas de seguridad base.

## Sprint 2 - Gamification Core

- catálogo de misiones;
- asignación;
- aceptar/completar;
- progreso;
- continuidad;
- modo recuperación;
- eventos;
- primer vertical offline de misión: cache local, outbox e idempotencia.

## Sprint 3 - Resources + Recommendation V1

- catálogo institucional;
- recommendation-service Python;
- scoring determinístico;
- LLMProvider;
- explicación y fallback;
- trazabilidad;
- motor TypeScript offline con fixtures compartidos de paridad;
- bootstrap/pull de recursos y configuración para PWA.

## Sprint 4 - Facilitator

- asignaciones;
- dashboard;
- seguimiento;
- notas y compromisos;
- permisos limitados;
- lectura cacheada limitada sin escrituras offline.

## Sprint 5 - Admin + Surveys + Analytics

- administración completa;
- microcuestionarios;
- métricas longitudinales;
- exportación anonimizada;
- auditoría;
- ADMIN requiere conexión para mutaciones.

## Sprint 6 - Hardening + Pilot Readiness

- E2E;
- accesibilidad;
- manejo de errores;
- privacidad;
- pruebas de carga acotadas;
- correcciones de usabilidad;
- dataset de prueba;
- checklist para piloto;
- hardening PWA: conflictos, migraciones IndexedDB, actualización de app, red intermitente y limpieza local.

# 21. Criterios de aceptación de V1

V1 se considera funcional cuando:

- los tres roles pueden autenticarse y solo acceder a lo permitido;
- un estudiante completa onboarding y usa el ciclo misión -> progreso;
- el sistema propone recuperación sin castigo después de baja continuidad;
- el recomendador genera sugerencias trazables y funciona en fallback sin LLM;
- los recursos recomendados provienen únicamente del catálogo autorizado;
- el facilitador ve únicamente estudiantes asignados;
- ADMIN puede configurar contenido esencial sin editar código;
- los eventos principales llegan a analytics;
- se generan métricas de la prueba longitudinal;
- es posible exportar datos anonimizados/seudonimizados;
- las rutas críticas tienen pruebas automatizadas;
- Docker Compose permite reproducir el entorno de desarrollo;
- STUDENT puede completar un flujo esencial offline y sincronizarlo sin duplicados al recuperar red;
- el motor offline TypeScript mantiene paridad con el scoring Python para fixtures compartidos;
- FACILITATOR no realiza escrituras offline y ADMIN no puede ejecutar mutaciones administrativas sin conexión.

# 22. Decisiones abiertas que NO debe resolver una IA unilateralmente

1. Proveedor y modelo LLM concreto.
2. Infraestructura cloud/hosting del piloto.
3. Uso de autenticación local vs. SSO institucional para el piloto real.
4. Lineamientos visuales oficiales y uso de marca/logos de la Universidad.
5. Fuente final de recursos institucionales: carga manual por ADMIN, API institucional o sincronización.
6. Instrumentos exactos y redacción final de microcuestionarios/consentimiento.
7. Parámetros finales del scoring después de pruebas de usabilidad/validación.
8. Duración máxima del permiso de acceso offline antes de exigir revalidación online.

Una IA puede presentar opciones y trade-offs para estas decisiones, pero no debe cambiar esta especificación sin aprobación.

# 23. Instrucciones para la próxima IA o desarrollador

Al continuar:

1. Leer este documento completo antes de generar código.
2. Tratar **Decisiones fijas** como restricciones.
3. No convertir el recomendador en un “chatbot libre”.
4. No añadir microservicios sin responsabilidad clara.
5. No compartir base de datos entre servicios mediante joins directos.
6. No mover reglas de ludificación al frontend.
7. Mantener STUDENT, FACILITATOR y ADMIN; no reintroducir RESEARCHER.
8. Mantener al ADMIN como operador del prototipo.
9. Preservar privacidad, consentimiento, autonomía y explicabilidad.
10. Antes de implementar, transformar esta especificación en backlog/ADRs/OpenAPI y confirmar las decisiones abiertas necesarias para el sprint.
11. Si una nueva necesidad contradice la tesis, señalar la contradicción explícitamente.
12. Todo cambio importante debe documentarse en `docs/adr/`.
13. Preservar la decisión PWA local-first de ADR-005 y no añadir un LLM local.
14. No tratar Cache Storage como base de datos de dominio autenticado.
15. Toda operación offline debe diseñarse con idempotencia y conflicto explícito.

# 24. Trazabilidad con documentos de origen

## Proyecto de tesis

**Archivo:** `PROYECTO_DE_TESIS_HINARA_SANCHEZ (2).docx`

Aporta el alcance del prototipo, componentes funcionales, estrategia de ludificación, modo recuperación, personalización mediante IA, datos mínimos, ética, validación longitudinal y limitaciones. Las secciones especialmente relevantes son las páginas 2-7 y 17-22 del archivo suministrado.

## Marco arquitectónico

**Archivo:** `Versión 2_Marco arquitectónico para plataformas de acompañamiento estudiantil_ integración de ludificación e inteligencia artificial desde el diseño de software (1).docx`

Aporta la separación entre presentación, servicios, motor de ludificación, pipeline de IA, broker de eventos y persistencia, además de las ideas de asincronía, trazabilidad, control de acceso y desacoplamiento. Las páginas 3-5 son la referencia técnica principal.

# 25. Resumen ejecutivo para handoff

**Qué estamos construyendo:** prototipo web evolucionable a PWA local-first de acompañamiento académico ludificado con personalización mediante IA.  
**Usuarios:** STUDENT, FACILITATOR, ADMIN.  
**Frontend:** React + TypeScript + Vite; objetivo PWA local-first con IndexedDB, outbox y Sync Engine.  
**Backend:** microservicios NestJS.  
**IA:** Python + FastAPI, rules + score + LLM controlado.  
**Datos:** PostgreSQL con ownership por servicio.  
**Eventos:** RabbitMQ.  
**Repo:** monorepo con npm Workspaces + servicio Python.  
**Desarrollo:** Docker Compose.  
**Principio central:** la IA recomienda dentro de reglas y contenidos autorizados; no decide libremente.  
**UX central:** progreso personal, autonomía, recuperación sin castigo, sin rankings públicos.  
**Siguiente paso recomendado:** crear el repositorio siguiendo Sprint 0 y ADR-001..005; preparar el frontend para la futura capa PWA sin implementar de golpe toda la sincronización.
