# VIVU — CONTEXT HANDOFF / START HERE

> Este archivo existe para restaurar rápidamente el contexto del proyecto Vivu en una conversación nueva con ChatGPT u otra IA.
> Cuando abras un chat nuevo, adjunta este archivo y escribe:
>
> **"Lee `VIVU_CONTEXT_HANDOFF.md` completo y úsalo como contexto base del proyecto. No cambies decisiones arquitectónicas existentes sin señalar la contradicción y pedirme aprobación."**

---

# 1. Identidad del proyecto

**Nombre de la aplicación:** Vivu  
**Repositorio:** `vivu`  
**GitHub owner:** `HinaraSM12`  
**Repositorio esperado:** `HinaraSM12/vivu`  
**Visibilidad inicial:** privada  

Vivu es un prototipo funcional de acompañamiento estudiantil con ludificación e inteligencia artificial orientado a fomentar la autorregulación académica en estudiantes de ingeniería.

El proyecto corresponde a una tesis de maestría y no busca convertirse, durante la investigación, en una plataforma institucional definitiva ni demostrar causalmente una reducción de la deserción.

---

# 2. Propósito académico

Título de referencia actualizado de la tesis (V7 / PRISMA V5):

**Sistema de ludificación adaptativa asistido por un modelo de lenguaje de gran escala para el fomento del aprendizaje autorregulado y el uso de recursos institucionales en estudiantes de ingeniería.**

Objetivo general actualizado:

**Desarrollar y evaluar de forma exploratoria un prototipo de sistema de ludificación adaptativa asistido por un modelo de lenguaje de gran escala para apoyar acciones de aprendizaje autorregulado y el uso de recursos institucionales en estudiantes de ingeniería de la Facultad de Minas.**

Objetivo específico de evaluación (OE4):

**Evaluar el prototipo mediante indicadores de calidad de software, calidad de experiencia (QoE, ISO 9241-11 / ISO 9241-210), calidad de servicio (QoS), calidad instrumental del componente LLM, continuidad de uso y pertinencia de las recomendaciones durante una prueba piloto longitudinal con estudiantes de ingeniería de la Facultad de Minas.**

Base científica de la revisión sistemática (PRISMA V5 — `Articulo_Revision_Sistematica_PRISMA_v5_FINAL.docx`):

- Bases definitivas: **Scopus, IEEE Xplore, ERIC** (8 familias temáticas = 24 ejecuciones formales);
- Ventana temporal: **2014–2026**;
- Registros identificados: **6.573** (`2.584` Scopus + `2.474` IEEE Xplore + `1.515` ERIC);
- Duplicados eliminados: **1.240** -> Registros únicos cribados: **5.333**;
- Informes buscados para texto completo: **249** (`146` `DIRECT_CORE` + `103` `RESCUE_TO_FULLTEXT`);
- Informes recuperados legalmente: **72** (`177` no recuperables por paywall/sin copia pública);
- Revisados humanamente: **63** -> **Corpus final incluido: 57 estudios empíricos primarios** (fase exploratoria histórica mantenida por separado).

Población objetivo:

- estudiantes de ingeniería;
- contexto inicial: Facultad de Minas, Universidad Nacional de Colombia, sede Medellín;
- muestra prevista para validación exploratoria longitudinal: aproximadamente 5–10 estudiantes;
- prueba longitudinal: 10 semanas / 70 días.

El prototipo busca ayudar a convertir necesidades de autorregulación, recursos institucionales verificados y objetivos semanales en acciones concretas y sostenibles, empleando el LLM únicamente como **componente instrumental** (contextualización, explicación, adaptación de tono y extracción estructurada con JSON Schema sobre recursos autorizados; **LLM ≠ ML predictivo**).

No pretende:

- diagnosticar psicológica o clínicamente a estudiantes;
- entrenar un modelo predictivo de deserción ni un clasificador de riesgo propio;
- hacer benchmarking fundacional del modelo de lenguaje;
- automatizar decisiones académicas o asignar sanciones/calificaciones;
- etiquetar públicamente estudiantes como "en riesgo" o "de alto riesgo";
- inventar recursos institucionales, horarios, contactos o convocatorias;
- demostrar causalmente reducción de deserción;
- integrarse obligatoriamente con sistemas académicos restringidos;
- convertirse en una plataforma de producción institucional durante la tesis.

---

# 3. Funcionalidades centrales del prototipo

El alcance funcional aprobado incluye:

1. registro e inicio de sesión;
2. perfil básico y actualizable;
3. consentimiento y onboarding;
4. microcuestionarios breves;
5. catálogo y visualización de misiones;
6. aceptación de misiones;
7. finalización de misiones;
8. progreso;
9. retroalimentación;
10. modo recuperación;
11. recomendaciones personalizadas;
12. recursos institucionales autorizados;
13. eventos de interacción;
14. analítica básica;
15. panel básico de facilitador;
16. administración de catálogos, reglas y configuración;
17. PWA local-first con capacidades offline para STUDENT.

---

# 4. Roles aprobados

Los únicos roles iniciales son:

## STUDENT

Puede:

- registrarse;
- iniciar sesión;
- completar onboarding;
- actualizar su perfil;
- consultar misiones;
- aceptar misiones;
- completar misiones;
- consultar progreso;
- activar modo recuperación;
- consultar recursos institucionales;
- responder microcuestionarios;
- recibir recomendaciones;
- usar en el futuro la experiencia completa offline;
- sincronizar acciones cuando regrese la conexión.

## FACILITATOR

Puede:

- consultar estudiantes asignados;
- revisar señales limitadas de continuidad y seguimiento;
- consultar actividad relevante;
- apoyar acompañamiento;
- disponer en el futuro de lectura cacheada limitada.

No puede:

- alterar reglas globales;
- tomar decisiones académicas automatizadas;
- administrar el sistema completo;
- trabajar con administración offline completa.

## ADMIN

Puede:

- administrar usuarios y asignaciones;
- administrar catálogo de misiones;
- administrar recursos institucionales;
- administrar reglas de ludificación;
- administrar parámetros de recomendación;
- configurar aspectos del piloto;
- consultar métricas globales;
- realizar exportaciones autorizadas/anónimas;
- administrar configuración general.

Las escrituras administrativas requieren conexión.

## PROFESSOR (`RESOURCE_CONTRIBUTOR`)

Rol colaborativo institucional (docente o colaborador autorizado) introducido en `ADR-006`:

Puede:

- iniciar sesión;
- registrar o proponer recursos institucionales mediante formulario estructurado (creados en estado `PENDING_REVIEW`, o aprobados según `contributor_trust_level`);
- consultar el estado de moderación y vigencia de los recursos que aportó.

No puede:

- acceder a datos personales, perfiles, progreso ni seguimiento de estudiantes;
- publicar directamente en el catálogo estudiantil sin revisión (salvo `INSTITUTIONAL_EDITOR` autorizado);
- alterar reglas globales de ludificación o IA.

## Rol eliminado

No existe `RESEARCHER`.

Las funciones de operación del piloto y gestión investigativa se absorben en `ADMIN`.

---

# 5. Stack tecnológico aprobado

## Frontend

- React
- TypeScript
- Vite

## Monorepo

- npm
- npm Workspaces

No utilizar:

- pnpm
- Yarn
- Turborepo
- Nx

## Backend principal

- Node.js
- TypeScript
- NestJS

## Recommendation Service

- Python
- FastAPI

## Datos

- PostgreSQL

## Mensajería

- RabbitMQ

## Infraestructura local

- Docker
- Docker Compose

## Contratos

- OpenAPI
- contratos de eventos versionados

## Testing

- Vitest
- Jest
- Playwright
- Pytest

según corresponda a cada componente.

---

# 6. Tecnologías que NO deben introducirse sin aprobación

No agregar automáticamente:

- pnpm
- Yarn
- Turborepo
- Nx
- Kafka
- Redis
- Kubernetes
- service mesh
- GraphQL
- Firebase
- Supabase
- MongoDB
- microfrontends

No sustituir:

- React por Next.js;
- Vite por otro bundler;
- NestJS por Express puro;
- FastAPI por Node.js;
- RabbitMQ por Kafka;
- PostgreSQL por otra base;
- npm Workspaces por otro gestor;
- microservicios por monolito modular;
- PWA por app nativa;
- estrategia local-first por online-only.

---

# 7. Arquitectura general

La aplicación usa microservicios separados por dominio.

Estructura conceptual:

```text
React Web App
      |
      v
API Gateway
      |
      +-------------------------------+
      |               |               |
      v               v               v
Identity         Student         Gamification
Service          Service           Service
      |               |               |
      +---------------+---------------+
                      |
            otros servicios
                      |
                  RabbitMQ
                      |
                 PostgreSQL
```

El frontend no debe llamar directamente a servicios internos.

Toda API externa entra por:

**API Gateway**

---

# 8. Servicios aprobados

Estructura conceptual:

```text
apps/
  web/
  api-gateway/

services/
  identity-service/
  student-service/
  gamification-service/
  resource-service/
  survey-service/
  support-service/
  analytics-service/
  recommendation-service/
```

Nota importante:

En discusiones antiguas apareció `facilitator-service`, pero la documentación/ADR adoptó:

**`support-service`**

Usar `support-service` como nombre canónico.

---

# 9. Responsabilidad del API Gateway

El API Gateway se encarga principalmente de:

- routing;
- authentication boundary;
- authorization orchestration;
- correlation IDs;
- aspectos transversales;
- exposición externa controlada.

No convertirlo en un monolito.

La lógica de negocio debe permanecer en servicios de dominio.

---

# 10. Reglas de negocio

Las reglas críticas de ludificación pertenecen al backend.

React puede:

- presentar datos;
- capturar interacciones;
- mantener estado local;
- gestionar experiencia offline;
- consumir contratos.

React no debe ser la autoridad de negocio online.

---

# 11. Datos por servicio

Cada microservicio es propietario de sus datos.

No usar tablas compartidas como contrato entre servicios.

En desarrollo local puede existir una sola instancia PostgreSQL, pero con separación lógica y credenciales propias por servicio.

Comunicación entre dominios mediante:

- APIs;
- eventos.

---

# 12. PWA y estrategia offline

Vivu evolucionará a una:

**PWA local-first**

Arquitectura futura:

```text
React + Vite
      |
      +--> Service Worker
      |
      +--> IndexedDB
      |
      +--> Outbox local
      |
      +--> Sync Engine
      |
      +--> Offline Recommendation Engine
```

## STUDENT

Experiencia offline futura completa.

Debe poder llegar a:

- abrir una sesión previamente habilitada;
- abrir la aplicación;
- consultar datos sincronizados;
- consultar misiones;
- aceptar misiones válidas;
- completar misiones;
- consultar progreso;
- usar modo recuperación;
- consultar recursos sincronizados;
- responder microcuestionarios;
- registrar eventos;
- obtener recomendaciones determinísticas offline.

## FACILITATOR

Principalmente online.

Puede tener:

- lectura cacheada limitada;
- información previamente sincronizada.

