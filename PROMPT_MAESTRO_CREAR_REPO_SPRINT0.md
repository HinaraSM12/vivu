# PROMPT MAESTRO — CREACIÓN DEL REPOSITORIO Y SPRINT 0

Quiero que construyas la fundación técnica de una aplicación de
acompañamiento estudiantil con ludificación, inteligencia artificial,
personalización y funcionamiento PWA local-first.

Te proporcionaré un paquete ZIP que contiene la documentación técnica,
funcional, arquitectónica y de producto del proyecto.

La documentación proporcionada es la FUENTE DE VERDAD del proyecto.

No debes reinterpretar libremente la arquitectura ni sustituir tecnologías,
roles, límites de servicios o decisiones ya tomadas por tus preferencias
personales.

==================================================
0. IDENTIDAD DEL PROYECTO
==================================================

GitHub owner:

HinaraSM12

Nombre comercial de la aplicación:

APP_NAME=<PENDIENTE_DE_DEFINIR>

Nombre del repositorio:

REPO_NAME=<PENDIENTE_DE_DEFINIR>

El nombre del repositorio deberá derivarse del nombre de la aplicación.

Convención recomendada:

- minúsculas
- sin espacios
- sin tildes
- guiones solamente cuando sean necesarios
- nombre corto y reconocible

Ejemplo:

APP_NAME=Levelia
REPO_NAME=levelia

IMPORTANTE:

Si APP_NAME o REPO_NAME siguen marcados como:

<PENDIENTE_DE_DEFINIR>

NO debes crear todavía el repositorio remoto de GitHub.

Puedes:

- leer documentación
- analizar arquitectura
- detectar contradicciones
- proponer estructura
- preparar el plan de Sprint 0

Pero debes esperar mi confirmación del nombre antes de ejecutar:

gh repo create

==================================================
1. IDIOMA DEL PROYECTO
==================================================

La documentación destinada a personas debe estar escrita en ESPAÑOL.

Los mensajes de commit deben estar escritos en ESPAÑOL.

Los títulos y descripciones de Pull Requests deben estar escritos en ESPAÑOL.

Los comentarios explicativos importantes pueden estar en español.

Sin embargo:

- código fuente
- nombres de archivos técnicos
- variables
- funciones
- clases
- interfaces
- tipos
- DTOs
- endpoints
- eventos
- nombres de paquetes
- nombres de servicios
- nombres internos de módulos

deben escribirse preferentemente en INGLÉS siguiendo las convenciones
habituales de desarrollo de software.

Para Git se utilizará Conventional Commits.

Los tipos estándar permanecen en inglés:

feat
fix
chore
test
docs
ci
refactor
build
perf

Pero la descripción posterior debe estar en ESPAÑOL.

Ejemplos correctos:

chore: inicializar repositorio
chore: configurar monorepo con npm workspaces
feat: crear aplicación web con React y Vite
feat: crear gateway de API
feat: crear servicios de dominio iniciales
feat: crear servicio de recomendaciones con FastAPI
chore: configurar PostgreSQL y RabbitMQ
chore: agregar infraestructura con Docker Compose
test: agregar pruebas de salud de los servicios
test: agregar pruebas de contratos compartidos
ci: configurar validaciones de integración continua
docs: documentar entorno de desarrollo local
fix: corregir validación de variables de entorno
refactor: separar configuración compartida

Ejemplos NO permitidos:

feat: add api gateway
chore: initialize monorepo
fix: update configuration
docs: add readme

Tampoco utilices mensajes vagos como:

cambios
actualización
varios cambios
arreglos
update
changes
fix stuff

Cada commit debe explicar claramente qué cambio contiene.

==================================================
2. DOCUMENTACIÓN OBLIGATORIA
==================================================

Descomprime el paquete de documentación proporcionado.

Los documentos deben quedar posteriormente incluidos dentro del repositorio.

Antes de escribir código, lee como mínimo en este orden:

1. docs/00-master-spec.md

2. todos los ADR ubicados en:

docs/adr/

3. arquitectura:

docs/architecture/architecture.md
docs/architecture/services.md
docs/architecture/data-model.md
docs/architecture/api-contracts.md
docs/architecture/event-catalog.md
docs/architecture/pwa-offline-sync.md

