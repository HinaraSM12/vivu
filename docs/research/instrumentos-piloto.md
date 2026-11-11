# Instrumentos de Investigación y Validación del Piloto — Vivu

**Propósito:** Documentar los instrumentos requeridos por la metodología de la tesis para el piloto longitudinal (10 semanas / 70 días, muestra de ~5–10 estudiantes de ingeniería, Facultad de Minas, UNAL Sede Medellín).  
**Principios rectores:** participación voluntaria, consentimiento informado explícito, posibilidad de retiro en cualquier momento, ausencia total de diagnóstico clínico o psicológico, pseudonimización (`participant_id_pseudonym`), gobernanza de datos variable por variable y evaluación formativa/exploratoria sin afirmar causalidad sobre deserción.

---

## 1. Consentimiento Informado (`consentVersion: "1.0"`)

### Texto base para pantalla y documento del participante

> **Proyecto de investigación:** *Sistema de ludificación adaptativa asistido por un modelo de lenguaje de gran escala para apoyar el aprendizaje autorregulado en estudiantes de ingeniería de la Facultad de Minas.*
>
> **1. Propósito del estudio:**  
> Te invitamos a participar de manera voluntaria en la evaluación exploratoria de **Vivu**, un prototipo de aplicación web progresiva (PWA) diseñado para apoyar acciones de organización, aprendizaje autorregulado y uso oportuno de recursos institucionales reales de la Facultad de Minas mediante misiones breves y recomendaciones explicables.
>
> **2. En qué consiste tu participación:**  
> Durante un periodo de 10 semanas (70 días) podrás usar Vivu para configurar tu perfil académico mínimo, elegir, posponer, editar, rechazar o completar misiones breves, consultar recursos institucionales verificados, activar el modo recuperación en semanas de alta carga y responder microcuestionarios cortos de seguimiento. Al finalizar, podrás participar en un cuestionario de cierre y una entrevista breve sobre tu experiencia.
>
> **3. Qué datos se recolectan y cuáles NO (Gobernanza de Datos):**  
> - **Sí se registran:** programa curricular, semestre, disponibilidad horaria, carga académica percibida, dificultad percibida de organización y manejo del tiempo, asignaturas de dificultad autorreportadas, prácticas de estudio, telemetría pseudonimizada de interacción con misiones/recomendaciones/recursos y respuestas a los instrumentos del piloto.  
> - **No se recolectan:** calificaciones oficiales, historia académica restringida, documento de identidad, correos personales privados, información disciplinaria ni diagnósticos médicos, psicológicos o de salud mental.
>
> **4. Arquitectura híbrida y papel instrumental del Modelo de Lenguaje (LLM):**  
> Las sugerencias de misiones y recursos de Vivu se seleccionan mediante reglas deterministas y puntuación transparente sobre un catálogo institucional verificado y moderado (`status = PUBLISHED`). El modelo de lenguaje (IA) actúa únicamente como componente instrumental para redactar explicaciones comprensibles (*"¿Por qué me lo sugieres?"*) y estructurar información pública de apoyos universitarios. La IA **no** toma decisiones académicas, **no** diagnostica, **no** inventa recursos ni te etiqueta como estudiante en riesgo. Siempre conservas el control con las opciones *Aceptar*, *Posponer*, *Editar*, *Rechazar* o *"No quiero recomendaciones como esta"*.
>
> **5. Privacidad, pseudonimización y almacenamiento local (PWA):**  
> Tus registros de interacción y cuestionarios se almacenan y analizan bajo un identificador pseudonimizado (`participant_id_pseudonym`) separado de tu correo. Para operar sin conexión, tu dispositivo guarda localmente el estado mínimo de tus misiones y progreso, el cual se limpia si cierras sesión o retiras tu consentimiento.
>
> **6. Voluntariedad y derecho de retiro:**  
> Tu participación es completamente voluntaria y no tiene ningún impacto en tus calificaciones ni en tu situación académica en la Universidad. Puedes retirar tu consentimiento en cualquier momento desde **Perfil → Privacidad y consentimiento** o contactando a la investigadora, sin ninguna consecuencia negativa.

