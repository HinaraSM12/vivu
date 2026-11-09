# Instrumentos de Investigación y Validación del Piloto — Vivu

**Propósito:** Documentar los instrumentos requeridos por la metodología de la tesis para el piloto longitudinal (10 semanas / 70 días, muestra de ~5–10 estudiantes de ingeniería, Facultad de Minas, UNAL Sede Medellín).  
**Principios rectores:** participación voluntaria, consentimiento informado explícito, posibilidad de retiro en cualquier momento, no diagnóstico, anonimización/seudonimización en el análisis y evaluación sin afirmar causalidad sobre deserción.

---

## 1. Consentimiento Informado (`consentVersion: "1.0"`)

### Texto base para pantalla y documento del participante

> **Proyecto de investigación:** *Sistema de ludificación basado en un modelo de lenguaje de gran escala para el fomento del aprendizaje autorregulado en estudiantes de ingeniería.*
>
> **1. Propósito del estudio:**  
> Te invitamos a participar de manera voluntaria en la evaluación de **Vivu**, un prototipo de aplicación web progresiva (PWA) diseñado para apoyar hábitos de organización, autorregulación académica y conexión con recursos universitarios mediante misiones breves y recomendaciones personalizadas.
>
> **2. En qué consiste tu participación:**  
> Durante un periodo aproximado de 10 semanas podrás usar Vivu para elegir y completar misiones breves de organización/estudio, consultar recursos institucionales, usar el modo recuperación en semanas de alta carga y responder cuestionarios cortos de seguimiento (3 a 5 minutos). Al finalizar, podrás participar opcionalmente en una entrevista breve sobre tu experiencia.
>
> **3. Qué datos se recolectan y cuáles NO:**  
> - **Sí se registran:** programa, semestre, disponibilidad de tiempo, carga académica percibida, prácticas de estudio, interacción con misiones/recursos y respuestas a cuestionarios dentro de la app.  
> - **No se recolectan:** calificaciones oficiales, historia académica institucional restringida ni diagnósticos médicos o psicológicos.
>
> **4. Uso de Inteligencia Artificial y reglas del sistema:**  
> Vivu utiliza reglas definidas por el proyecto y, cuando hay conexión, apoyo de un modelo de lenguaje (IA) únicamente para redactar explicaciones claras y adaptar sugerencias sobre misiones y recursos autorizados. La IA no toma decisiones académicas, no evalúa tu rendimiento ni comparte tus datos personales identificables.
>
> **5. Privacidad, seudonimización y almacenamiento local (PWA):**  
> Tus respuestas y métricas de uso se analizan de forma seudonimizada/anonimizada con fines exclusivamente académicos. Para que puedas usar la aplicación sin conexión, tu dispositivo guardará localmente el estado mínimo de tus misiones y progreso, el cual se limpia si cierras sesión o retiras tu consentimiento.
>
> **6. Voluntariedad y derecho de retiro:**  
> Tu participación es completamente voluntaria. No tiene ningún impacto en tus calificaciones ni en tu situación académica. Puedes retirar tu consentimiento en cualquier momento desde la sección **Perfil → Privacidad y consentimiento** o contactando al equipo investigador, sin ninguna consecuencia negativa.

### Casillas de verificación explícitas (UI)
- [ ] He leído la información del estudio, comprendo su alcance y acepto participar voluntariamente (`required`).
- [ ] Autorizo el uso de mi contexto académico autorreportado para personalizar misiones y recomendaciones dentro de Vivu (`required` para uso del prototipo).
- [ ] Autorizo el uso de mis registros de interacción y cuestionarios de forma **anonimizada/seudonimizada** para el análisis académico de la tesis (`required`).

---

## 2. Guion de Tareas ( Evaluación Inicial de Usabilidad y Flujos Esenciales)

Se aplica al inicio o en sesión guiada para observar cumplimiento de tareas, claridad e incidencias:

| Código | Tarea solicitada al estudiante | Flujo evaluado | Criterio de éxito |
|---|---|---|---|
| `T-01` | Regístrate en Vivu, revisa el consentimiento informado y completa los pasos de configuración inicial (onboarding) según tu semana actual. | Registro → Consentimiento → Onboarding | Completa el flujo sin asistencia externa y comprende qué datos autorizó. |
| `T-02` | Desde la pantalla de Inicio, revisa las misiones sugeridas, abre el detalle de una misión y acéptala. | Home → Detalle de misión → Aceptación | Identifica duración, esfuerzo y motivo de la sugerencia en menos de 1 minuto. |
| `T-03` | Marca la misión como completada y consulta tu pantalla de Progreso personal. | Completar misión → Feedback → Progreso | Reconoce su avance personal sin percibir comparación competitiva con otros. |
| `T-04` | Revisa una recomendación personalizada y abre la explicación *"¿Por qué me lo sugieres?"*, luego consulta el recurso institucional vinculado. | Recomendación → Explicación IA/Reglas → Recurso | Comprende por qué apareció la sugerencia y cómo acceder al recurso institucional. |
| `T-05` | Imagina que tuviste una semana con muchas entregas y poca continuidad. Activa el **Modo recuperación** y elige una microacción. | Baja continuidad → Modo recuperación → Meta mínima viable | Percibe el flujo como apoyo sin castigo y logra seleccionar una acción de baja carga. |
| `T-06` | *(Escenario PWA)* Con el modo sin conexión activado, consulta tus misiones sincronizadas, completa una acción y observa el indicador de sincronización al reconectar. | Operación Offline → Outbox → Reconexión | Comprende que su acción quedó guardada localmente y se sincronizó sin duplicarse. |

