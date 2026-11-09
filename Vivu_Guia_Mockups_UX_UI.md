# Vivu — Guía maestra para mockups UX/UI

**Versión:** 1.0  
**Producto:** Vivu  
**Propósito:** servir como base de diseño para construir en Figma los mockups de Student, Facilitator y Admin, alineados con la tesis, la arquitectura y los sprints definidos.

## 1. Qué debe comunicar Vivu

Vivu no debe verse como un videojuego ni como un sistema de vigilancia académica. Debe sentirse como una herramienta universitaria cercana, clara y motivadora que ayuda a convertir necesidades de organización, estudio y apoyo institucional en acciones concretas.

### Requisitos del proyecto que deben reflejarse visualmente

- Registro, perfil básico y actualizable.
- Microcuestionarios breves.
- Visualización, aceptación y finalización de misiones.
- Seguimiento de progreso.
- Modo recuperación.
- Recomendaciones de apoyos institucionales.
- Registro de eventos de uso.
- Panel de facilitador y reportes simples.
- Recomendaciones apoyadas por IA con transparencia y bajo reglas autorizadas.
- PWA local-first: Student debe poder trabajar sin conexión; Facilitator tendrá lectura cacheada limitada; Admin requiere conexión para escrituras.

### Principios UX derivados del proyecto

1. **Autonomía:** el estudiante elige y entiende qué hará; evitar órdenes o mensajes de culpa.
2. **Competencia:** mostrar progreso individual y metas alcanzables.
3. **Relación:** conectar con recursos y personas de apoyo sin etiquetar al estudiante.
4. **Baja presión:** evitar rankings públicos, rachas rígidas, comparaciones y castigos.
5. **Transparencia:** toda recomendación importante debe poder explicar por qué aparece.
6. **Privacidad:** no exponer información sensible ni etiquetas de riesgo.
7. **Recuperación:** después de una pausa, ofrecer una ruta fácil para retomar, no penalizar.
8. **Accesibilidad:** diseño legible, contraste suficiente, navegación por teclado y objetivos táctiles amplios.

> **Importante:** la tesis plantea ludificación mediante misiones, niveles, progreso, retroalimentación, logros personales, metas mínimas viables y modo recuperación. No plantea un serious game completo. Por tanto, la interfaz puede ser lúdica y cálida, pero no debe convertirse en un mundo de juego con personajes, batallas, monedas o rankings competitivos.

---

## 2. Dirección visual recomendada para Vivu

Esta sección es una **recomendación de diseño**, no una exigencia académica.

### Personalidad

- Cercana, optimista y universitaria.
- Moderna pero no infantil.
- Motivadora sin sonar invasiva.
- Visualmente tranquila: el estudiante puede abrirla en una semana difícil sin sentir presión adicional.

### Paleta sugerida

| Token | Valor sugerido | Uso |
|---|---|---|
| Primary 600 | `#5B5BD6` | CTA principal, navegación activa |
| Primary 100 | `#ECECFF` | fondos suaves de progreso |
| Secondary 600 | `#278A7A` | bienestar, recursos, estados positivos |
| Accent 500 | `#E8A63A` | logros, avisos motivadores no críticos |
| Surface | `#FFFFFF` | tarjetas y superficies |
| Background | `#F7F8FC` | fondo general |
| Text primary | `#1F2937` | texto principal |
| Text secondary | `#667085` | texto secundario |
| Success | `#2E7D5B` | éxito/sincronización correcta |
| Warning | `#A66A12` | atención/sincronización pendiente |
| Error | `#B93A3A` | error real, no usar para presión académica |

### Tipografía

- Figma: **Inter** o una sans serif equivalente.
- Jerarquía recomendada: Display 32/40, H1 28/36, H2 22/30, H3 18/26, Body 16/24, Small 14/20, Caption 12/16.
- Evitar textos de cuerpo menores a 14 px.

### Forma y espaciado

- Grid base: 8 px.
- Radius: 12 px para tarjetas, 10 px para inputs, 999 px solo para chips/pills.
- Target táctil mínimo: 44x44 px.
- Sombras suaves; priorizar bordes y contraste antes que efectos pesados.

---