### Casillas de verificación explícitas (UI)
- [ ] He leído la información del estudio, comprendo su alcance y acepto participar voluntariamente (`required`).
- [ ] Autorizo el uso de mi contexto académico autorreportado (no clínico) para personalizar misiones y recomendaciones dentro de Vivu (`required` para uso del prototipo).
- [ ] Autorizo el uso de mi telemetría de interacción y cuestionarios de forma **pseudonimizada/anonimizada** para el análisis de calidad de experiencia (QoE), calidad de servicio (QoS), continuidad y pertinencia de la tesis (`required`).

---

## 2. Guion de Tareas (Evaluación Inicial de Usabilidad y Flujos Esenciales)

Se aplica en la sesión inicial (45–60 minutos) para observar cumplimiento de tareas, claridad, esfuerzo percibido e incidencias:

| Código | Tarea solicitada al estudiante | Flujo evaluado | Criterio de éxito |
|---|---|---|---|
| `T-01` | Regístrate en Vivu, revisa el consentimiento informado y completa los 5 pasos de onboarding indicando tu carga académica percibida y tu dificultad percibida de organización del tiempo. | Registro → Consentimiento → Onboarding no clínico | Completa el flujo sin asistencia externa y comprende qué datos autorizó. |
| `T-02` | Desde Inicio, revisa las misiones sugeridas, abre el detalle de una misión y acéptala (o edítala/posponla). | Home → Detalle de misión → Agencia (`ACEPTAR` / `POSPONER` / `EDITAR`) | Identifica duración, esfuerzo y motivo de la sugerencia en menos de 1 minuto. |
| `T-03` | Marca la misión como completada y consulta tu pantalla de Progreso personal. | Completar misión → Feedback → Progreso | Reconoce su avance personal sin percibir comparación competitiva ni sanción. |
| `T-04` | Revisa una recomendación vinculada a una asignatura de dificultad, lee la explicación *"¿Por qué me lo sugieres?"*, abre el recurso institucional (`RESOURCE_OPENED`) o prueba la opción *"No quiero recomendaciones como esta"*. | Recomendación híbrida → Explicabilidad no estigmatizante → Recurso publicado | Comprende que la sugerencia proviene de una regla verificable y de un recurso real vigente (`PUBLISHED`). |
| `T-05` | Imagina una semana de parciales con alta carga académica y baja continuidad. Activa el **Modo recuperación** y selecciona una meta mínima viable. | Baja continuidad → Modo recuperación → Meta mínima viable | Percibe el flujo como apoyo compasivo sin castigo y selecciona una acción de bajo esfuerzo. |
| `T-06` | *(Escenario PWA)* Con el modo sin conexión activado, consulta tus misiones sincronizadas, completa una acción y verifica el indicador de sincronización al reconectar. | Operación Offline → Outbox → Reconexión | Comprende que su acción quedó guardada localmente y se sincronizó sin duplicarse. |

---

## 3. Cuestionario Inicial (Semana 1 — Línea Base y Dimensión Contextual)

Escala Likert de 1 (*Totalmente en desacuerdo*) a 5 (*Totalmente de acuerdo*), más preguntas abiertas:

### A. Autorregulación académica, carga percibida y organización del tiempo (Punto 45)
1. **Planificación semanal:** *"Suelo planificar con claridad qué actividades o entregas académicas debo priorizar cada semana."* (1–5)
2. **Dificultad percibida de organización y manejo del tiempo:** *"Actualmente siento dificultad para organizar mi tiempo de estudio antes de que se acumulen parciales o entregas."* (1–5)
3. **Carga académica percibida:** *"¿Cómo describirías tu nivel de carga académica en este momento del semestre?"* (1 = Muy baja, 5 = Muy alta)
4. **Conocimiento y uso de apoyos institucionales:** *"Conozco los recursos de apoyo de la Facultad de Minas (monitorías, tutorías, Minas Contigo, Bienestar, bibliotecas) y sé cuándo acudir a ellos."* (1–5)
5. **Retorno tras interrupciones:** *"Cuando tengo una semana de sobrecarga o me atraso, logro retomar mi ritmo de estudio sin bloquearme."* (1–5)