4. producto:

docs/product/product-backlog.md
docs/product/user-stories.md
docs/product/acceptance-criteria.md

5. inteligencia artificial:

docs/ai/recommender-v1.md
docs/ai/llm-policy.md
docs/ai/evaluation.md

6. seguridad:

docs/security/access-control.md
docs/security/privacy-and-consent.md

7. testing:

docs/testing/test-strategy.md
docs/testing/analytics-events.md

8. planes:

docs/superpowers/plans/2026-08-19-sprint-0-foundation.md
docs/superpowers/plans/2026-08-19-pwa-offline-sync.md

Si algún archivo tiene un nombre ligeramente diferente, localiza el
documento equivalente dentro del paquete.

No inventes silenciosamente el contenido de documentos que no encuentres.

Si falta un documento mencionado:

repórtalo.

==================================================
3. ORDEN DE PRECEDENCIA
==================================================

Si encuentras contradicciones utiliza este orden de autoridad:

1. instrucciones explícitas que yo dé en este chat
2. ADRs aprobados
3. docs/00-master-spec.md
4. documentos de arquitectura
5. documentos de producto
6. documentos de IA, seguridad y testing
7. planes de implementación
8. tus preferencias técnicas

Tus preferencias técnicas tienen la prioridad más baja.

Si existe una contradicción arquitectónica real:

DETENTE Y REPÓRTALA.

No tomes unilateralmente una decisión diferente.

Si crees que una decisión arquitectónica debe modificarse:

propón un ADR nuevo antes de cambiarla.

==================================================
4. OBJETIVO DE ESTA EJECUCIÓN
==================================================

Implementa solamente:

SPRINT 0 — FOUNDATION

El objetivo de Sprint 0 es obtener un repositorio:

- real
- versionado
- alojado en GitHub
- ejecutable
- reproducible
- probado
- documentado
- preparado para continuar el desarrollo

NO debes implementar toda la aplicación durante Sprint 0.

NO debes implementar todavía toda la PWA offline.

NO debes implementar todavía toda la sincronización.

NO debes implementar todavía todo el recomendador.

Sprint 0 debe construir las bases técnicas correctas.

==================================================
5. STACK TECNOLÓGICO APROBADO
==================================================

FRONTEND

React
TypeScript
Vite

GESTIÓN DEL MONOREPO

npm
npm Workspaces

No utilizar pnpm.

No utilizar Yarn.

No utilizar Turborepo.

No utilizar Nx.

BACKEND PRINCIPAL

Node.js
TypeScript
NestJS

RECOMMENDATION SERVICE

Python
FastAPI

BASE DE DATOS

PostgreSQL

MENSAJERÍA

RabbitMQ

INFRAESTRUCTURA LOCAL

Docker
Docker Compose

CONTRATOS

OpenAPI
contratos de eventos versionados

TESTING

Vitest
Jest
Playwright
Pytest

según corresponda a cada componente.

==================================================
6. TECNOLOGÍAS QUE NO DEBES INTRODUCIR
==================================================

No agregues sin mi aprobación explícita:

pnpm
Yarn
Turborepo
Nx
Kafka
Redis
Kubernetes
service mesh
GraphQL
Firebase
Supabase
MongoDB
microfrontends

No reemplaces:

React por Next.js

Vite por otro sistema de build

NestJS por Express puro

FastAPI por Node.js

RabbitMQ por Kafka

PostgreSQL por otra base

npm Workspaces por otro gestor de monorepo

microservicios por monolito modular

Estas decisiones ya fueron tomadas.

==================================================
7. ROLES DEL SISTEMA
==================================================

Los roles iniciales son exclusivamente:

STUDENT
FACILITATOR
ADMIN

No existe el rol:

RESEARCHER

Las funciones relacionadas con:

- administración del piloto
- configuración
- catálogos
- recursos
- reglas
- exportación autorizada
- métricas globales

pertenecen a ADMIN.

==================================================
8. ARQUITECTURA GENERAL
==================================================

La solución utiliza microservicios separados por dominio.

Debe contemplar conceptualmente:

apps/
  web
  api-gateway

services/
  identity-service
  student-service
  gamification-service
  resource-service
  survey-service
  facilitator-service
  analytics-service
  recommendation-service

La documentación puede establecer nombres más específicos.

En ese caso respeta la documentación.

Arquitectura conceptual:

React Web App
      |
      v
API Gateway
      |
      +-------------------------------+
      |               |               |
      v               v               v
Identity       Student Context    Gamification
Service          Service            Service

      |               |               |
      +---------------+---------------+
                      |
              otros servicios
                      |
                   RabbitMQ
                      |
                 PostgreSQL

El frontend NO debe comunicarse directamente con los microservicios internos.

Todo tráfico externo de API pasa por:

API Gateway

==================================================
9. API GATEWAY
==================================================

El API Gateway debe ocuparse principalmente de:

- routing
- authentication boundary
- authorization orchestration
- correlation IDs
- manejo transversal de requests
- exposición externa controlada

NO conviertas el API Gateway en un monolito.

La lógica de negocio debe permanecer en los servicios de dominio.

==================================================
10. REGLAS DE NEGOCIO
==================================================

Las reglas de ludificación pertenecen al backend.

No implementes reglas críticas solamente en React.

El frontend:

- presenta información
- captura interacciones
- mantiene estado local cuando corresponda
- consume contratos
- soportará funcionamiento offline

Pero la autoridad de negocio online continúa en los servicios correspondientes.

==================================================
11. DATOS
==================================================

Cada servicio es propietario de sus datos.

No diseñes tablas que varios microservicios modifiquen directamente.

En desarrollo local se permite utilizar:

1 instancia PostgreSQL

pero con separación lógica de datos por servicio según establezca la
documentación.

Una sola instancia PostgreSQL en local NO significa una base compartida
conceptualmente.

Evita acoplamiento directo mediante tablas.

La comunicación entre dominios debe realizarse mediante:

- APIs
- eventos

==================================================
12. PWA — DECISIÓN ARQUITECTÓNICA
==================================================

La aplicación evolucionará a una:

Progressive Web App

con arquitectura:

local-first

Esta decisión debe considerarse desde Sprint 0.

No significa que Sprint 0 deba implementar toda la funcionalidad offline.

Significa que NO debes tomar decisiones que hagan difícil agregarla posteriormente.

==================================================
13. CAPACIDADES OFFLINE POR ROL
==================================================

STUDENT

Será el rol con experiencia offline completa.

Debe poder llegar a realizar sin conexión:

- abrir una sesión previamente habilitada
- abrir la aplicación
- consultar información previamente sincronizada
- consultar misiones
- aceptar misiones cuando sea válido
- completar misiones
- consultar progreso local
- activar modo recuperación
- consultar recursos institucionales previamente sincronizados
- responder microcuestionarios
- registrar interacciones
- obtener recomendaciones determinísticas offline

FACILITATOR

Será principalmente online.

Puede disponer posteriormente de:

- lectura cacheada limitada
- datos previamente sincronizados

No necesita administración offline completa.

ADMIN

Las operaciones administrativas de escritura serán ONLINE.

No implementes administración offline.

==================================================
14. ARQUITECTURA PWA FUTURA
==================================================

La arquitectura prevista debe permitir:

React + Vite
      |
      +--> PWA
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

Sprint 0 NO tiene que construir completamente estos componentes.

Sí debe preparar una organización de frontend que permita separar:

- remote server state
- local persistent state
- synchronization state
- UI state

No coloques toda la lógica de estado directamente dentro de componentes React.

==================================================
15. SINCRONIZACIÓN OFFLINE FUTURA
==================================================

Las acciones realizadas sin conexión seguirán conceptualmente:

User action
     |
     v
IndexedDB
     |
     +--> local state
     |
     +--> Outbox
             |
             | vuelve internet
             v
         Sync Engine
             |
             v
         API Gateway
             |
             v
      servicio correspondiente

Las acciones sincronizables deberán poder asociarse a identificadores
idempotentes como:

clientEventId

Los endpoints que procesen estas operaciones deberán diseñarse para soportar:

idempotency

Reenviar una misma operación no debe duplicar:

- una misión completada
- una respuesta
- un evento
- una actualización lógica

==================================================
16. CONFLICTOS OFFLINE
==================================================

No utilices un:

last-write-wins global

para todos los tipos de datos.

Principios:

SERVIDOR

Es autoridad sobre:

- catálogos
- reglas
- permisos
- recursos institucionales
- configuración
- versiones oficiales

CLIENTE

Debe preservar acciones válidas realizadas legítimamente offline por el
estudiante.

Ejemplo:

Si un estudiante completó una misión correctamente mientras estaba offline,
esa acción no debe desaparecer únicamente porque el catálogo cambió antes
de sincronizar.

La sincronización deberá poder manejar:

- entity version
- rule version
- clientEventId
- timestamps apropiados

La implementación completa pertenece al plan PWA posterior.

==================================================
17. RECOMMENDATION SERVICE
==================================================

El servicio online de recomendaciones será:

Python + FastAPI

La estrategia V1 será:

business rules
       +
deterministic scoring
       +
optional LLM

No entrenes modelos de machine learning durante Sprint 0.

No construyas un modelo predictivo de deserción.

El recomendador debe trabajar únicamente sobre:

- misiones autorizadas
- recursos autorizados
- información mínima permitida

==================================================
18. RECOMENDADOR OFFLINE
==================================================

La estrategia aprobada es:

deterministic local fallback

Cuando no exista conexión:

local student context
        +
synced missions/resources
        +
versioned rules
        |
        v
TypeScript scoring engine
        |
        v
OFFLINE_RULES

No se ejecutará un LLM remoto sin conexión.

==================================================
19. RECOMENDADOR ONLINE
==================================================

Cuando exista conexión:

business rules
       +
Python deterministic scoring
       +
optional LLM
       |
       +--> ONLINE_RULES
       |
       +--> ONLINE_AI

El LLM es complementario.

NO es la autoridad del sistema.

==================================================
20. CONSISTENCIA PYTHON / TYPESCRIPT
==================================================

El recomendador determinístico online y offline debe basarse en una
configuración de reglas versionada.

Evita mantener dos algoritmos completamente independientes.

Debe ser posible utilizar fixtures compartidos.

Conceptualmente:

fixture de entrada
       |
       +--> Python scorer
       |
       +--> TypeScript scorer

Python result == TypeScript result

Si los resultados determinísticos equivalentes divergen:

CI debe fallar.

La especificación de recommender-v1 es autoridad sobre pesos y campos
definitivos.

==================================================
21. LLM PROVIDER
==================================================

Recommendation Service debe abstraer el proveedor LLM.

Conceptualmente:

Recommendation Service
        |
        v
    LLMProvider
        |
   +----+----+
   |         |
Provider A Provider B

No hardcodees un único proveedor en la lógica de dominio.

No agregues claves reales durante Sprint 0.

El LLM NO puede:

- inventar recursos institucionales
- inventar misiones no autorizadas
- reemplazar reglas obligatorias
- tomar decisiones académicas autónomas
- generar sanciones
- diagnosticar estudiantes
- etiquetar públicamente estudiantes como de alto riesgo

==================================================
22. ESTRUCTURA ESPERADA DEL REPOSITORIO
==================================================

Usa los documentos como autoridad.

Conceptualmente espero algo similar a:

/
├── apps/
│   ├── web/
│   └── api-gateway/
│
├── services/
│   ├── identity-service/
│   ├── student-service/
│   ├── gamification-service/
│   ├── resource-service/
│   ├── survey-service/
│   ├── facilitator-service/
│   ├── analytics-service/
│   └── recommendation-service/
│
├── packages/
│   ├── shared-types/
│   ├── api-contracts/
│   ├── event-contracts/
│   └── shared-config/
│
├── infra/
│
├── docs/
│
├── .github/
│   └── workflows/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
└── README.md

Puedes ajustar esta estructura únicamente cuando la documentación establezca
una mejor organización.

==================================================
23. PAQUETES COMPARTIDOS
==================================================

Los packages compartidos pueden contener:

- tipos
- DTOs
- schemas
- contratos API
- contratos de eventos
- enums realmente globales
- utilidades de configuración sin lógica de dominio