## 3. Organización recomendada del archivo Figma

Crear estas páginas:

1. `00_Cover`
2. `01_Foundations`
3. `02_Components`
4. `03_Student_Mobile`
5. `04_Facilitator_Desktop`
6. `05_Admin_Desktop`
7. `06_PWA_Offline_States`
8. `07_Prototype_Flows`
9. `08_Handoff_Notes`

### Frames base

- Student mobile: `390 x 844`.
- Student tablet: `768 x 1024` para revisar responsividad.
- Facilitator/Admin desktop: `1440 x 1024`.
- No diseñar solo desktop y luego “encoger”: Student debe ser mobile-first.

### Convención de nombres

`ROL_NUMERO_PANTALLA_ESTADO`

Ejemplos:

- `STU_01_LOGIN_DEFAULT`
- `STU_01_LOGIN_ERROR`
- `STU_07_HOME_OFFLINE`
- `FAC_03_STUDENT_DETAIL_DEFAULT`
- `ADM_05_MISSION_EDITOR_VALIDATION`

---

## 4. Sistema de componentes que debes diseñar primero

### Navegación

- Student: bottom navigation de 4–5 destinos máximos.
- Facilitator/Admin: sidebar izquierda + header superior.
- Breadcrumbs solo donde la jerarquía lo justifique.

### Controles

- Button: Primary / Secondary / Tertiary / Destructive.
- Input, Select, Multi-select, Checkbox, Radio, Toggle.
- Search field.
- Stepper de onboarding.
- Modal/Drawer.
- Toast y banner.

### Componentes Vivu

- `MissionCard`
- `MissionDetail`
- `ProgressRing` o barra de progreso no competitiva.
- `LevelBadge` personal, sin ranking.
- `FlexibleStreak` con lenguaje no punitivo.
- `RecoveryCard`
- `RecommendationCard`
- `ResourceCard`
- `MicroSurveyCard`
- `SupportSignalChip` para Facilitator, sin lenguaje de riesgo.
- `SyncStatus`
- `OfflineBanner`
- `PendingActionsBadge`
- `EmptyState`
- `SkeletonLoader`

### Estados obligatorios de componentes

Default, hover, focus, pressed, disabled, loading, success, error y offline cuando aplique.

---

## 5. Arquitectura de información por rol

### Student

Bottom navigation recomendada:

1. **Inicio**
2. **Misiones**
3. **Progreso**
4. **Recursos**
5. **Perfil**

Accesos contextuales desde Inicio:

- Recomendaciones.
- Modo recuperación.
- Microcuestionario pendiente.
- Estado de sincronización.

### Facilitator

Sidebar:

- Resumen
- Estudiantes asignados
- Seguimientos
- Recursos
- Perfil

### Admin

Sidebar:

- Resumen
- Usuarios y asignaciones
- Misiones
- Recursos
- Reglas de ludificación
- Recomendaciones / IA
- Microcuestionarios
- Analítica
- Exportaciones
- Configuración del piloto

---

## 6. Mockups Student — inventario detallado

### STU-01 — Login

**Objetivo:** entrar a Vivu con email y contraseña.

**Elementos:** logo Vivu, título breve, email, contraseña, mostrar/ocultar contraseña, CTA “Entrar”, enlace a registro, mensaje de error accesible, indicador de conexión si no hay red.

**Estados:** default, credenciales incorrectas, loading, sin conexión sin sesión previa, sesión expirada.

**Copy sugerido:** “Vuelve a tus próximos pasos.”

### STU-02 — Registro

**Objetivo:** crear cuenta Student. El usuario no elige rol.

**Elementos:** email, contraseña, confirmación, requisitos de contraseña, CTA “Crear cuenta”, enlace a login.

**No incluir todavía:** selección de rol, datos académicos extensos, consentimiento de investigación dentro del mismo formulario.

### STU-03 — Consentimiento y participación

**Objetivo:** explicar uso de datos y participación antes del onboarding de investigación.

**Elementos:** resumen claro, “ver detalle”, finalidades, voluntariedad, posibilidad de retiro, aceptación explícita, opción de no aceptar.

**Regla UX:** no usar dark patterns. Rechazar no debe estar escondido.