### B. Dimensión contextual: Interés y valor percibido de la Universidad (Punto 7)
*(Se analiza como dimensión contextual de la experiencia estudiantil, sin asumir generalizaciones universales)*:
6. **Valor percibido de continuar:** *"Considero que continuar mis estudios universitarios en ingeniería tiene un alto valor para mi proyecto personal y profesional."* (1–5)
7. **Utilidad percibida de la formación:** *"Percibo que lo que estoy aprendiendo en la Universidad es útil y relevante para mis metas."* (1–5)
8. **Sentido de pertenencia y apoyo institucional:** *"Me siento parte de la comunidad de la Facultad de Minas y percibo que existen apoyos institucionales reales para acompañarme."* (1–5)
9. **Intención de continuidad universitaria:** *"Tengo la firme intención de continuar mis estudios en los próximos semestres."* (1–5)
10. **Pregunta abierta contextual (Punto 7):** *"¿Qué factores hacen que continuar en la Universidad tenga más o menos sentido para usted actualmente?"* (Texto abierto)
11. **Expectativa frente al prototipo:** *"¿Qué te gustaría que una herramienta como Vivu te ayude a organizar o resolver durante estas 10 semanas?"* (Texto abierto)

---

## 4. Microcuestionario Semanal (Semanas 2 a 9 — Pulso Longitudinal de Continuidad, Pertinencia y QoE)

Diseñado para responderse en **menos de 90 segundos** dentro de la app (`SUR-WEEKLY-V1`):

1. **Carga académica y dificultad de organización de la semana (Punto 45):** *"¿Qué tan manejable sentiste tu carga académica y la organización de tu tiempo esta semana?"* (1 = Muy difícil de organizar, 5 = Muy manejable)
2. **Pertinencia percibida de recomendaciones (Punto 9):** *"¿Las misiones y recursos institucionales sugeridos por Vivu fueron pertinentes para tus necesidades y horarios de esta semana?"* (1 = Nada pertinentes, 5 = Muy pertinentes)
3. **Utilidad percibida y continuidad SRL (Puntos 8 y 9):** *"¿Vivu te ayudó a sostener al menos una acción concreta de planificación, estudio o consulta de apoyo esta semana?"* (1 = Nada, 5 = Mucho)
4. **Uso reportado de recurso institucional (Punto 9):** *"Si abriste algún recurso institucional sugerido (monitoría, taller, asesoría, biblioteca, etc.), ¿pudiste utilizarlo o asistir?"* (`Sí lo utilicé` / `Lo consulté para después` / `No abrí recursos esta semana` / `El horario o información no me sirvió`)
5. **Monitoreo de efectos no deseados — Presión, frustración o saturación (Punto 10):** *"¿Sentiste que Vivu te generó presión, frustración o saturación adicional esta semana?"* (1 = Ninguna, 5 = Mucha)
6. **Comentario opcional:** *"Si quieres reportar algún recurso desactualizado o comentar algo de tu semana, escríbelo aquí (opcional)."*

---

## 5. Cuestionario Final (Semana 10 — Evaluación Integral de QoE ISO 9241-11 / ISO 9241-210, Recomendaciones y Valor Contextual)

Escala Likert 1–5 + preguntas abiertas, cubriendo las **14 dimensiones de Quality of Experience (QoE, Punto 10)**:

### A. Calidad de Experiencia (QoE) — Usabilidad, claridad, esfuerzo y comprensión (ISO 9241-11 / ISO 9241-210)
1. **Facilidad de uso:** *"Vivu fue fácil de usar en mi rutina semanal."* (1–5)
2. **Claridad:** *"La presentación de las misiones, el progreso y los recursos institucionales fue clara."* (1–5)
3. **Esfuerzo percibido:** *"Interactuar con Vivu requirió poco esfuerzo y tiempo dentro de mi semana académica."* (1–5)
4. **Comprensión:** *"Comprendí fácilmente por qué el sistema me sugería determinadas misiones o recursos institucionales."* (1–5)
5. **Satisfacción general:** *"En general, estoy satisfecho(a) con la experiencia de acompañamiento que me brindó Vivu."* (1–5)