---

## 3. Cuestionario Inicial (Semana 1 — Línea Base)

Escala Likert de 1 (*Totalmente en desacuerdo*) a 5 (*Totalmente de acuerdo*), salvo preguntas de contexto:

1. **Organización semanal:** *"Suelo planificar con claridad qué actividades o entregas académicas debo priorizar cada semana."* (1–5)
2. **Gestión del tiempo de estudio:** *"Me resulta fácil reservar y cumplir bloques de tiempo de estudio antes de que se acumulen los exámenes o entregas."* (1–5)
3. **Búsqueda de apoyo oportuno:** *"Conozco los recursos de apoyo de la universidad (monitorías, tutorías, bienestar) y sé cuándo acudir a ellos."* (1–5)
4. **Retomada tras interrupciones:** *"Cuando tengo una semana difícil o me atraso, logro retomar el ritmo sin bloquearme."* (1–5)
5. **Carga percibida inicial:** *"¿Cómo describirías tu nivel de carga académica y responsabilidades en este inicio del piloto?"* (1 = Muy baja, 5 = Muy alta)
6. **Expectativa abierta:** *"¿Qué te gustaría que una herramienta como Vivu te ayude a lograr durante estas semanas?"* (Texto breve)

---

## 4. Microcuestionario Semanal (Semanas 2 a 9 — Pulso Longitudinal)

Diseñado para responderse en **menos de 90 segundos** dentro de la app (`SUR-WEEKLY-V1`):

1. **Carga de la semana:** *"¿Qué tan manejable sentiste tu semana académica?"* (1 = Muy difícil, 5 = Muy manejable)
2. **Pertinencia:** *"¿Las misiones y recursos sugeridos por Vivu encajaron con tu necesidad y tiempo disponible esta semana?"* (1 = Nada pertinentes, 5 = Muy pertinentes)
3. **Utilidad para la acción:** *"¿Vivu te ayudó a realizar al menos una acción concreta de organización o estudio?"* (1 = Nada, 5 = Mucho)
4. **Presión / Saturación (control de efectos no deseados):** *"¿Sentiste que el uso de Vivu te generó presión, culpa o sobrecarga adicional?"* (1 = Ninguna presión, 5 = Mucha presión)
5. **Comentario opcional:** *"Si quieres contarnos algo sobre tu semana o sobre la app, escríbelo aquí (opcional)."*

---

## 5. Cuestionario Final (Semana 10 — Cierre Cuantitativo y Cualitativo)

Escala Likert 1–5 + preguntas abiertas:

### A. Usabilidad y claridad
1. *"La interfaz de Vivu fue clara, fácil de usar y rápida de entender."* (1–5)
2. *"Siempre comprendí qué ocurría con mi progreso y mis acciones, incluso cuando la conexión era inestable o sin red."* (1–5)

### B. Ludificación y Modo Recuperación
3. *"Las misiones, el progreso personal y los logros me motivaron sin hacerme sentir en competencia con otros."* (1–5)
4. *"El modo recuperación me permitió retomar el ritmo en momentos difíciles sin sentirme penalizado(a)."* (1–5)

### C. Recomendaciones e Inteligencia Artificial
5. *"Las recomendaciones de misiones y recursos institucionales fueron útiles y oportunas para mi contexto."* (1–5)
6. *"Las explicaciones de '¿Por qué me lo sugieres?' fueron claras y me dieron confianza sobre cómo funcionaba el sistema."* (1–5)

### D. Efectos percibidos e intención de continuidad
7. *"Usar Vivu me ayudó a sostener mejores hábitos de planificación o autorregulación durante el semestre."* (1–5)
8. *"El uso de la aplicación respetó mi autonomía y no me generó saturación ni estrés adicional."* (1–5)
9. *"Si Vivu siguiera disponible el próximo semestre, tendría intención de continuar usándola."* (1–5)

---

## 6. Guía de Entrevista Semiestructurada de Cierre (15–20 minutos)

1. **Experiencia general:** ¿Cómo describirías tu experiencia usando Vivu a lo largo de estas semanas? ¿En qué momentos del semestre te resultó más útil y en cuáles menos?
2. **Misiones y autonomía:** ¿Sentiste que las misiones tenían un tamaño realista para tu carga en ingeniería? ¿Cómo te sentiste respecto a la libertad de elegir, posponer o descartar actividades?
3. **Modo recuperación:** Si tuviste alguna semana pesada o dejaste de entrar unos días, ¿cómo viviste el regreso a la aplicación y el modo recuperación?
4. **Recomendaciones y recursos:** ¿Qué te parecieron las sugerencias y sus explicaciones? ¿Llegaste a conocer o considerar algún recurso institucional que antes no tenías presente?
5. **Efectos no deseados y privacidad:** ¿Hubo algún momento en que la aplicación se sintiera pesada, repetitiva o invasiva? ¿Te sentiste tranquilo(a) con el manejo de tu privacidad y consentimiento?
6. **Mejoras futuras:** Si pudieras cambiar o agregar una sola cosa a Vivu para estudiantes de ingeniería de la Facultad de Minas, ¿cuál sería?