### STU-04 a STU-08 — Onboarding por pasos

Diseñar como wizard de 4–5 pasos, no como formulario gigante.

1. **Contexto académico mínimo:** programa de ingeniería y semestre.
2. **Carga y dificultades percibidas:** carga percibida, materias/áreas difíciles sin consultar calificaciones.
3. **Disponibilidad:** tiempo disponible y responsabilidades externas.
4. **Preferencias y objetivos:** intereses, prácticas de estudio, metas de apoyo.
5. **Bienestar/autopercepción opcional:** motivación, estrés y bienestar con lenguaje no diagnóstico y posibilidad de omitir cuando corresponda.

Mostrar progreso del wizard y permitir volver sin perder datos.

### STU-09 — Home / Inicio

**Objetivo:** responder “¿qué puedo hacer ahora?” en menos de 5 segundos.

**Orden recomendado:**

1. saludo breve;
2. misión recomendada / siguiente acción;
3. progreso de la semana;
4. acceso a recuperación si la continuidad bajó;
5. recursos o recomendaciones relevantes;
6. microcuestionario pendiente;
7. estado de sincronización discreto.

No llenar el home con métricas.

### STU-10 — Lista de misiones

Filtros simples: Hoy / Esta semana / Todas / Completadas.

Cada `MissionCard` debe mostrar: nombre, categoría, duración estimada, esfuerzo/dificultad, razón corta de relevancia si fue recomendada, estado y CTA.

### STU-11 — Detalle de misión

Debe responder:

- ¿Qué tengo que hacer?
- ¿Por qué puede servirme?
- ¿Cuánto tarda?
- ¿Qué necesito?
- ¿Qué recurso de apoyo está relacionado?

CTA: “Aceptar misión” o “Empezar”.

### STU-12 — Misión en progreso

Mostrar pasos mínimos, opción de pausar y salida sin castigo. Si la misión se puede completar offline, indicar de forma discreta que el resultado se sincronizará después.

### STU-13 — Misión completada

Feedback positivo breve. Mostrar avance personal, no comparación social. Acciones: “Ver progreso”, “Elegir otra misión”, “Terminar por ahora”.

### STU-14 — Progreso

Mostrar progreso semanal y personal:

- misiones aceptadas/completadas;
- continuidad semanal;
- categorías trabajadas;
- logros personales;
- racha flexible si se usa.

Evitar: percentiles, ranking entre estudiantes, “vas atrasado”.

### STU-15 — Modo recuperación

**Objetivo:** permitir retomar después de baja continuidad.

Diseño recomendado: pantalla calmada con una pregunta: “¿Cómo quieres retomar hoy?”

Opciones:

- misión de 5–10 min;
- reorganizar una prioridad;
- consultar un recurso;
- pedir apoyo;
- dejarlo para otro momento.

Copy sugerido: “Retomar con algo pequeño también cuenta.”

### STU-16 — Recomendaciones

`RecommendationCard` con:

- recomendación;
- razón breve;
- duración/esfuerzo;
- fuente: misión o recurso autorizado;
- enlace “¿Por qué me lo sugieres?”;
- acciones “Me sirve”, “Ahora no”, “No es relevante”.

Si hubo apoyo de IA online, mostrar transparencia sin lenguaje técnico excesivo: “Personalizada con apoyo de IA y reglas de Vivu”.

### STU-17 — Recursos institucionales

Categorías: monitorías, tutorías, bienestar, talleres, orientación, eventos/convocatorias autorizadas.

Cada recurso: qué ofrece, para quién, cómo acceder, horarios/enlace/contacto autorizado.

### STU-18 — Microcuestionario

Máximo 3–5 preguntas por aparición. Escalas legibles, opción de omitir cuando corresponda, duración estimada visible.

Ejemplos de dimensiones: utilidad, pertinencia, carga percibida, claridad, frustración/saturación.

### STU-19 — Perfil

Datos básicos y editables. Separar “Cuenta” de “Contexto para personalización”. Mostrar qué datos se usan para personalizar Vivu.

### STU-20 — Privacidad y datos

Mostrar consentimiento, preferencias, explicación de IA, opción de retiro del estudio/procedimiento definido y acceso a información de privacidad.

