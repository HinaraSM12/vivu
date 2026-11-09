# Especificación de Datos Iniciales (Seeds Sintéticos) — Vivu V1

**Estado:** Base aprobada para implementación progresiva en Sprints 1–8  
**Regla de privacidad:** **Prohibido** incluir datos reales de estudiantes, correos reales o códigos institucionales reales en seeds o repositorios. Todos los usuarios de prueba usan dominios `.test` / `.local` y contraseñas exclusivas de entorno local/pruebas.

---

## 1. Usuarios sintéticos de prueba (`identity-service` + `student-service` + `support-service`)

| Identificador interno (seed) | Email sintético | Rol | Contexto / Propósito de prueba |
|---|---|---|---|
| `usr-admin-001` | `admin.piloto@vivu.local` | `ADMIN` | Operador del piloto y administrador global (creado por seed seguro en Sprint 1; nunca por autoregistro). |
| `usr-fac-001` | `facilitador.ingenieria@vivu.local` | `FACILITATOR` | Tutor/acompañante con 2 estudiantes asignados (`usr-stu-001` y `usr-stu-002`). |
| `usr-fac-002` | `facilitador.bienestar@vivu.local` | `FACILITATOR` | Segundo facilitador para probar aislamiento RBAC (no debe ver asignados de `usr-fac-001`). |
| `usr-stu-001` | `est.activo@vivu.local` | `STUDENT` | Estudiante de Ingeniería de Sistemas (Semestre 3), consentimiento vigente, onboarding completo, continuidad activa. |
| `usr-stu-002` | `est.recuperacion@vivu.local` | `STUDENT` | Estudiante de Ingeniería Civil (Semestre 2), carga alta percibida, baja continuidad reciente (candidato a **modo recuperación**). |
| `usr-stu-003` | `est.nuevo@vivu.local` | `STUDENT` | Estudiante recién registrado pendiente de aceptar consentimiento y completar onboarding. |

---

## 2. Categorías de misiones y recursos

| Código | Nombre visible | Descripción |
|---|---|---|
| `PLANNING` | Organización y planificación | Gestión del tiempo semanal, priorización de entregas y bloques de estudio. |
| `STUDY_HABITS` | Hábitos y estrategias de estudio | Práctica activa, preparación de parciales, repaso espaciado y enfoque. |
| `ACADEMIC_SUPPORT` | Apoyo académico institucional | Uso de monitorías, tutorías y acompañamiento docente autorizado. |
| `WELLBEING_BALANCE` | Bienestar y equilibrio | Pausas saludables, regulación de carga percibida y autocuidado sin enfoque clínico. |
| `CAMPUS_INTEGRATION` | Vida universitaria e integración | Conocimiento de servicios de facultad/sede y redes de apoyo estudiantil. |

---

## 3. Catálogo inicial de misiones (`gamification-service`)

Todas las misiones tienen versión (`version = 1`), duración estimada en minutos, nivel de esfuerzo (`LOW`, `MEDIUM`, `HIGH`) e indicador de elegibilidad para modo recuperación (`isRecoveryEligible`).

| Código | Título | Categoría | Duración | Esfuerzo | Modo Recuperación | Objetivo de autorregulación |
|---|---|---|---:|---|:---:|---|
| `MIS-PLAN-01` | Prioriza tus 3 entregas clave de la semana | `PLANNING` | 10 min | `LOW` | Sí | Reducir sensación de saturación identificando las 3 tareas académicas más relevantes de los próximos 7 días. |
| `MIS-PLAN-02` | Diseña dos bloques de estudio de 45 minutos | `PLANNING` | 15 min | `MEDIUM` | No | Reservar en el calendario personal dos bloques concretos y realistas para la materia de mayor dificultad. |
| `MIS-HAB-01` | Sesión de estudio enfocado de 25 minutos | `STUDY_HABITS` | 25 min | `MEDIUM` | No | Completar un bloque corto sin distracciones sobre un tema específico y registrar una idea clave aprendida. |
| `MIS-HAB-02` | Prepara 2 dudas puntuales antes de clase o monitoría | `STUDY_HABITS` | 10 min | `LOW` | Sí | Transformar un bloqueo general en dos preguntas concretas para resolver con docente o monitor. |
| `MIS-SUP-01` | Explora una monitoría o tutoría para tu materia retadora | `ACADEMIC_SUPPORT` | 10 min | `LOW` | Sí | Consultar horarios y modalidad de apoyo académico autorizado en la facultad. |
| `MIS-WEL-01` | Pausa consciente y ajuste de carga de hoy | `WELLBEING_BALANCE` | 5 min | `LOW` | Sí | Hacer una pausa breve, revisar si la meta del día es realista y posponer sin culpa lo no urgente. |
| `MIS-REC-01` | Retoma el ritmo: elige una sola microacción de 5 minutos | `PLANNING` | 5 min | `LOW` | Sí (Exclusiva/Prioritaria) | Meta mínima viable para semanas difíciles o tras días sin actividad: retomar con un paso pequeño sin penalización. |