## ADMIN

Escrituras administrativas online.

No implementar administración offline completa.

---

# 13. Persistencia local futura

IndexedDB deberá almacenar únicamente lo necesario, por ejemplo:

- perfil mínimo;
- catálogo sincronizado de misiones;
- estado de misiones;
- progreso;
- recursos institucionales;
- microcuestionarios disponibles;
- últimas recomendaciones;
- configuración/versiones de reglas.

---

# 14. Outbox y sincronización

Las acciones offline siguen conceptualmente:

```text
User action
    |
    v
IndexedDB
    |
    +--> Local State
    |
    +--> Outbox
            |
            | vuelve conexión
            v
        Sync Engine
            |
            v
        API Gateway
            |
            v
    Domain Service
```

Las operaciones sincronizables deben poder registrar:

- `clientEventId`
- timestamp local
- entity version
- rule version
- action type

Los endpoints relevantes deben ser idempotentes.

Reenviar la misma operación no debe duplicar:

- misión completada;
- respuesta;
- evento;
- actualización lógica.

---

# 15. Resolución de conflictos offline

No usar un `last-write-wins` global.

El servidor es autoridad sobre:

- catálogos;
- reglas;
- permisos;
- recursos;
- configuración;
- versiones oficiales.

Las acciones legítimas del estudiante realizadas offline deben preservarse cuando sea posible.

Ejemplo:

Si un estudiante completa correctamente una misión offline contra la versión de misión que tenía sincronizada, la acción no debe perderse únicamente porque el catálogo cambió antes de sincronizar.

---

# 16. Recommendation Service

Servicio online:

**Python + FastAPI**

Estrategia V1:

```text
authorized candidates
       +
business rules
       +
deterministic scoring
       +
optional LLM
```

No entrenar un modelo ML en V1.

No construir un predictor de deserción.

No trabajar con recursos o misiones no autorizados.

---

# 17. Recomendador offline

Cuando no existe conexión:

```text
local student context
        +
synced missions/resources
        +
versioned rules
        |
        v
TypeScript deterministic scorer
        |
        v
OFFLINE_RULES
```

No usar LLM remoto sin conexión.

No usar un LLM on-device.

---

# 18. Recomendador online

Cuando existe conexión:

```text
business rules
       +
Python deterministic scoring
       +
optional LLM
       |
       +--> ONLINE_RULES
       |
       +--> ONLINE_AI
```

El LLM es complementario.

Nunca es autoridad del sistema.

---

# 19. Consistencia Python / TypeScript

El scorer determinístico online y offline debe derivarse de una configuración versionada común.

Deben existir fixtures compartidos.

Conceptualmente:

```text
fixture
  |
  +--> Python scorer
  |
  +--> TypeScript scorer
```

Los resultados determinísticos equivalentes deben coincidir.

Si divergen, CI debe fallar.

---

# 20. LLM Provider

Recommendation Service debe abstraer al proveedor.

Conceptualmente:

```text
Recommendation Service
        |
        v
    LLMProvider
        |
   +----+----+
   |         |
Provider A Provider B
```

No hardcodear un único proveedor en la lógica de dominio.

El LLM no puede:

- inventar recursos institucionales;
- inventar misiones no autorizadas;
- reemplazar reglas obligatorias;
- tomar decisiones académicas autónomas;
- sancionar;
- diagnosticar;
- etiquetar públicamente riesgo.

---

# 21. Privacidad y ética

Principios obligatorios:

- consentimiento informado;
- participación voluntaria;
- posibilidad de retiro;
- minimización de datos;
- privacidad;
- control de acceso;
- almacenamiento seguro;
- pseudonimización cuando corresponda;
- anonimización para análisis;
- transparencia sobre IA;
- trazabilidad de recomendaciones.

No usar lenguaje visible como:

- high risk;
- student at risk;
- danger level.

Vivu acompaña.

No sanciona.

No diagnostica.

---

# 22. Datos permitidos / mínimos

El alcance autorizado puede incluir, según consentimiento:

- programa de ingeniería;
- semestre;
- carga académica percibida;
- materias percibidas como difíciles;
- disponibilidad de tiempo;
- responsabilidades externas;
- intereses;
- motivación;
- estrés/bienestar por autorreporte;
- prácticas de estudio;
- frecuencia de interacción;
- misiones aceptadas/completadas;
- modo recuperación;
- consulta de recursos institucionales.

Evitar sin aprobación formal:

- calificaciones;
- historias académicas;
- información institucional restringida;
- datos sensibles innecesarios.

---

# 23. Gamificación / ludificación

Vivu no es un videojuego.

La ludificación utiliza elementos de diseño de juegos aplicados a actividades académicas y de autorregulación.

Puede incluir:

- misiones;
- niveles;
- progreso visible;
- logros personales;
- rachas flexibles;
- retroalimentación positiva;
- metas mínimas viables.

Evitar:

- presión excesiva;
- rankings públicos;
- competencia dañina;
- rachas rígidas punitivas;
- recompensas que se sientan como control;
- sobrecarga visual.

La autonomía del estudiante es importante.

---

# 24. Modo recuperación

Es una función central.

Sirve para estudiantes que interrumpieron continuidad o tienen una semana difícil.

Debe:

- reducir carga;
- ofrecer metas mínimas viables;
- evitar castigo;
- facilitar retomar el ritmo;
- conectar con apoyos autorizados;
- adaptar mensajes y misiones.

No debe:

- avergonzar;
- penalizar;
- hacer comparaciones públicas;
- etiquetar al estudiante.

---

# 25. Analítica y eventos