### STU-21 — Estado de sincronización

Mostrar última sincronización, acciones pendientes y botón “Sincronizar ahora” cuando haya conexión. No hacer de esta pantalla un panel técnico.

---

## 7. Mockups PWA / offline

Diseñar explícitamente los siguientes estados:

### Offline banner

Texto recomendado: “Estás sin conexión. Puedes seguir usando las funciones disponibles; sincronizaremos tus cambios cuando vuelvas a conectarte.”

### Acción pendiente

Después de completar una misión offline:

“Guardado en este dispositivo · Pendiente de sincronización”.

### Reconexión

Toast discreto: “Conexión restablecida. Sincronizando cambios…”

### Sincronización exitosa

“Todo está actualizado.”

### Conflicto que requiere intervención

Solo cuando realmente sea necesario. Explicar en lenguaje humano qué cambió; no mostrar IDs/versiones internas.

### Recomendación offline

Puede usar reglas determinísticas locales. Etiqueta recomendada: “Sugerencia disponible sin conexión”. En detalles: “Basada en tu información guardada y en reglas de Vivu.”

---

## 8. Mockups Facilitator

Facilitator no administra reglas globales ni toma decisiones académicas automáticas.

### FAC-01 — Dashboard

- estudiantes asignados;
- seguimientos pendientes;
- actividad reciente agregada;
- señales de continuidad/apoyo;
- acceso rápido a seguimientos.

Evitar tarjetas tipo “3 estudiantes en alto riesgo”.

### FAC-02 — Lista de estudiantes asignados

Mostrar nombre/identificador permitido, programa/semestre cuando esté autorizado, última actividad, continuidad reciente y seguimiento pendiente.

Filtros por actividad, seguimiento y programa; no por etiquetas de riesgo.

### FAC-03 — Detalle del estudiante

Secciones:

- resumen autorizado;
- progreso reciente;
- misiones/acciones relevantes;
- recursos consultados;
- microcuestionarios agregados cuando corresponda;
- historial de acompañamiento.

No mostrar datos que el facilitador no necesite.

### FAC-04 — Registrar seguimiento

Formulario breve: fecha, tipo de acompañamiento, nota, compromisos/acuerdos y próxima revisión. Incluir aviso de que no se registren datos sensibles innecesarios.

### FAC-05 — Recursos

Vista de consulta para compartir/enlazar recursos autorizados.

---

## 9. Mockups Admin

Admin absorbe la operación del piloto y funciones de investigación/configuración.

### ADM-01 — Dashboard

Indicadores operativos: usuarios activos, misiones disponibles, completitud de catálogos, actividad del piloto, eventos recientes, incidencias y estado de servicios/configuración visible a nivel funcional.

### ADM-02 — Usuarios y roles

Crear/editar/desactivar cuentas, rol, asignación de Facilitator. Nunca permitir que un Student se autoasigne Admin/Facilitator.

### ADM-03 — Asignaciones

Facilitator ↔ estudiantes. Vista clara de asignados/no asignados.

### ADM-04 — Catálogo de misiones

Listado con categoría, duración, dificultad, estado, versión y disponibilidad.

### ADM-05 — Editor de misión

Campos: título, descripción, objetivo, categoría, duración, dificultad, instrucciones, criterios de finalización, recursos vinculados, reglas de disponibilidad y estado borrador/publicada/archivada.

### ADM-06 — Recursos institucionales

CRUD de recursos autorizados, vigencia y fuente. Mostrar advertencia cuando un recurso esté desactualizado.

### ADM-07 — Reglas de ludificación

Configurar parámetros autorizados: progresión, logros, rachas flexibles, recuperación. Incluir explicación de impacto y versionado.

### ADM-08 — Recomendador / IA

Mostrar configuración versionada del scoring, estado del proveedor LLM, uso habilitado/deshabilitado y política de fallback. No exponer prompt secrets ni claves.

### ADM-09 — Microcuestionarios

Crear/activar/desactivar cuestionarios, periodicidad y audiencia autorizada.

### ADM-10 — Analítica del piloto