### B. Calidad de Experiencia (QoE) — Utilidad, pertinencia, confianza y autonomía
6. **Utilidad percibida:** *"Vivu me resultó útil para organizar mi estudio, preparar evaluaciones o acudir a recursos de la Facultad de Minas."* (1–5)
7. **Pertinencia percibida:** *"Las recomendaciones se ajustaron a mi semestre, asignaturas de dificultad, carga académica y disponibilidad."* (1–5)
8. **Confianza:** *"Las explicaciones del sistema y la información de los recursos institucionales me generaron confianza."* (1–5)
9. **Autonomía y agencia:** *"Sentí que siempre tuve el control para aceptar, posponer, editar, rechazar o silenciar recomendaciones según mi propio criterio."* (1–5)

### C. Calidad de Experiencia (QoE) — Efectos no deseados e intención de continuidad
10. **Frustración (inverso):** *"Rara vez o nunca sentí frustración al interactuar con las misiones, el modo recuperación o las recomendaciones."* (1–5)
11. **Presión percibida (inverso):** *"El diseño del progreso y del modo recuperación evitó que me sintiera presionado(a) o castigado(a) cuando tuve semanas difíciles."* (1–5)
12. **Saturación (inverso):** *"La cantidad de misiones y sugerencias semanales fue razonable y no me produjo saturación."* (1–5)
13. **Vigilancia percibida (inverso):** *"Sentí que Vivu respetó mi privacidad y en ningún momento lo percibí como una herramienta de vigilancia institucional."* (1–5)
14. **Intención de continuidad en la herramienta:** *"Si Vivu continuara disponible el próximo semestre, tendría intención de seguir utilizándola."* (1–5)

### D. Cierre de la dimensión contextual de valor universitario (Punto 7)
15. **Percepción de apoyo institucional y sentido de continuidad:** *"Conocer y articular mejor los apoyos institucionales aportó positivamente a mi experiencia durante estas semanas."* (1–5)
16. **Pregunta abierta de cierre (Punto 7):** *"Al finalizar estas 10 semanas, ¿qué factores hacen que continuar en la Universidad tenga más o menos sentido para usted actualmente y qué papel juegan los apoyos institucionales en ello?"* (Texto abierto)

---

## 6. Guía de Entrevista Semiestructurada de Cierre (15–25 minutos)

1. **Trayectoria y continuidad (10 semanas):** ¿Cómo describirías tu experiencia usando Vivu a lo largo de las 10 semanas? ¿En qué momentos del semestre te resultó más útil y cómo viviste el retorno cuando tuviste interrupciones?
2. **Misiones, carga percibida y organización del tiempo:** ¿Las misiones propuestas se ajustaron a tu carga académica percibida y a tus dificultades de organización del tiempo?
3. **Agencia y Modo Recuperación:** ¿Cómo te sentiste usando las opciones de aceptar, posponer, editar, rechazar o *"No quiero recomendaciones como esta"*? Si activaste el modo recuperación, ¿cómo lo experimentaste?
4. **Recomendaciones híbridas, explicabilidad del LLM y recursos institucionales:** ¿Qué tan claras y confiables te parecieron las explicaciones de *"¿Por qué me lo sugieres?"*? ¿Llegaste a abrir o utilizar algún recurso institucional de la Facultad de Minas (monitorías, tutorías, Minas Contigo, Bienestar, talleres) a partir de una recomendación?
5. **Efectos no deseados y privacidad (QoE):** ¿En algún momento sentiste frustración, presión, saturación informativa o sensación de vigilancia? ¿Qué opinas del manejo de tu privacidad y consentimiento?
6. **Dimensión contextual universitaria (Punto 7):** ¿Qué factores hacen que continuar en la Universidad tenga más o menos sentido para ti actualmente, y cómo podría mejorar la conexión entre los estudiantes de ingeniería y los apoyos de la Facultad de Minas?