Registrar únicamente eventos pertinentes.

Los contratos de eventos deben poder incluir (`EventEnvelope` en `@vivu/contracts`):

```text
eventId
eventType
occurredAt
actorId (opcional)
subjectId (opcional)
correlationId
schemaVersion
clientEventId (opcional, PWA)
clientOccurredAt (opcional, PWA)
connectivityMode (opcional: 'online' | 'offline_sync')
payload
```

Minimizar información personal.

Métricas de interés de la tesis:

- cumplimiento de tareas;
- incidencias;
- adherencia semanal;
- retención semanas 1, 4 y 10;
- misiones aceptadas/completadas;
- continuidad;
- uso del modo recuperación;
- claridad/usabilidad;
- utilidad percibida;
- pertinencia;
- presión/saturación;
- intención de continuar;
- comentarios cualitativos.

---

# 26. UX/UI — dirección aprobada

El diseño debe ser:

- limpio;
- amable;
- universitario;
- moderno;
- móvil primero;
- accesible;
- motivador sin parecer infantil;
- gamificado sin parecer videojuego;
- claro en estados offline/sincronización;
- respetuoso con autonomía y bienestar.

Pantallas principales STUDENT:

- login;
- registro;
- consentimiento;
- onboarding;
- home;
- misiones;
- detalle de misión;
- progreso;
- modo recuperación;
- recomendaciones;
- recursos;
- microcuestionarios;
- perfil;
- estados offline;
- sincronización.

Pantallas FACILITATOR:

- login;
- estudiantes asignados;
- detalle limitado de estudiante;
- señales de continuidad;
- actividad/resumen.

Pantallas ADMIN:

- dashboard;
- usuarios;
- asignaciones;
- catálogo de misiones;
- recursos;
- reglas;
- configuración;
- parámetros del piloto;
- recomendaciones;
- métricas;
- exportaciones autorizadas.

Existe una guía específica:

**`Vivu_Guia_Mockups_UX_UI.md` / `.docx`**

Usarla como referencia si está disponible.

---

# 27. Git y GitHub

Owner esperado:

`HinaraSM12`

Repo:

`vivu`

Rama estable:

`main`

Convención:

- código e identificadores: inglés;
- carpetas/servicios: inglés;
- ramas: inglés;
- commits: descripción en español;
- PRs: español;
- README/docs: español.

Conventional Commits:

- feat
- fix
- chore
- test
- docs
- ci
- refactor
- build
- perf

Ejemplos:

```text
chore: configurar monorepo con npm workspaces
feat: crear autenticación de estudiantes
feat: agregar onboarding inicial
test: agregar pruebas de autenticación
docs: documentar flujo de consentimiento
```

Evitar:

```text
update
changes
cambios
varios cambios
fix stuff
```

---

# 28. Flujo de trabajo Git

No desarrollar grandes funcionalidades directamente en `main`.

Flujo recomendado:

```text
main
  |
  +--> feat/sprint-N-...
         |
         +--> commits pequeños
         +--> tests
         +--> push
         +--> PR
         +--> CI
         +--> review
         +--> merge
```

Antes de considerar un sprint terminado:

- tests;
- lint;
- typecheck;
- build;
- CI;
- revisión del PR.

No afirmar éxito sin evidencia.

---

# 29. Sprint 0 — estado

**Sprint 0 fue ejecutado.**

Objetivo:

fundación técnica.

Incluyó conceptualmente:

- monorepo npm Workspaces;
- React + Vite;
- API Gateway NestJS;
- servicios NestJS iniciales;
- FastAPI recommendation-service;
- PostgreSQL;
- RabbitMQ;
- Docker Compose;
- health endpoints;
- `.env.example`;
- lint;
- typecheck;
- tests;
- build;
- GitHub Actions;
- documentación;
- PR.

En GitHub Actions se observaron jobs verdes:

- Calidad Node y TypeScript;
- Calidad Python;
- Contrato de Docker Compose.

También se verificó localmente que los comandos principales funcionaban.

Había warnings de GitHub Actions relacionados con acciones antiguas ejecutadas bajo una transición de Node, pero no eran fallos del workflow.

---

# 30. Roadmap aprobado — Sprints 1 a 9

## Sprint 1 — Identidad y acceso

- registro;
- login;
- logout;
- sesiones;
- RBAC;
- protección de rutas;
- pantallas iniciales;
- preparación para sesión offline futura.

Autoregistro únicamente STUDENT.

FACILITATOR y ADMIN no eligen libremente su rol desde registro.

## Sprint 2 — Consentimiento, onboarding y perfil

- consentimiento informado;
- captura mínima de contexto;
- disponibilidad;
- carga percibida;
- intereses;
- prácticas;
- perfil editable;
- eventos de onboarding.

## Sprint 3 — Misiones, ludificación y progreso

- catálogo;
- aceptación;
- finalización;
- progreso;
- logros;
- retroalimentación;
- eventos.

## Sprint 4 — Recursos, microcuestionarios y recuperación

- recursos institucionales;
- microcuestionarios;
- modo recuperación;
- metas mínimas viables;
- flujo de retomada.

## Sprint 5 — Recommender V1 online

- filtrado de candidatos;
- reglas;
- scoring determinístico;
- trazabilidad;
- LLM opcional;
- `LLMProvider`.

## Sprint 6 — PWA local-first

- Service Worker;
- IndexedDB;
- Outbox;
- Sync Engine;
- idempotencia;
- conflicto;
- recomendador offline TypeScript;
- fixtures compartidos Python/TS.

## Sprint 7 — Facilitador