No crees un paquete shared gigantesco.

No coloques reglas de negocio específicas de un servicio dentro de packages/shared.

==================================================
24. NPM WORKSPACES
==================================================

El proyecto utilizará:

npm Workspaces

Desde la raíz deben existir comandos coherentes para:

npm install
npm run dev
npm run build
npm run test
npm run lint
npm run typecheck

Si Python requiere comandos adicionales:

documentarlos claramente en README.

==================================================
25. RECOMMENDATION SERVICE PYTHON
==================================================

El servicio:

services/recommendation-service

debe utilizar:

Python
FastAPI

Debe quedar preparado con:

- health endpoint
- tests
- lint
- type checking
- environment validation
- configuración clara

No introduzcas complejidad Python innecesaria.

==================================================
26. DOCKER COMPOSE
==================================================

Debe existir:

docker-compose.yml

Quiero poder ejecutar:

docker compose up -d

Como mínimo debe iniciar:

PostgreSQL
RabbitMQ

Incluye health checks cuando sean razonables.

Docker Compose debe estar orientado inicialmente a desarrollo local reproducible.

No diseñes infraestructura empresarial.

==================================================
27. VARIABLES DE ENTORNO
==================================================

Crea:

.env.example

No escribas secretos reales.

Debe documentar variables necesarias para:

- web
- API Gateway
- servicios
- PostgreSQL
- RabbitMQ
- JWT/authentication
- Recommendation Service
- futuro proveedor LLM

Los servicios deben validar configuración al iniciar.

Si falta una variable obligatoria:

fail fast

con mensaje claro.

==================================================
28. SEGURIDAD
==================================================

Desde Sprint 0 aplica:

- TypeScript strict
- input validation
- configuration validation
- RBAC foundation
- secure defaults
- no secrets in repository
- minimización de datos
- control de acceso
- separación de responsabilidades

No agregues información personal:

"por si después sirve"

==================================================
29. PRIVACIDAD Y ÉTICA
==================================================

El sistema debe respetar:

- consentimiento informado
- participación voluntaria
- minimización de datos
- autonomía
- privacidad
- control de acceso
- pseudonimización cuando corresponda
- anonimización para análisis cuando corresponda
- trazabilidad de recomendaciones
- transparencia del uso de IA

No utilices lenguaje visible al usuario como:

high risk
student at risk
danger level

El sistema acompaña.

No sanciona.

No diagnostica.

==================================================
30. EVENTOS
==================================================

RabbitMQ será el broker de eventos.

Los eventos deben tener contratos explícitos.

Deben poder incluir conceptualmente:

eventId
eventType
eventVersion
occurredAt
correlationId
payload

No publiques datos personales innecesarios.

Los contratos deben estar versionados.

==================================================
31. OBSERVABILIDAD BÁSICA
==================================================

Sprint 0 debe contemplar solamente:

- structured logging
- correlation/request IDs
- health endpoints
- error handling consistente

No agregues todavía infraestructura compleja como:

ELK
Datadog
Grafana
Prometheus completo
service mesh
observabilidad empresarial

salvo aprobación explícita.

==================================================
32. TESTING
==================================================

La calidad debe configurarse desde Sprint 0.

Utiliza según corresponda:

Vitest
Jest
Pytest
Playwright

Tipos de prueba previstos:

- unit
- integration
- contract
- E2E

No escribas tests vacíos únicamente para tener checks verdes.

==================================================
33. GITHUB ACTIONS
==================================================

Configura CI desde Sprint 0.

Para Node/TypeScript el pipeline debe verificar al menos:

npm ci
lint
typecheck
test
build

Para Python debe verificar al menos:

install dependencies
lint
typecheck
pytest

El pipeline debe fallar si falla una validación obligatoria.

No utilices:

|| true

o equivalentes para ocultar errores.

==================================================
34. GITHUB
==================================================

El proyecto debe estar alojado en GitHub desde el inicio de la implementación.

Owner obligatorio:

HinaraSM12

Repositorio:

HinaraSM12/${REPO_NAME}

Visibilidad inicial:

PRIVATE

No crees el repositorio bajo otra cuenta.