---

## 4. Recursos institucionales autorizados iniciales (`resource-service`)

> **Nota:** En el entorno de desarrollo se cargan como catálogo autorizado de referencia para la Facultad de Minas / Sede Medellín. Antes del piloto real, `ADMIN` verifica horarios y enlaces vigentes.

| Código | Nombre del recurso | Categoría | Público objetivo | Modalidad | Estado inicial |
|---|---|---|---|---|---|
| `RES-ACAD-01` | Programa de Monitorías y Tutorías Académicas — Ciencias Básicas e Ingeniería | `ACADEMIC_SUPPORT` | Estudiantes de pregrado con asignaturas de alta demanda o dificultad | Presencial / Virtual | `ACTIVE` |
| `RES-ACAD-02` | Talleres de Estrategias de Estudio y Gestión del Tiempo | `STUDY_HABITS` | Estudiantes de todos los semestres que buscan mejorar organización | Grupal / Taller | `ACTIVE` |
| `RES-ACA-03` | Acompañamiento Estudiantil y Consejería Académica de Facultad | `PLANNING` | Estudiantes que requieren orientación sobre carga académica y ruta curricular | Cita previa | `ACTIVE` |
| `RES-WEL-01` | Orientación y Acompañamiento en Bienestar Universitario | `WELLBEING_BALANCE` | Estudiantes que reportan sobrecarga, estrés académico o necesidad de escucha | Presencial / Virtual | `ACTIVE` |
| `RES-INT-01` | Guía de Servicios Universitarios y Grupos Estudiantiles — Facultad de Minas | `CAMPUS_INTEGRATION` | Estudiantes de primeros semestres o en proceso de integración | Catálogo digital | `ACTIVE` |
| `RES-ARCH-01` | Convocatoria Histórica Semestre Anterior (Seed para probar filtro de inactivos) | `CAMPUS_INTEGRATION` | Prueba automatizada de que el recomendador **nunca** sugiere recursos inactivos | N/A | `INACTIVE` |

---

## 5. Microcuestionarios iniciales (`survey-service`)

| Código | Nombre | Momento de aplicación | Preguntas (3–5 ítems máx.) |
|---|---|---|---|
| `SUR-WEEKLY-V1` | Check-in semanal de autorregulación y experiencia | Semanal (Semanas 1 a 10) | 1. ¿Qué tan manejable sientes tu carga académica esta semana? (Escala 1–5)<br>2. ¿Las misiones o sugerencias de Vivu se ajustaron a tu tiempo disponible? (Escala 1–5)<br>3. ¿Sentiste que la aplicación te ayudó a dar al menos un paso concreto sin generarte presión extra? (Escala 1–5)<br>4. (Opcional) ¿Qué fue lo más útil o qué cambiarías esta semana? |
| `SUR-RECOVERY-V1` | Pulso breve de retomada | Opcional tras usar modo recuperación | 1. ¿La opción de recuperación te pareció alcanzable para tu momento actual? (Escala 1–5)<br>2. ¿Qué tipo de apoyo te resultaría más útil esta semana? (Organización / Monitoría / Bienestar / Ir a mi propio ritmo) |

---

## 6. Reglas iniciales de ludificación y recomendación (`gamification-service` + `recommendation-service`)

### 6.1 Parámetros de ludificación (`ruleVersion = "1.0.0"`)
- **Niveles de progreso personal (no competitivos):**
  - Nivel 1 (`Exploración`): 0 a 2 misiones completadas.
  - Nivel 2 (`Constancia inicial`): 3 a 6 misiones completadas.
  - Nivel 3 (`Ritmo autónomo`): 7 a 12 misiones completadas.
  - Nivel 4 (`Autorregulación consolidada`): 13+ misiones completadas.
- **Continuidad semanal flexible:**
  - Se considera semana activa con `>= 1` interacción significativa (completar misión, activar recuperación con microacción o responder check-in semanal).
  - Baja continuidad se señala suavemente tras `>= 10 días` sin interacción o por autorreporte de semana difícil, habilitando el **modo recuperación** sin perder nivel ni logros previos.

### 6.2 Configuración del Recomendador (`configVersion = "1.0.0"`, compartida Python/TypeScript)
- **Pesos del baseline determinístico:**
  - `need_fit`: `0.30`
  - `time_fit`: `0.20`
  - `difficulty_fit`: `0.15`
  - `continuity_fit`: `0.15`
  - `resource_fit`: `0.15`
  - `diversity_fit`: `0.05`
- **Límites duros (*Hard rules*):**
  - `maxRecommendationsPerRun`: `3` (evita saturación cognitiva).
  - En modo recuperación: filtrar únicamente misiones con `isRecoveryEligible = true` y esfuerzo `LOW`.
  - Excluir siempre recursos con estado distinto de `ACTIVE`.