- `support-service`;
- asignaciones;
- estudiantes;
- señales limitadas;
- seguimiento;
- actividad relevante.

## Sprint 8 — Administración

- usuarios;
- asignaciones;
- catálogos;
- recursos;
- reglas;
- configuración;
- parámetros;
- exportaciones.

## Sprint 9 — Analítica y preparación del piloto

- analítica;
- E2E;
- privacidad;
- hardening;
- pruebas técnicas;
- instrumentos;
- preparación de validación.

Existe un paquete específico de specs, planes y prompts para Sprints 1–9:

**`Vivu_Sprints_1_a_9_Specs_Planes_Prompts.zip`**

---

# 31. Reglas de implementación por sprint

Cada sprint debe tener:

- spec;
- plan;
- prompt de implementación;
- prompt de revisión;
- rama;
- commits pequeños;
- tests;
- PR;
- CI;
- cierre.

No ejecutar Sprints 1–9 todos juntos.

Flujo:

```text
Sprint 1
  ↓
PR
  ↓
CI
  ↓
review
  ↓
merge
  ↓
Sprint 2
  ↓
...
```

---

# 32. Precedencia de decisiones

Si hay contradicciones, usar:

1. instrucciones explícitas actuales del usuario;
2. ADRs aprobados;
3. master spec;
4. arquitectura;
5. producto;
6. IA / seguridad / testing;
7. planes;
8. preferencia de la IA.

Si existe contradicción arquitectónica real:

**detenerse y reportarla.**

No cambiar decisiones unilateralmente.

---

# 33. Documentos originales importantes

Si una conversación futura necesita máxima fidelidad académica, adjuntar además de este archivo:

1. `PROYECTO_DE_TESIS_HINARA_SANCHEZ (6).docx` y `PROYECTO_DE_TESIS_HINARA_SANCHEZ_v7_ACTUALIZADO.docx` (con espejo en `docs/thesis/proyecto-tesis-actualizado-v7.md`)
2. `Articulo_Revision_Sistematica_PRISMA_v5_FINAL.docx` (fuente autoritativa PRISMA V5: 57 estudios primarios)
3. `Versión 2_Marco arquitectónico para plataformas de acompañamiento estudiantil_ integración de ludificación e inteligencia artificial desde el diseño de software (1).docx`

Para trabajo técnico también son útiles:

3. `Vivu_Sprints_1_a_9_Specs_Planes_Prompts.zip`
4. `Vivu_Guia_Mockups_UX_UI.md`
5. documentación actual del repositorio `docs/`
6. último spec/plan del sprint actual.

---

# 34. Qué pasar en un chat futuro

## Caso A — Consulta general sobre Vivu

Adjuntar solamente:

**`VIVU_CONTEXT_HANDOFF.md`**

y decir:

> Lee este archivo completo y úsalo como contexto base de Vivu.

## Caso B — Quieres modificar código

Adjuntar:

- `VIVU_CONTEXT_HANDOFF.md`
- ZIP o archivos relevantes del repo, o acceso al repo si la herramienta puede leerlo
- spec/plan del sprint activo.

Decir:

> Usa el handoff como contexto funcional/arquitectónico y el código actual como autoridad sobre el estado implementado. Antes de proponer cambios, verifica qué existe realmente.

## Caso C — Quieres trabajar en la tesis

Adjuntar:

- `VIVU_CONTEXT_HANDOFF.md`
- documento de tesis;
- documento arquitectónico.

Decir:

> Distingue estrictamente entre lo que está respaldado por la tesis, decisiones de ingeniería posteriores e inferencias nuevas.

## Caso D — Quieres diseñar mockups

Adjuntar:

- `VIVU_CONTEXT_HANDOFF.md`
- `Vivu_Guia_Mockups_UX_UI.md`

Decir:

> Diseña respetando alcance, roles, privacidad, ludificación no punitiva, PWA y flujos definidos.

---

# 35. Qué debe actualizarse después de cada sprint

Después de cada merge actualizar este archivo con:

- sprint completado;
- PR;
- cambios arquitectónicos;
- ADR nuevos;
- decisiones funcionales;
- endpoints definitivos;
- eventos definitivos;
- modelos importantes;
- decisiones UX;
- librerías nuevas;
- riesgos/deuda técnica;
- siguiente sprint.

La sección **"Estado actual"** debe mantenerse especialmente actualizada.

---

# 36. Estado actual

## Proyecto

Vivu

## Repository

`HinaraSM12/vivu`

## Último sprint conocido