Indicadores de la tesis: adherencia semanal, retención semanas 1/4/10, misiones aceptadas/completadas, recuperación, continuidad, utilidad/pertinencia y posibles efectos no deseados.

No presentar correlaciones como causalidad.

### ADM-11 — Exportación anonimizada

Flujo explícito con resumen de campos, finalidad y confirmación. No incluir información identificable en exportaciones de análisis cuando la especificación exija anonimización.

### ADM-12 — Configuración del piloto

Fechas, parámetros de seguimiento, versiones activas de catálogos/reglas y estado del piloto.

---

## 10. Flujos que debes prototipar en Figma

### Flujo A — Primera entrada Student

`Registro → Login → Consentimiento → Onboarding → Home → Primera misión → Completar → Progreso`

### Flujo B — Semana normal

`Home → Recomendación → Detalle de misión → Aceptar → Completar → Microcuestionario breve`

### Flujo C — Recuperación

`Home → Modo recuperación → Acción mínima → Feedback → Home`

### Flujo D — Offline

`Abrir offline → Home cacheado → Misión → Completar offline → Pendiente de sync → Reconexión → Sincronizado`

### Flujo E — Facilitator

`Login → Estudiantes asignados → Detalle → Registrar seguimiento → Próxima revisión`

### Flujo F — Admin misión

`Login → Catálogo de misiones → Crear/editar → Validar → Publicar → Confirmación`

---

## 11. Estados que no puedes olvidar

Para cada pantalla importante prepara cuando aplique:

- default;
- loading / skeleton;
- empty;
- error recuperable;
- error de validación;
- sin permiso;
- offline;
- datos desactualizados;
- sincronización pendiente;
- success;
- sesión expirada.

En PWA, “sin conexión” no debe parecer un error catastrófico si la función puede seguir operando.

---

## 12. Copy y tono

### Sí usar

- “Elige una misión que encaje con tu semana.”
- “Retomar con algo pequeño también cuenta.”
- “Esta sugerencia se basa en tus preferencias y actividad reciente.”
- “Puedes cambiar esta información cuando quieras.”
- “Guardado en este dispositivo. Se sincronizará cuando tengas conexión.”

### Evitar

- “Fallaste tu racha.”
- “Estás atrasado.”
- “Eres un estudiante de alto riesgo.”
- “Debes completar esto hoy.”
- “La IA decidió que…”
- “Otros estudiantes van mejor que tú.”

---

## 13. Priorización de mockups por sprint

| Sprint | Mockups mínimos a tener antes de desarrollar |
|---|---|
| 1 | Login, registro, unauthorized, shells Student/Facilitator/Admin |
| 2 | Consentimiento, onboarding, perfil |
| 3 | Home Student, lista/detalle/completar misión, progreso |
| 4 | Recursos, microcuestionarios, recuperación |
| 5 | Recomendaciones y explicación de recomendación |
| 6 | Offline banner, pending sync, sync center, recomendación offline |
| 7 | Dashboard Facilitator, lista y detalle estudiante, seguimiento |
| 8 | Dashboard Admin, usuarios, misiones, recursos, reglas, IA, encuestas, exportación |
| 9 | Analítica del piloto, estados finales, accesibilidad y casos extremos |

---

## 14. Checklist de accesibilidad y usabilidad

- Contraste WCAG AA para texto y controles.
- Nunca comunicar estado solo por color.
- Focus visible.
- Labels persistentes en formularios; no depender solo del placeholder.
- Botones táctiles ≥44 px.
- Mensajes de error junto al campo y resumen cuando sea necesario.
- Orden de tabulación lógico.
- Diseño usable a 200% de zoom.
- Lenguaje simple y no punitivo.
- Confirmar acciones destructivas.
- Evitar modales innecesarios.
- El usuario siempre debe saber si está online/offline y si algo está pendiente de sincronización, pero sin saturarlo.

---

## 15. Prompt maestro para generar mockups con una IA de diseño

Copia y adapta este prompt si usas Figma AI u otra herramienta:

> Diseña la interfaz de **Vivu**, una PWA universitaria de acompañamiento estudiantil para estudiantes de ingeniería. Vivu utiliza ludificación basada en misiones, progreso individual, retroalimentación positiva, modo recuperación y recomendaciones de recursos institucionales. No es un videojuego, no debe usar rankings públicos ni presión competitiva. El tono debe ser cercano, calmado, moderno y universitario. Student es mobile-first; Facilitator y Admin son desktop-first. Usa tarjetas limpias, jerarquía clara, targets táctiles amplios y accesibilidad WCAG AA. La navegación Student debe priorizar Inicio, Misiones, Progreso, Recursos y Perfil. Diseña también estados loading, empty, error y offline. Cuando una recomendación use IA, debe existir una explicación “¿Por qué me lo sugieres?” y la IA nunca debe aparecer como autoridad. El modo recuperación debe ayudar a retomar sin culpa. Evita dark patterns, lenguaje de riesgo y comparaciones entre estudiantes.

---

## 16. Prompts específicos por rol

### Prompt Student

> Crea mockups mobile-first 390x844 para Vivu Student. Incluye: login, registro, consentimiento, onboarding por pasos, home, lista de misiones, detalle, misión en progreso, completada, progreso, recuperación, recomendaciones, recursos, microcuestionario, perfil, privacidad y sincronización. Mantén una experiencia calmada y motivadora. No uses rankings. El home debe responder “qué puedo hacer ahora” en pocos segundos. Incluye estados offline y pendientes de sincronización.

### Prompt Facilitator

> Crea mockups desktop 1440x1024 para Vivu Facilitator. Incluye dashboard, estudiantes asignados, detalle de estudiante, registrar seguimiento y recursos. Usa señales de continuidad y necesidades de apoyo; no uses etiquetas como alto riesgo. Muestra solo información necesaria para acompañamiento y mantén trazabilidad de seguimientos.

### Prompt Admin

> Crea mockups desktop 1440x1024 para Vivu Admin. Incluye dashboard, usuarios/roles, asignaciones, catálogo/editor de misiones, recursos institucionales, reglas de ludificación, configuración del recomendador/IA, microcuestionarios, analítica, exportación anonimizada y configuración del piloto. Prioriza claridad, trazabilidad, versionado y confirmaciones para acciones sensibles.

### Prompt PWA/offline

> Diseña estados PWA para Vivu: sin conexión, acción guardada localmente, sincronización pendiente, reconexión, sincronización exitosa, conflicto y recomendación offline. Offline debe sentirse como un modo soportado, no como un fallo general. La interfaz debe explicar en lenguaje simple qué está guardado en el dispositivo y qué se sincronizará después.

---

## 17. Checklist de entrega en Figma

Antes de considerar los mockups listos:

- Foundations con tokens documentados.
- Componentes reutilizables con variantes.
- Auto Layout en componentes y pantallas principales.
- Student mobile completo y al menos revisión tablet.
- Facilitator/Admin desktop.
- Prototype flows A–F conectados.
- Estados críticos diseñados.
- Copy realista en español, no lorem ipsum.
- Anotaciones de qué datos son reales, estimados o de ejemplo.
- Anotación de componentes que funcionan offline.
- Anotación de recomendaciones con IA vs reglas offline.
- Accesibilidad revisada.
- Handoff con nombres consistentes con componentes del frontend cuando sea posible.

---

## 18. Base documental del proyecto

Esta guía toma como base el proyecto de tesis y el marco arquitectónico aportados para Vivu. En particular:

- El prototipo debe incluir registro, perfil, microcuestionarios, misiones, progreso, recuperación, recursos y eventos.
- La ludificación se concibe como misiones, niveles, progreso, retroalimentación y logros personales, evitando reducirla a puntos/insignias o convertir el sistema en un serious game completo.
- La IA es instrumental, transparente y subordinada a reglas y contenidos autorizados.
- La evaluación observará funcionamiento, usabilidad, adherencia, continuidad, utilidad, pertinencia y posibles efectos no deseados.
- El tratamiento de datos debe respetar consentimiento, minimización, acceso controlado y anonimización para análisis.
- La arquitectura separa interfaz, reglas de negocio, IA, broker de eventos y persistencia.

**Uso recomendado:** copiar este documento a `docs/ux/mockup-guide.md` del repositorio y utilizarlo como referencia junto con los specs de cada sprint.