==================================================
35. VERIFICACIÓN DE GITHUB CLI
==================================================

Antes de crear el repositorio ejecuta:

gh --version
gh auth status
gh api user --jq .login

El último comando debe devolver exactamente:

HinaraSM12

Si devuelve otro usuario:

DETENTE.

No crees el repositorio.

No realices push.

Infórmame:

"GitHub CLI está autenticado con una cuenta diferente de HinaraSM12."

Espera mis instrucciones.

Nunca me solicites publicar en el chat:

- contraseña
- Personal Access Token
- claves privadas
- secretos

==================================================
36. INICIALIZACIÓN DE GIT
==================================================

Solo después de que:

APP_NAME

y

REPO_NAME

estén confirmados y yo haya aprobado tu plan de Sprint 0.

Primero comprueba:

pwd
git status
git remote -v

Si ya existe un repositorio Git:

analízalo antes de ejecutar git init.

No sobrescribas un repositorio existente accidentalmente.

Si no existe repositorio:

git init
git branch -M main

==================================================
37. PRIMER COMMIT
==================================================

Antes del primer commit comprueba:

git status

Verifica que NO se estén incluyendo:

.env
API keys
tokens
passwords
node_modules
venv
.venv
build outputs
dist
IDE secrets

El primer commit deberá utilizar español:

git add .
git commit -m "chore: inicializar repositorio"

==================================================
38. CREAR REPOSITORIO REMOTO
==================================================

Después de verificar que GitHub CLI está autenticado como:

HinaraSM12

crea el repo:

gh repo create "HinaraSM12/${REPO_NAME}" \
  --private \
  --source=. \
  --remote=origin \
  --push

Después verifica:

git remote -v
git status
git branch -vv

Confirma que origin apunta a:

HinaraSM12/${REPO_NAME}

==================================================
39. ESTRATEGIA DE RAMAS
==================================================

La rama estable será:

main

Después del commit inicial crea:

git checkout -b chore/sprint-0-foundation

Los nombres técnicos de ramas pueden permanecer en inglés.

Los mensajes de commit deben estar en español.

No hagas trabajo grande directamente sobre main.

No hagas force push sobre main.

==================================================
40. COMMITS DURANTE SPRINT 0
==================================================

Usa commits pequeños y coherentes.

Todos los mensajes deben estar en español.

Mantén los prefijos Conventional Commits.

Ejemplos:

chore: inicializar repositorio

chore: configurar monorepo con npm workspaces

feat: crear aplicación web con React y Vite

feat: crear gateway de API con NestJS

feat: crear servicios de dominio

feat: crear servicio de recomendaciones con FastAPI

chore: configurar PostgreSQL y RabbitMQ

chore: agregar Docker Compose

test: agregar pruebas de salud de los servicios

test: agregar pruebas de contratos

ci: configurar validaciones de integración continua

docs: documentar desarrollo local

fix: corregir validación de configuración

refactor: separar configuración compartida

No hagas un solo commit gigantesco al final.

==================================================
41. PUSH CONTINUO
==================================================

Después de cada bloque estable de trabajo sigue:

pruebas
   ↓
verificación
   ↓
commit
   ↓
push

El trabajo no debe existir únicamente en local.

Después de configurar upstream utiliza:

git push

No hagas push si:

- los tests relevantes están rotos
- sabes que existen secretos en el commit
- el build correspondiente está roto sin documentar

==================================================
42. PULL REQUEST DE SPRINT 0
==================================================

Al finalizar Sprint 0:

git push -u origin chore/sprint-0-foundation

Crea un Pull Request hacia main:

gh pr create \
  --base main \
  --head chore/sprint-0-foundation \
  --title "chore: fundación técnica del Sprint 0" \
  --body "Implementa la fundación técnica del proyecto según la especificación aprobada y el plan del Sprint 0."

El título y descripción deben estar en español.

No hagas merge automático.

==================================================
43. CI ANTES DE MERGE
==================================================

Comprueba GitHub Actions.

Si algún check falla:

1. investiga la causa
2. reproduce el problema cuando sea posible
3. corrige
4. ejecuta validaciones locales
5. crea commit en español
6. push
7. espera el nuevo resultado de CI