- **Sprint 0 completado** (PR #1 mergeado en `main`).
- **Sprint 1 — Identidad y acceso completado y mergeado en `main`** (PR #21, commit `3ebeb59`, Issue #2).
- **Sprint 2 — Consentimiento, onboarding y perfil + Actualización Integral Tesis V7 (PRISMA V5) completado y mergeado en `main`** (PR #22, commit `81e43a2`, Issue #3).
- **Sprint 3 — Misiones, ludificación y progreso completado y mergeado en `main`** (PR #23, commit `ea21092`, Issue #4).
- **Sprint 4 — Recursos institucionales, microcuestionarios y modo recuperación completado y mergeado en `main`** (PR #24, commit `e581b50`, Issue #5).
- **Sprint 5 — Recomendador V1 online (híbrido determinista + LLM instrumental) implementado** (sobre rama `feat/sprint-5-recommender-v1-online`, Issue #6).

### Resumen de lo entregado en Sprint 1 (mergeado):
- **Contratos (`@vivu/contracts`):** `RoleCode` (`STUDENT`, `FACILITATOR`, `ADMIN`), `AccountStatus`, `JwtAccessClaims`, `SessionCapabilities`, `SessionUserDto`, `AuthSessionResponse`, `OfflineSessionSnapshot`, `UserRegisteredEventPayload`.
- **Servicio de Identidad (`@vivu/identity-service`):** `PasswordHasher`, `TokenService`, `IdentityRepository` con seeds sintéticos, `AuthService` y `AuthController` (registro exclusivo `STUDENT`, emisión de `user.registered.v1` sin PII, login, rotación de refresh tokens con revocación de familia y logout).
- **API Gateway (`@vivu/api-gateway`):** `/api/v1/auth/*`, `/api/v1/me`, `/api/v1/*/access-check`, `JwtAuthGuard`, `RolesGuard` y `StandardErrorFilter`.
- **Frontend (`@vivu/web`):** Pantallas `STU-01` (Login) y `STU-02` (Registro exclusivo `STUDENT`), shells por rol, vista `403` y `SessionSnapshotStore`.

### Resumen de lo entregado en Sprint 2:
- **Contratos (`@vivu/contracts`):** `ConsentStatus` (`pending`, `accepted`, `withdrawn`), `PerceivedLoad`, `PreferredTone`, `ConsentRecordDto`, `PersonalizationPreferencesDto`, `WellbeingInputsDto`, `StudentProfileDto`, `ConsentUpdatedEventPayload`, `StudentProfileUpdatedEventPayload` y validador `findForbiddenProfileFields` (rechaza `gpa`, `grades`, `academicHistory`, `institutionalIdNumber`, `clinicalDiagnosis`).
- **Servicio de Estudiante (`@vivu/student-service`):**
  - `StudentRepository` con mapeo interno `analyticsSubjectId` seudónimo y seeds coherentes para `est.activo@vivu.local`, `est.recuperacion@vivu.local` y `est.nuevo@vivu.local`.
  - `StudentContextService` y `StudentController`: verificación obligatoria de consentimiento (`403 CONSENT_REQUIRED`) antes de guardar perfil/preferencias, bloqueo de campos sensibles no autorizados (`400 UNSUPPORTED_SENSITIVE_FIELD`), retiro voluntario de consentimiento (`POST /me/consent/withdraw`) que desactiva personalización y limpia `wellbeingInputs`, y emisión de `consent.updated.v1` y `student.profile_updated.v1` usando `analyticsSubjectId`.
- **API Gateway (`@vivu/api-gateway`):**
  - Endpoints protegidos bajo `@RequireRoles('STUDENT')`: `GET/POST /api/v1/me/consent`, `POST /api/v1/me/consent/withdraw`, `GET/PUT /api/v1/me/profile`, `GET/PUT /api/v1/me/personalization-preferences`.
- **Frontend (`@vivu/web`):**
  - Pantalla `STU-03` (Consentimiento informado v1.0 sin dark patterns, con opción de no aceptar y salir).
  - Wizard de Onboarding de 5 pasos (`STU-04` a `STU-08`: contexto académico, carga y asignaturas retadoras, disponibilidad y responsabilidades, prácticas e intereses, y bienestar opcional con botón de omitir).
  - Pantallas `STU-19` (Perfil editable) y `STU-20` (Privacidad y retiro voluntario del consentimiento).

### Resumen de la Actualización Integral Tesis V7 + PRISMA V5 + Arquitectura Vivu (45 requerimientos):
- **Documento de Tesis (`.docx` y `.md`):**
  - Actualizado `PROYECTO_DE_TESIS_HINARA_SANCHEZ (6).docx` in-place y generado `PROYECTO_DE_TESIS_HINARA_SANCHEZ_v7_ACTUALIZADO.docx` + espejo completo en `docs/thesis/proyecto-tesis-actualizado-v7.md`.
  - Sustituidas todas las cifras y gráficos antiguos de la revisión por **PRISMA V5** (`Articulo_Revision_Sistematica_PRISMA_v5_FINAL.docx`: Scopus, IEEE Xplore, ERIC; 2014–2026; 6.573 identificados, 1.240 duplicados, 5.333 únicos, 249 buscados, 72 recuperados, 63 revisados humanamente y **57 estudios empíricos primarios**; 6 figuras PNG actualizadas dentro del `.docx`).
  - Reformulado el enfoque conceptual: *"Sistema de ludificación adaptativa asistido por un modelo de lenguaje de gran escala"* (LLM ≠ ML predictivo), objetivo general con desarrollo y evaluación exploratoria, y OE4 centrado en calidad de software, QoE (ISO 9241-11 / ISO 9241-210), QoS, calidad instrumental del componente LLM, continuidad y pertinencia.
- **Nuevos ADRs, Gobernanza de Datos y Especificaciones (`docs/`):**
  - `docs/adr/006-multi-source-resource-ingestion-and-moderation.md`: ingesta multifuente (`InstitutionalWebCollector`, `InstitutionalMailConnector` con sanitización PII previa al LLM, y carga manual por `PROFESSOR`/`ADMIN`), estados `DRAFT` -> `PUBLISHED`, entidad `Resource` de 26 campos, `resource_versions`, deduplicación y prioridad de fuentes.
  - `docs/security/data-governance-matrix.md`: matriz formal de 11 columnas variable por variable y datos prohibidos por defecto.
  - Actualizados `docs/ai/llm-policy.md`, `docs/ai/recommender-v1.md`, `docs/ai/evaluation.md`, `docs/testing/analytics-events.md` (16 eventos canónicos), `docs/research/instrumentos-piloto.md` (dimensión de valor percibido de la universidad, 14 ítems QoE, constructos no clínicos `perceivedLoad` y `organizationDifficulty`) y `docs/security/privacy-and-consent.md`.
- **Contratos y Servicios Actualizados (`packages/` y `services/`):**
  - `@vivu/contracts`: creado `resource-contracts.ts` (26 campos de `InstitutionalResourceDto`, `ResourceVersionRecordDto`, `LlmExtractedResourcePayload`, `RecommendationTraceRecordDto`, `TelemetryEventRecordDto`, `canRecommendInstitutionalResource`, `sanitizeEmailContentBeforeLlm`), añadido rol `PROFESSOR` (`RESOURCE_CONTRIBUTOR`) en `auth-contracts.ts` y `organizationDifficulty` no clínico en `student-contracts.ts`.
  - `@vivu/identity-service`, `@vivu/student-service`, `@vivu/api-gateway` y `@vivu/web`: soporte para `PROFESSOR` (`prof.recursos@vivu.local`), `organizationDifficulty` en onboarding/perfil y bloqueo de diagnósticos clínicos (`clinicalStressDiagnosis`, `mentalHealthDiagnosis`).

### Resumen de lo entregado en Sprint 3:
- **Contratos (`@vivu/contracts`):** `gamification-contracts.ts` y `gamification-contracts.spec.ts` (`MissionCategoryCode`, `MissionEffortLevel`, `MissionAssignmentStatus`, `ProgressLevelCode`, `ContinuitySignal`, `MissionTemplateDto`, `MissionAssignmentDto`, `PersonalAchievementDto`, `StudentProgressSummaryDto`, `MissionFeedbackBannerDto`, `computeProgressLevel` para niveles personales 1–4 bajo `ruleVersion: "1.0.0"`, y `findForbiddenCompetitiveFields`).
- **Servicio de Ludificación (`@vivu/gamification-service`):**
  - `GamificationRepository` con las 7 misiones oficiales del seed (`MIS-PLAN-01` a `MIS-REC-01`), estados iniciales para `usr-stu-001` y `usr-stu-002`, y soporte de idempotencia mediante `clientEventId` / `Idempotency-Key`.
  - `GamificationService` y `GamificationController`: listado con filtros (`today`, `week`, `all`, `completed`, `category`), detalle de misión, aceptación (`mission.accepted.v1`), inicio, pausa sin castigo, posposición sin castigo (`mission.skipped.v1`), finalización idempotente (`mission.completed.v1`) con desbloqueo de logros personales (`ACH-FIRST-STEP`, `ACH-INITIAL-CONSISTENCY`, `ACH-BALANCED-EXPLORER`) y resumen de progreso personal sin rankings competitivos.
- **API Gateway (`@vivu/api-gateway`):**
  - `GatewayGamificationService` y `GamificationGatewayController` exponiendo `/api/v1/missions/catalog`, `/api/v1/missions`, `/api/v1/missions/:missionCode`, `/api/v1/missions/:missionCode/{accept,start,pause,skip,complete}` y `/api/v1/progress`, con pruebas E2E en `test/gamification.e2e-spec.ts`.
- **Frontend (`@vivu/web`):**
  - Pantallas `STU-09` (Inicio semanal con nivel y continuidad), `STU-10` (Lista y filtros de misiones), `STU-11` (Detalle de misión), `STU-12` (Misión en progreso con pausa y posposición sin castigo), `STU-13` (Feedback positivo al completar misión y logro desbloqueado) y `STU-14` (Progreso personal y logros no competitivos).

### Resumen de lo entregado en Sprint 4:
- **Contratos (`@vivu/contracts`):** `survey-contracts.ts` y `survey-contracts.spec.ts` (`SURVEY_CODES`, `RECOVERY_CHOICE_CODES`, `SurveyDefinitionDto`, `SurveyResponseRecordDto`, `RecoveryStateDto`, `validateSurveyQuestionsCount`).
- **Servicio de Recursos (`@vivu/resource-service`):** `ResourceRepository`, `ResourceService` y `ResourceController` conforme a `ADR-006` (catálogo de 5 recursos `PUBLISHED` vigentes y 1 recurso `EXPIRED` `RES-ARCH-01` excluido del catálogo estudiantil, historial `resource_versions`, detección de duplicados, propuestas por `PROFESSOR` en estado `PENDING_REVIEW`, moderación por `ADMIN` a `PUBLISHED` y evento `resource.viewed.v1`).
- **Servicio de Encuestas (`@vivu/survey-service`):** `SurveyRepository`, `SurveyService` y `SurveyController` con `SUR-WEEKLY-V1` (4 ítems) y `SUR-RECOVERY-V1` (2 ítems), idempotencia por `clientEventId` y emisión de `survey.submitted.v1`.
- **Modo Recuperación (`@vivu/gamification-service`):** Endpoints `GET /students/:studentId/recovery` y `POST /students/:studentId/recovery/activate`, selección de misiones de bajo esfuerzo elegibles (`isRecoveryEligible && effort === 'LOW'`) y emisión de `recovery.activated.v1`.
- **API Gateway (`@vivu/api-gateway`) y Frontend (`@vivu/web`):** Endpoints `/api/v1/resources/*`, `/api/v1/surveys/*` y `/api/v1/recovery/*` con pruebas E2E en `test/resources-surveys-recovery.e2e-spec.ts` y pantallas `STU-15`, `STU-17`, `STU-18` y envío de recursos por `PROFESSOR`.

### Resumen de lo entregado en Sprint 5:
- **Contratos (`@vivu/contracts`):** `recommendation-contracts.ts` y `recommendation-contracts.spec.ts` (`RecommendationSource`, `RecommendationReasonCode`, `RecommendationScoreBreakdownDto`, `RecommendationWeightConfigDto` v1.0.0, `RecommendationItemDto`, `RecordRecommendationActionRequest`, `computeDeterministicRecommendationScore`, `validateNonStigmatizingRationale`).
- **Servicio de Recomendaciones (`services/recommendation-service` en Python + FastAPI):**
  - `engine.py` y `main.py` con filtrado por reglas duras (modo recuperación exige `is_recovery_eligible && effort == "LOW"`, exclusión estricta de recursos no `PUBLISHED` como `RES-ARCH-01`, máximo 3 recomendaciones por corrida), puntaje determinista ponderado (`rule_version = "1.0.0"`), abstracción `LLMProvider` (`DisabledLLMProvider`, `ControlledContextualLLMProvider`, `FailingOrHallucinatingLLMProvider`) con fallback determinista a `ONLINE_RULES`, trazabilidad `RecommendationTraceRecord` y endpoint `/extract-resource` con sanitización PII (`ADR-006`).
  - Pruebas en `tests/test_recommender.py` validadas con `ruff`, `mypy --strict` y `pytest`.
- **API Gateway (`@vivu/api-gateway`) y Frontend (`@vivu/web`):**
  - `GatewayRecommendationService` y `RecommendationGatewayController` exponiendo `GET /api/v1/recommendations`, `POST /api/v1/recommendations/refresh`, `POST /api/v1/recommendations/:recommendationId/action` y `GET /api/v1/recommendations/traces` con pruebas E2E en `test/recommendations.e2e-spec.ts`.
  - Pantalla `STU-16` (*Recomendaciones explicadas*) en `@vivu/web` con explicación *"¿Por qué ves esta recomendación?"*, indicador de fuente (`ONLINE_AI` / `ONLINE_RULES`) y las 5 acciones de agencia del estudiante (`ACCEPT`, `POSTPONE`, `EDIT`, `REJECT`, `DISMISS_SIMILAR`).

## Próximo sprint planeado

**Sprint 6 — PWA local-first y sincronización offline (`Outbox`, `IndexedDB`, `SyncEngine`, recomendador determinista TS `OFFLINE_RULES`, endpoints `/api/v1/sync/*` y pantalla `STU-21`).**

## Mockups

Existe la guía maestra en `docs/ux/mockup-guide.md` (`Vivu_Guia_Mockups_UX_UI.md`) y `docs/ux/figma-spec.md` para diseño en Figma.

## Gobernanza, Seeds, Instrumentos y Bitácora de Tesis

- **Roadmap canónico Sprints 1–9:** `docs/roadmap/vivu-sprint-roadmap.md`
- **Guía de mockups UX/UI:** `docs/ux/mockup-guide.md`
- **Seeds sintéticos iniciales:** `docs/architecture/seed-data-spec.md`
- **Instrumentos del piloto (consentimiento, guion, cuestionarios, entrevista):** `docs/research/instrumentos-piloto.md`
- **Bitácora de tesis por sprint:** `docs/thesis/bitacora-sprints.md`
- **Automatización de gobernanza GitHub (protección de `main` + Issues):** `scripts/setup-github-governance.ps1`, `.github/dependabot.yml`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/sprint-story.yml`

## Decisiones pendientes típicas

Antes de implementar cada sprint revisar:

- si el spec actual coincide con el repo;
- si hubo nuevos ADR;
- si los mockups aprobados cambian el flujo;
- si existen dependencias técnicas no previstas;
- si los contratos API/eventos ya fueron modificados.

---

# 37. Prompt recomendado para restaurar contexto

Copiar exactamente en una conversación nueva:

```text
Estoy trabajando en el proyecto Vivu.

Lee completamente el archivo adjunto VIVU_CONTEXT_HANDOFF.md.

Úsalo como contexto base del proyecto y como resumen de las decisiones ya aprobadas.

Reglas:

1. No cambies arquitectura, stack, roles, nombres de servicios, estrategia PWA/offline, reglas de privacidad o estrategia de recomendación sin señalarlo primero.
2. Si hay una contradicción entre el handoff y archivos más recientes del repositorio, señala la contradicción y usa como autoridad el estado más reciente aprobado.
3. No inventes que una funcionalidad ya existe: verifica el código o los archivos que te proporcione.
4. Mantén código e identificadores técnicos en inglés.
5. Mantén documentación, commits y Pull Requests en español.
6. Respeta Conventional Commits.
7. Vivu es un prototipo de tesis, no una plataforma institucional definitiva.
8. No uses lenguaje punitivo ni etiquetas públicas de riesgo.
9. La IA es instrumental y subordinada a reglas y contenidos autorizados.
10. Antes de implementar cambios importantes, explícame lo que entendiste, el alcance y los archivos que tocarías.

Después de leerlo, responde primero con:
- estado del proyecto que entendiste;
- arquitectura que entendiste;
- sprint actual;
- cualquier contradicción o información faltante.

No implementes nada hasta que te dé la siguiente tarea.
```

---

# 38. Regla final para cualquier IA

Este handoff resume decisiones del proyecto, pero no reemplaza evidencia del código.

Cuando una tarea depende de saber **qué está implementado hoy**, inspeccionar el repositorio o los archivos actuales antes de afirmar el estado.

Cuando una tarea depende de **qué dice la tesis**, consultar los documentos originales si están disponibles.

Cuando una tarea depende de una **decisión de arquitectura ya aprobada**, respetar este handoff y los ADR más recientes.

---

**Fin del handoff de contexto Vivu.**