No:

- desactives tests
- ignores lint
- uses || true
- reduzcas artificialmente validaciones

solo para conseguir CI verde.

==================================================
44. README
==================================================

README.md debe estar escrito en español.

Debe explicar:

- qué es el proyecto
- objetivo
- arquitectura
- stack
- requisitos previos
- instalación
- variables de entorno
- Docker Compose
- cómo iniciar PostgreSQL
- cómo iniciar RabbitMQ
- cómo ejecutar frontend
- cómo ejecutar gateway
- cómo ejecutar servicios NestJS
- cómo ejecutar FastAPI
- cómo ejecutar tests
- cómo ejecutar lint
- cómo ejecutar typecheck
- cómo hacer build
- estructura del monorepo
- estrategia de ramas
- documentación disponible
- contribución básica

No escribas marketing genérico.

==================================================
45. SPRINT 0 DEBE ENTREGAR
==================================================

Al finalizar quiero disponer de:

- repositorio GitHub privado
- owner HinaraSM12
- main
- rama chore/sprint-0-foundation
- Pull Request

- monorepo npm Workspaces

- React
- TypeScript
- Vite

- estructura frontend preparada para futura PWA

- API Gateway NestJS

- Identity Service inicializado

- Student Service inicializado

- Gamification Service inicializado

- Resource Service inicializado

- Survey Service inicializado

- Facilitator Service inicializado

- Analytics Service inicializado

- Recommendation Service FastAPI inicializado

- PostgreSQL

- RabbitMQ

- Docker Compose

- health endpoints

- .env.example

- configuración validada

- TypeScript strict

- lint

- typecheck

- tests

- build

- GitHub Actions

- README en español

- documentación dentro de docs/

- ausencia de secretos versionados

==================================================
46. LO QUE NO DEBES CONSTRUIR TODAVÍA
==================================================

No construyas completamente durante Sprint 0:

- onboarding funcional completo
- dashboard Student completo
- dashboard Facilitator completo
- dashboard Admin completo

- catálogo funcional completo de misiones
- motor completo de ludificación
- progresión completa

- Service Worker avanzado
- IndexedDB completo
- Outbox completa
- Sync Engine completo
- resolución completa de conflictos offline

- recomendador final
- scoring definitivo salvo scaffolding requerido
- prompts definitivos del LLM
- integración con proveedor LLM real
- entrenamiento de modelos ML

- modelo predictivo de deserción

- integración con sistemas institucionales reales

- push notifications productivas

- aplicación móvil nativa

- Kubernetes

- despliegue cloud productivo

Estas funcionalidades se desarrollarán mediante planes e historias
posteriores.

==================================================
47. PLAN DE IMPLEMENTACIÓN
==================================================

Sigue principalmente:

docs/superpowers/plans/2026-08-19-sprint-0-foundation.md

El plan:

docs/superpowers/plans/2026-08-19-pwa-offline-sync.md

es una referencia para evitar decisiones incompatibles con la PWA futura.

NO debes ejecutar completamente el plan PWA durante Sprint 0.

==================================================
48. FORMA DE TRABAJO
==================================================

Para cada tarea:

1. identifica los archivos que serán creados o modificados

2. identifica las interfaces que produce o consume

3. escribe o ajusta pruebas cuando corresponda

4. ejecuta las pruebas y observa el resultado

5. implementa el cambio mínimo correcto

6. vuelve a ejecutar las pruebas

7. ejecuta lint/typecheck cuando corresponda

8. corrige errores

9. verifica nuevamente

10. ejecuta git status

11. crea un commit con mensaje en español

12. push de la rama

No afirmes:

"funciona"

"tests pass"

"build exitoso"

"CI correcto"

sin haber ejecutado realmente la comprobación correspondiente.

==================================================
49. PROTECCIÓN CONTRA REINTERPRETACIÓN POR IA
==================================================

No cambies automáticamente:

React -> Next.js

Vite -> otro bundler

npm -> pnpm

NestJS -> Express

RabbitMQ -> Kafka

PostgreSQL -> MongoDB

FastAPI -> Node.js

microservices -> modular monolith

PWA -> aplicación móvil nativa

offline local-first -> online-only

Python recommendation service -> TypeScript recommendation service

aunque consideres otra opción técnicamente atractiva.

Si crees que algo debe cambiar:

explícalo primero.

No lo implementes sin aprobación.

==================================================
50. CRITERIO DE TERMINADO
==================================================

Sprint 0 solamente puede considerarse terminado cuando puedas demostrar:

Git repository OK

GitHub owner HinaraSM12 OK

GitHub remote OK

private repository OK

main OK

chore/sprint-0-foundation OK

Pull Request OK

CI OK

npm install OK

npm Workspaces OK

React/Vite starts OK

API Gateway starts OK

NestJS services start OK

FastAPI starts OK

PostgreSQL healthy OK

RabbitMQ healthy OK

Docker Compose OK

tests OK

lint OK

typecheck OK

build OK

README OK

docs present OK

.env.example OK

no secrets committed OK

==================================================
51. PRIMERA RESPUESTA OBLIGATORIA
==================================================

ANTES DE MODIFICAR ARCHIVOS debes responderme con un análisis previo.

Tu primera respuesta debe contener estas secciones:

A. INTERPRETACIÓN DEL PRODUCTO

Resume en tus propias palabras:

- propósito de la aplicación
- alcance
- roles
- flujo general
- límites de Sprint 0

B. INTERPRETACIÓN DE LA ARQUITECTURA

Explica:

- frontend
- API Gateway
- microservicios
- PostgreSQL
- RabbitMQ
- Recommendation Service
- PWA
- estrategia offline
- sincronización futura
- seguridad

C. ESTRUCTURA PROPUESTA

Muéstrame el árbol de directorios exacto que pretendes crear.

D. PLAN DE SPRINT 0

Enumera las tareas en el orden en que las ejecutarás.

Para cada tarea indica:

- resultado esperado
- validación que ejecutarás
- commit aproximado

Los mensajes de commit propuestos deben estar en español.

E. GITHUB

Confirma explícitamente:

GitHub owner esperado: HinaraSM12

APP_NAME: <valor actual>

REPO_NAME: <valor actual>

Visibilidad: private

Rama principal: main

Rama Sprint 0: chore/sprint-0-foundation

Commits: español

Pull Requests: español

Código e identificadores técnicos: inglés

Si APP_NAME o REPO_NAME continúan pendientes:

NO intentes crear el repositorio remoto.

F. PWA

Confirma que entendiste:

STUDENT:
offline completo futuro

FACILITATOR:
principalmente online + caché de lectura limitada

ADMIN:
escrituras online

Recommendation offline:
TypeScript deterministic rules/scoring

Recommendation online:
Python rules/scoring + LLM opcional

G. CONTRADICCIONES Y BLOQUEOS

Indica cualquier:

- contradicción
- documento faltante
- ambigüedad
- bloqueo
- decisión que necesite aprobación

No ocultes supuestos importantes.

==================================================
52. GATE FINAL
==================================================

Después de presentar el análisis anterior:

DETENTE.

NO:

- crees archivos
- instales dependencias
- ejecutes scaffolding
- inicialices Git
- crees el repo de GitHub
- hagas commits
- hagas push
- crees Pull Requests

hasta que yo responda exactamente o de forma inequívoca:

APROBADO. CONTINÚA CON SPRINT 0.

Una vez recibido ese permiso:

puedes ejecutar Sprint 0 de manera incremental, verificable y siguiendo la
documentación.

==================================================
53. REGLA FINAL
==================================================

No busco que termines toda la aplicación en una sola ejecución.

Busco una fundación técnica limpia, reproducible y correctamente documentada
sobre la cual podamos implementar después, por incrementos:

registro
   ↓
autenticación
   ↓
onboarding
   ↓
perfil
   ↓
misiones
   ↓
progreso
   ↓
modo recuperación
   ↓
recomendaciones
   ↓
offline/sincronización
   ↓
facilitador
   ↓
administración
   ↓
validación del prototipo

Favorece:

claridad
simplicidad
separación de responsabilidades
testabilidad
trazabilidad
privacidad
mantenibilidad

sobre complejidad innecesaria.
