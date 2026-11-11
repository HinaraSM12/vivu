# Proyecto de Tesis de Maestría — Versión Integralmente Actualizada (V7 / PRISMA V5)

> **Nota de sincronización:** Este archivo refleja de forma íntegra el contenido actualizado en `PROYECTO_DE_TESIS_HINARA_SANCHEZ (6).docx` y `PROYECTO_DE_TESIS_HINARA_SANCHEZ_v7_ACTUALIZADO.docx`, alineado con `Articulo_Revision_Sistematica_PRISMA_v5_FINAL.docx` y los 45 lineamientos metodológicos, arquitectónicos, éticos y de evaluación de Vivu.

PROYECTO DE TESIS MAESTRÍA

TÍTULO: Sistema de ludificación adaptativa asistido por un modelo de lenguaje de gran escala para apoyar el aprendizaje autorregulado en estudiantes de ingeniería de la Facultad de Minas.

DIRECTOR: Fernán Alonso Villa Garzón

| PROGRAMA: Maestría en Ingeniería - Ingeniería de Sistemas | PERFIL: Investigación |
| --- | --- |

AUTOR

| NOMBRE | CÉDULA | E-MAIL | TELÉFONO |
| --- | --- | --- | --- |
| Hinara Pastora Sánchez Mata | 1098908 | hisanchezm@unal.edu.co | 3044822338 |

## 1. PLANTEAMIENTO DEL PROBLEMA

Con base en la revisión sistemática de la literatura (versión definitiva PRISMA 2020 V5), la permanencia estudiantil en educación superior puede entenderse como un proceso multidimensional en el que interactúan factores académicos, personales, vocacionales, socioeconómicos, institucionales, de organización del estudio y de adaptación universitaria. Los modelos clásicos de abandono universitario muestran que la continuidad académica no depende solo del rendimiento, sino de la integración académica, la integración social, el compromiso institucional, las condiciones personales y el sentido de pertenencia (Tinto, 1993; Strayhorn, 2012). Asimismo, como dimensión contextual relevante, se reconoce que la continuidad universitaria se relaciona con el valor percibido de continuar los estudios, la utilidad percibida de la formación profesional, las expectativas frente al proyecto formativo, la intención de continuidad y la percepción de apoyo institucional efectivo, sin asumir como afirmación universal que los jóvenes hayan perdido el interés por la educación superior. En América Latina y en Colombia, esta problemática ha motivado lineamientos y sistemas de información orientados a fortalecer el acompañamiento y la permanencia en las instituciones de educación superior (Seminara & Aparicio, 2018; Ministerio de Educación Nacional, 2013, 2023).

En programas de ingeniería, el problema adquiere una expresión particular. Los primeros semestres suelen concentrar cursos base con alto componente matemático, lógico, físico, químico, técnico o de programación. Esta exigencia demanda que los estudiantes se adapten progresivamente a nuevas cargas académicas, ritmos y responsabilidades, desarrollen mayor autonomía en la gestión del tiempo y reconozcan oportunamente cuándo acudir a los apoyos disponibles en la institución. Cuando estas capacidades de autorregulación académica no se consolidan, pueden presentarse pérdida de asignaturas, rezago curricular, dificultad percibida de organización, sobrecarga académica y desconexión progresiva con los recursos universitarios (Credé & Kuncel, 2008; Richardson et al., 2012; Robbins et al., 2004).

En la Facultad de Minas de la Universidad Nacional de Colombia, sede Medellín, el análisis de trayectorias estudiantiles realizado por Cross Arroyave (2024) para el periodo 2010-2023 identificó una tasa de deserción promedio acumulada cercana al 43%. El mismo análisis reportó que alrededor del 75% de las deserciones se concentra en los primeros cuatro semestres, con un pico en el primer semestre. Estas cifras justifican que el proyecto se enfoque en estudiantes de ingeniería, especialmente en etapas iniciales de formación.

En esta investigación, la permanencia no se aborda desde la predicción algorítmica del abandono, sino desde el apoyo a la capacidad cotidiana del estudiante para sostener acciones concretas de aprendizaje autorregulado que favorezcan su trayectoria académica. Entre estas acciones se encuentran planificar la semana, preparar evaluaciones, asistir a monitorías, participar en actividades institucionales, solicitar ayuda oportunamente, equilibrar la carga académica percibida y mantener vínculos con los servicios universitarios. Su realización requiere procesos de autorregulación (planificación, monitoreo y ajuste) y, cuando se repiten en contextos relativamente estables, puede favorecer señales iniciales de continuidad conductual (Wood & Neal, 2007; Lally et al., 2010; Rodríguez et al., 2022).

Las instituciones cuentan con recursos como monitorías, tutorías, asesorías docentes, talleres, programas de bienestar, orientación vocacional, bibliotecas y convocatorias académicas. En la Facultad de Minas, Minas Contigo constituye un referente institucional de acompañamiento académico (Universidad Nacional de Colombia, Facultad de Minas, s.f.). Sin embargo, estos recursos suelen encontrarse dispersos entre páginas web públicas, comunicaciones institucionales por correo y anuncios docentes, por lo que con frecuencia no se traducen en acciones oportunas cuando el estudiante atraviesa semanas de alta carga o dificultad en una asignatura.

Los sistemas de alerta temprana y los modelos predictivos tradicionales pueden estimar riesgo académico o administrativo, pero su impacto real depende de que el diagnóstico se traduzca en acciones comprensibles, contextualizadas y respetuosas de la autonomía del estudiante (Arnold & Pistilli, 2012; de Freitas et al., 2015; Bergdahl et al., 2024). Una alerta aislada no le muestra al estudiante qué paso mínimo viable realizar en su semana, a qué monitoría o recurso vigente acudir ni cómo retomar su ritmo después de una interrupción sin experimentar sanción punitiva o etiquetado estigmatizante. Esta brecha entre la disponibilidad de apoyos institucionales y la ejecución cotidiana de acciones de autorregulación constituye el núcleo del problema abordado.

En consecuencia, esta propuesta acota el problema a la brecha entre la disponibilidad de recursos institucionales de la Facultad de Minas y la capacidad de sus estudiantes de ingeniería para articularlos en acciones concretas, oportunas y sostenibles de autorregulación académica. La investigación no pretende predecir la deserción, ni entrenar un clasificador propio de Machine Learning con una muestra pequeña, ni validar una nueva arquitectura fundacional de inteligencia artificial. Su aporte central consiste en diseñar, implementar y evaluar de forma exploratoria un prototipo funcional de ludificación adaptativa asistido por un modelo de lenguaje de gran escala (LLM), en el cual las decisiones de selección y priorización descansan en reglas deterministas y puntuación transparente sobre un catálogo verificado de misiones y recursos institucionales, mientras que el LLM cumple un papel estrictamente instrumental para estructurar información institucional no estructurada y redactar explicaciones comprensibles y no estigmatizantes.

La pregunta principal de investigación es: ¿cómo diseñar, implementar y evaluar de forma exploratoria un prototipo funcional de sistema de ludificación adaptativa asistido por un modelo de lenguaje de gran escala que apoye acciones de aprendizaje autorregulado y el uso de recursos institucionales en estudiantes de ingeniería de la Facultad de Minas, y qué hallazgos sobre calidad de software, calidad de experiencia (QoE), calidad de servicio (QoS), calidad instrumental del componente LLM, continuidad de uso, pertinencia de las recomendaciones y posibles efectos no deseados se observan durante una prueba piloto longitudinal de diez semanas?

Preguntas de investigación complementarias

1. ¿Qué requisitos conceptuales, funcionales, no funcionales, éticos y de gobernanza de datos se derivan de la revisión sistemática PRISMA 2020 (V5, N = 57 estudios empíricos primarios) y del contexto institucional de la Facultad de Minas para el diseño del prototipo?

2. ¿Cómo estructurar una arquitectura híbrida que separe la ingesta multifuente y moderación de recursos institucionales, el motor determinista de reglas y puntuación para selección de misiones y recursos, y el uso instrumental del modelo de lenguaje de gran escala para extracción estructurada y explicación contextualizada preservando la agencia del estudiante?

3. ¿Cómo implementar el prototipo funcional mediante un proceso iterativo basado en Scrum adaptado que integre roles diferenciados (estudiante, profesor/colaborador de recursos, facilitador y administrador), modo recuperación no punitivo, trazabilidad de recomendaciones y telemetría pseudonimizada?

4. ¿Qué resultados arroja la evaluación exploratoria y longitudinal de diez semanas con 5 a 10 estudiantes de ingeniería de la Facultad de Minas en términos de KPIs de uso y continuidad, KPIs de recomendaciones y conversión a recursos institucionales, calidad de experiencia (QoE), calidad de servicio (QoS), calidad del componente LLM y efectos no deseados?

## 2. JUSTIFICACIÓN

La investigación se justifica por la necesidad de abordar la permanencia estudiantil desde una perspectiva que integre acompañamiento institucional, autorregulación, bienestar, participación y uso responsable de tecnologías digitales. En la Facultad de Minas, los primeros semestres representan una etapa especialmente sensible por la exigencia de los cursos base, la transición hacia una mayor autonomía y la necesidad de utilizar oportunamente monitorías, tutorías, bienestar y otros apoyos institucionales. Esta orientación es coherente con las políticas nacionales de permanencia y graduación, que resaltan la identificación de factores de riesgo y el fortalecimiento del acompañamiento en educación superior (Ministerio de Educación Nacional, 2013, 2023).

El aporte esperado no consiste en digitalizar un listado estático de anuncios ni en construir un clasificador predictivo de abandono. La propuesta busca diseñar e implementar una estrategia de ludificación adaptativa capaz de articular datos mínimos y autorizados del estudiante (programa, semestre, carga académica percibida, dificultad percibida de organización y manejo del tiempo, asignaturas de dificultad y disponibilidad) con un catálogo vivo y verificado de recursos institucionales alimentado por múltiples fuentes autorizadas (recolector web con lista blanca, conector de correo institucional con sanitización previa de datos personales y registro directo por profesores y administradores). A partir de ello, el sistema propone misiones académicas, de planificación, consulta de apoyos y modo recuperación cuando el estudiante atraviesa semanas de baja continuidad.

La ludificación se adopta como enfoque de diseño porque permite estructurar experiencias de progreso, metas alcanzables, retroalimentación, autonomía, competencia y relación. La decisión de usar el término ludificación busca mantener consistencia conceptual en el informe, aunque se reconoce que gamification es el término más extendido en la literatura internacional. En este proyecto, la ludificación se entiende como la incorporación de elementos propios del diseño de juegos, como misiones, niveles, progreso y retroalimentación, en actividades académicas que no constituyen un juego en sí mismas (Deterding et al., 2011).

No se emplearán serious games porque el propósito no es desarrollar un juego educativo completo con narrativa, personajes, escenarios, reglas cerradas y evaluación interna del desempeño dentro del juego. Ese enfoque desplazaría la investigación hacia el desarrollo de un producto lúdico autónomo. La ludificación, en cambio, permite proponer una capa de diseño integrable a acciones académicas, recursos institucionales y actividades de autorregulación sin convertir la intervención en un videojuego.

La literatura muestra que la ludificación no produce resultados uniformes. Hamari et al. (2014) encontraron efectos positivos en varios estudios, pero dependientes del contexto y del diseño. Oliveira et al. (2024) señala beneficios y desafíos en entornos digitales, incluyendo sostenibilidad, diferencias individuales, sobrecarga y posibles efectos negativos. Gini et al. (2025) evidencia la expansión del campo de la ludificación en educación, mientras que Misara et al. (2025) advierte la necesidad de superar enfoques reducidos a puntos e insignias. Por ello, la estrategia se analizará mediante una validación formativa centrada en funcionamiento, usabilidad, comprensión, utilidad, pertinencia y posibles efectos no deseados.

La revisión sistemática definitiva (PRISMA V5) demostró que las capacidades necesarias para responder a este problema suelen investigarse de manera fragmentada en la literatura. Las mecánicas tradicionales de gamificación generan efectos motivacionales transitorios si no se vinculan a andamiajes de autorregulación del aprendizaje (SRL); la analítica y los sistemas de alerta temprana identifican desenganche pero requieren traducirse en intervenciones activas; los asistentes basados en modelos de lenguaje grande (LLMs) aportan retroalimentación y explicabilidad contextual pero exigen controles frente a alucinaciones y pasividad metacognitiva; y la conexión efectiva con servicios institucionales reales (monitorías, tutorías, asesorías, bienestar) continúa siendo la dimensión menos integrada en las plataformas universitarias.

Otro hallazgo relevante es que muchos antecedentes se concentran en cursos o plataformas educativas específicas, o en sistemas que detectan riesgo y generan alertas. La revisión identificó una brecha entre detectar una necesidad y traducirla en acciones comprensibles, contextualizadas y realizables por el estudiante. Por ello, el proyecto propone misiones y recomendaciones vinculadas con recursos reales de la Facultad de Minas, en lugar de limitarse a mostrar indicadores o clasificar estudiantes.

La solidez metodológica y empírica de la revisión sistemática V5 respalda directamente este trabajo aplicado. Bajo las directrices PRISMA 2020 y mediante la infraestructura propia de auditoría inmutable prisma-review-app, se consultaron Scopus, IEEE Xplore y ERIC en la ventana estricta 2014–2026 (manteniendo separado el horizonte exploratorio preliminar de 149.985 resultados brutos y 58.856 registros canónicos). De 6.573 registros identificados en las 24 búsquedas definitivas, se eliminaron 1.240 duplicados exactos y se cribaron 5.333 registros únicos; se buscaron 249 informes para texto completo (146 DIRECT_CORE y 103 rescatados mediante Lexical Rescue), recuperando legalmente 72 documentos en acceso abierto (y registrando 177 no recuperados por muros de pago editoriales). Tras la evaluación de elegibilidad a texto completo (63 candidatos revisados humanamente), se consolidó un corpus definitivo de 57 estudios empíricos primarios: 18 estudios de métodos mixtos (31,6%), 15 estudios observacionales y de analítica predictiva (26,3%), 9 ensayos controlados aleatorizados (15,8%), 8 diseños cuasiexperimentales (14,0%) y 7 estudios cualitativos o de caso (12,3%), con el 54,4% del corpus (31 estudios) publicado entre 2024 y 2026.

La validación se organizará en dos momentos complementarios. Primero se realizará una sesión inicial de usabilidad y comprensión con una muestra pequeña de usuarios finales. Después, los participantes utilizarán el prototipo durante diez semanas, periodo que permitirá observar adherencia, continuidad semanal, uso del modo recuperación, cumplimiento de misiones y percepción de utilidad. Este seguimiento no demostrará causalidad ni hábitos plenamente consolidados, pero ofrecerá evidencia formativa más consistente que una única sesión.

La formulación del objetivo general y de los objetivos específicos incorpora una precisión conceptual central: un modelo de lenguaje de gran escala (LLM) no equivale a un modelo predictivo de Machine Learning entrenado para clasificar deserción. Dado que el estudio piloto tiene carácter exploratorio, longitudinal (10 semanas) y formativo con una muestra de 5 a 10 estudiantes, sería metodológicamente improcedente entrenar un modelo predictivo propio o realizar benchmarking de modelos fundacionales. En cambio, el sistema se define como un sistema de ludificación adaptativa asistido por un modelo de lenguaje de gran escala, donde el LLM opera como componente instrumental subordinado a reglas deterministas y a un catálogo institucional verificado, evaluándose como parte integral del sistema mediante indicadores de calidad de software, QoE, QoS, groundedness, cumplimiento de esquema, continuidad de uso y pertinencia de las recomendaciones.

## 3. OBJETIVOS

### 3.1. OBJETIVO GENERAL

Desarrollar y evaluar de forma exploratoria un prototipo de sistema de ludificación adaptativa asistido por un modelo de lenguaje de gran escala para apoyar acciones de aprendizaje autorregulado y el uso de recursos institucionales en estudiantes de ingeniería de la Facultad de Minas.

### 3.2. OBJETIVOS ESPECÍFICOS

1. Especificar los requerimientos conceptuales, funcionales, no funcionales, éticos y de gobernanza de datos que debe apoyar el sistema para el aprendizaje autorregulado y la articulación de recursos institucionales, a partir de la revisión sistemática PRISMA 2020 (V5) y del contexto de los estudiantes de ingeniería de la Facultad de Minas.

2. Diseñar la arquitectura híbrida del sistema, los componentes de ludificación adaptativa, el pipeline multifuente de ingesta y moderación de recursos institucionales y la integración instrumental del modelo de lenguaje de gran escala para extracción estructurada y explicación contextualizada.

3. Implementar mediante Scrum adaptado el prototipo funcional del sistema de ludificación adaptativa asistido por un modelo de lenguaje de gran escala, incorporando control de roles, motor determinista de reglas y puntuación, modo recuperación, trazabilidad de recomendaciones y telemetría pseudonimizada.

4. Evaluar el prototipo mediante indicadores de calidad de software, calidad de experiencia (QoE), calidad de servicio (QoS), calidad instrumental del componente LLM, continuidad de uso y pertinencia de las recomendaciones durante una prueba piloto longitudinal con estudiantes de ingeniería de la Facultad de Minas.

## 4. MARCO TEÓRICO

### 4.1. ANTECEDENTES

Los antecedentes sobre permanencia estudiantil muestran que la capacidad de sostener una trayectoria académica depende de factores académicos, personales, sociales e institucionales. Desde los modelos clásicos de abandono universitario, la deserción no puede explicarse únicamente por bajo rendimiento; también intervienen integración académica, integración social, compromiso institucional, condiciones personales y sentido de pertenencia (Tinto, 1993; Strayhorn, 2012). Estos antecedentes delimitan las conductas y condiciones que el proyecto busca apoyar mediante el prototipo.

En programas de ingeniería, la permanencia se ve influida por dificultades en asignaturas base, pérdida reiterada de cursos, rezago curricular, planeación inadecuada de la carga académica, dificultades de organización del tiempo y bajo uso oportuno de recursos de apoyo (Credé & Kuncel, 2008; Richardson et al., 2012; Robbins et al., 2004; Rodríguez et al., 2022). Adicionalmente, como dimensión contextual, la literatura y la observación institucional sugieren considerar posibles transformaciones en la valoración subjetiva de la educación superior: el valor percibido de continuar en la universidad, la utilidad percibida de la formación frente a las expectativas personales, el sentido de pertenencia, la intención de continuidad y la percepción de apoyo institucional. Esta dimensión se aborda de forma exploratoria y contextual —sin formular generalizaciones absolutas sobre una supuesta pérdida universal de interés juvenil por la universidad— para comprender mejor en qué medida los apoyos recomendados adquieren sentido para el estudiante.

El contexto de la Facultad de Minas aporta una delimitación empírica para el problema. Cross Arroyave (2024) reportó, para el periodo 2010-2023, una tasa de deserción promedio acumulada cercana al 43 % y una concentración aproximada del 75 % de las deserciones en los primeros cuatro semestres. Este hallazgo justifica orientar la estrategia a estudiantes de programas de ingeniería de la Facultad de Minas, con preferencia por quienes cursan etapas iniciales, sin restringir la población de la tesis a Ingeniería de Sistemas.

### 4.2. Prototipo funcional y ludificación como estrategia de diseño

La ludificación consiste en aplicar elementos del diseño de juegos a actividades que no fueron concebidas originalmente como juegos (Deterding et al., 2011). En esta investigación, dichos elementos incluyen misiones, niveles, progreso visible, retroalimentación, logros personales, metas mínimas viables y modo recuperación. La adaptación y la personalización no se plantean como características separadas de la inteligencia artificial: corresponden al uso instrumental que se hará de ella para ajustar la selección, prioridad, frecuencia o dificultad de las misiones según información mínima, autorizada y pertinente del estudiante.

El prototipo funcional se entiende como una versión operativa y acotada del sistema que implementa las funciones necesarias para demostrar y probar la estrategia con usuarios finales. No corresponde a un producto mínimo viable orientado al mercado ni a una plataforma institucional definitiva. Su función es materializar la ludificación, incorporar de manera controlada la personalización de recomendaciones mediante inteligencia artificial, permitir la interacción con misiones y recursos institucionales y facilitar la identificación temprana de problemas de diseño.

La evidencia empírica sobre ludificación requiere una lectura crítica. Hamari et al. (2014) mostraron que los efectos dependen del contexto, del diseño y del usuario. Domínguez et al. (2013), Barata et al. (2013), Denny (2013), Hakulinen et al. (2015) y Valda Sánchez y Arteaga Rivero (2015) aportan antecedentes sobre participación, logros virtuales, insignias y experiencias ludificadas en educación superior. Gini et al. (2025) ubican la ludificación educativa como una línea en expansión, Misara et al. (2025) plantean la necesidad de superar diseños reducidos a puntos e insignias y Oliveira et al. (2024) identifica beneficios y desafíos en entornos digitales.

### 4.3. Motivación, autonomía, competencia y relación

La Teoría de la Autodeterminación constituye uno de los fundamentos motivacionales de la propuesta. Ryan y Deci (2000) plantean que la motivación sostenida se fortalece cuando se satisfacen tres necesidades psicológicas básicas: autonomía, competencia y relación. La autonomía se refiere a la percepción de control sobre las propias acciones; la competencia, a la percepción de progreso y eficacia; y la relación, al sentido de conexión con otras personas.

Desde esta perspectiva, una estrategia ludificada será pertinente si permite que el estudiante tome decisiones, perciba avance y se conecte con recursos o personas de apoyo. Por esta razón, el proyecto prioriza progreso individual, metas mínimas viables, retroalimentación positiva, rutas de apoyo y modo recuperación, en lugar de rankings públicos o dinámicas de comparación entre estudiantes.

Deci et al. (1999) advierten que ciertas recompensas externas pueden debilitar la motivación intrínseca cuando se perciben como mecanismos de control. Esta advertencia resulta relevante para la ludificación, porque puntos, rachas rígidas, premios o rankings pueden incrementar interacción inicial, pero también generar presión, comparación negativa, frustración o dependencia de incentivos. La estrategia propuesta deberá analizar inicialmente estos efectos, no solo los beneficios percibidos.

### 4.4. Formación de hábitos, autorregulación y continuidad conductual

La literatura sobre hábitos permite diferenciar entre interacción inicial, repetición de acciones y consolidación conductual. Wood y Neal (2007) definen los hábitos como respuestas relativamente automáticas que se desarrollan mediante repetición de conductas en presencia de señales contextuales estables. Por tanto, un aumento temprano en el uso del prototipo o en el número de misiones completadas no equivale por sí mismo a formación de hábitos.

Lally et al. (2010) realizaron un estudio longitudinal en condiciones de vida cotidiana durante 12 semanas. El estudio encontró que la automaticidad se desarrolla de forma progresiva, con un promedio aproximado de 66 días y una variación estimada entre 18 y 254 días. A partir de este antecedente, la prueba longitudinal de la tesis se plantea durante diez semanas, equivalentes a 70 días, porque este periodo permite observar repetición y continuidad alrededor del promedio reportado, aunque no garantiza que todos los participantes consoliden hábitos.

En educación superior, la autorregulación académica comprende la capacidad de planificar, supervisar y ajustar las propias acciones de aprendizaje. Se expresa en conductas como organizar la semana, preparar evaluaciones, priorizar tareas, asistir a monitorías, pedir ayuda y revisar el progreso. En esta tesis, la autorregulación académica es el conjunto de conductas que el prototipo busca apoyar. Los resultados se interpretarán como señales iniciales de continuidad y apropiación, no como demostración definitiva de hábitos consolidados o permanencia universitaria.

### 4.5. Equilibrio académico, carga percibida y dimensión contextual de valor universitario

La experiencia universitaria está estrechamente vinculada con la capacidad del estudiante para gestionar su carga de trabajo y sostener su bienestar cotidiano. Rodríguez et al. (2022) muestran la relación entre autorregulación y bienestar en educación superior, Fang et al. (2025) analizan el manejo de demandas académicas desde una perspectiva multifactorial, y Salmela-Aro y Read (2017) examinan perfiles de compromiso y agotamiento estudiantil. No obstante, en coherencia con el principio ético de minimización de datos y con la prohibición de realizar diagnósticos psicológicos o clínicos, este proyecto evita recopilar variables clínicas de estrés o salud mental.

En su lugar, el prototipo operacionaliza constructos académicos no clínicos directamente accionables desde la autorregulación del aprendizaje: (1) la carga académica percibida (baja, media, alta), (2) la dificultad percibida de organización y manejo del tiempo, (3) las asignaturas que requieren priorización de apoyo y (4) la dimensión contextual sobre el valor y sentido percibido de continuar en la Universidad. Ello permite activar oportunamente el modo recuperación (metas mínimas viables sin penalización) y sugerir recursos institucionales pertinentes (monitorías, talleres de gestión del tiempo, acompañamiento de Bienestar Universitario o Minas Contigo) sin invadir la intimidad clínica del participante.

### 4.6. Analítica de aprendizaje, modelos predictivos y sistemas de alerta temprana

La analítica de aprendizaje ha sido utilizada para identificar patrones de riesgo, personalizar intervenciones, generar retroalimentación y apoyar decisiones institucionales. Course Signals, desarrollado en Purdue University, constituye un antecedente representativo porque integró datos académicos, demográficos e interacción en plataformas virtuales para identificar estudiantes en riesgo y proporcionar retroalimentación temprana (Arnold & Pistilli, 2012).

De Freitas et al. (2015) plantean que el análisis dinámico de datos universitarios puede contribuir a estrategias de retención cuando permite identificar patrones de riesgo y orientar intervenciones. Leitner et al. (2017) y Bergdahl et al. (2024) muestran que la analítica de aprendizaje en educación superior se relaciona con identificación de riesgo, participación, retroalimentación y toma de decisiones institucionales.

No obstante, una alerta o un modelo predictivo no resuelve por sí mismo el problema de permanencia. Su utilidad depende de la capacidad de traducir el diagnóstico en acciones oportunas, comprensibles y contextualizadas. Por ello, esta tesis no busca construir un modelo predictivo robusto de deserción. Se propone usar datos mínimos y autorizados para adaptar misiones y recomendaciones dentro de una estrategia de acompañamiento.

### 4.7. Arquitectura híbrida de recomendación y papel instrumental del modelo de lenguaje (LLM)

Los sistemas de recomendación educativos incrementan la pertinencia del acompañamiento cuando sugieren recursos o actividades alineadas con el perfil y el momento académico del estudiante (Urdaneta-Ponte et al., 2021), fortaleciendo la agencia del aprendiz siempre que apoyen sus decisiones en lugar de sustituirlas (Deschênes, 2020; Li et al., 2026). Asimismo, la literatura reciente del corpus PRISMA V5 sobre ludificación adaptativa y agentes asistidos por modelos de lenguaje (Ge et al., 2025; Maimaiti & Hew, 2025a, 2025b; Bai & Liu, 2026; Brezoaie et al., 2026; Marengo et al., 2025) evidencia el potencial de combinar reglas explícitas con capacidades generativas controladas. En esta tesis se establece una distinción conceptual estricta: el uso de un modelo de lenguaje de gran escala (LLM) no constituye un modelo predictivo de Machine Learning entrenado para clasificar deserción ni el único motor de decisión del sistema.

El prototipo adopta una arquitectura híbrida en capas que separa rigurosamente la decisión algorítmica de la generación lingüística: (1) Datos mínimos y autorizados del estudiante -> (2) Motor determinista de reglas y scoring sencillo (calculado en función de afinidad temática, semestre, programa, necesidad reportada, disponibilidad, vigencia del recurso, compatibilidad de horario y preferencias) -> (3) Catálogo estructurado y verificado de misiones y recursos institucionales con estado PUBLISHED/ACTIVE -> (4) Selección y priorización determinista de candidatos -> (5) Componente LLM instrumental para contextualizar, adaptar el tono o explicar por qué se sugiere la acción (con mecanismo automático de fallback a plantilla determinista en caso de error o latencia) -> (6) Agencia del estudiante (quien puede ACEPTAR, POSPONER, EDITAR, RECHAZAR o indicar "NO QUIERO RECOMENDACIONES COMO ESTA") -> (7) Telemetría pseudonimizada -> (8) Análisis integrado de QoE, QoS, calidad del LLM, continuidad y pertinencia.

Dentro de esta arquitectura, el papel del LLM queda taxativamente delimitado. El LLM PODRÁ: contextualizar recomendaciones previamente seleccionadas por reglas; adaptar el tono de los mensajes (cercano, no punitivo); explicar con transparencia por qué se sugiere una acción (p. ej., "Te sugerimos esta monitoría porque reportaste dificultad en esta asignatura y actualmente existe una sesión disponible"); redactar mensajes a partir de datos estructurados; transformar información institucional no estructurada procedente de páginas web oficiales en lista blanca o correos institucionales autorizados (previa eliminación de datos personales) en registros JSON validados por esquema; resumir convocatorias, talleres o apoyos; presentar misiones de forma comprensible; y operar exclusivamente sobre recursos existentes con resource_id válido y estado PUBLISHED. Por el contrario, el LLM NO PODRÁ: diagnosticar psicológicamente al estudiante; decidir si debe continuar o abandonar la Universidad; tomar decisiones académicas ni asignar sanciones o calificaciones; acceder a historias académicas o datos restringidos; inventar recursos institucionales, horarios, contactos o convocatorias; ni etiquetar a los estudiantes como "de alto riesgo".

### 4.8. Ética, privacidad, transparencia y gobernanza formal de datos

La integración de analítica conductual, recomendación adaptativa y modelos de lenguaje en educación superior exige salvaguardas explícitas de privacidad desde el diseño (Cavoukian, 2011; Slade & Prinsloo, 2013; Jones, 2019; Cerratto Pargman & McGrath, 2021). En este proyecto se establece una estrategia formal de Gobernanza de Datos (Data Governance) que documenta, para cada variable del sistema, once atributos obligatorios: nombre de la variable, finalidad específica, justificación de necesidad, fuente de origen, nivel de sensibilidad, mecanismo de autorización, periodo de retención, roles con control de acceso, regla de pseudonimización, política sobre si se envía o no a servicios externos de IA, y procedimiento de eliminación o retiro.

Por defecto, el sistema prohíbe recolectar o procesar calificaciones, historia académica oficial, identificadores civiles directos (cédula), diagnósticos médicos o psicológicos, correos personales no institucionales e información disciplinaria. Asimismo, en el conector de correo institucional (InstitutionalMailConnector), antes de cualquier procesamiento asistido por LLM se ejecuta una etapa obligatoria de sanitización que elimina nombres propios personales, correos privados, números de documento, firmas, teléfonos personales, hilos de conversación y adjuntos privados, extrayendo únicamente los metadatos públicos del recurso universitario.

### 4.9. Revisión sistemática de literatura con lógica PRISMA 2020 (Versión Definitiva V5)

La revisión sistemática que fundamenta científicamente esta tesis corresponde a la versión final V5, desarrollada bajo la declaración PRISMA 2020 (Page et al., 2021) y gestionada mediante una infraestructura de software propia y auditable denominada prisma-review-app (basada en Python 3.12 y SQLite con modo WAL y disparadores de inmutabilidad append-only en audit_events, garantizando trazabilidad muchos-a-uno entre raw_records, canonical_records y record_sources, y separación estricta entre triaje asistido por IA y decisión humana soberana). El proceso distinguió rigurosamente dos horizontes metodológicos para evitar cualquier contaminación entre pruebas preliminares y conteos formales: un Horizonte 1 (Fase exploratoria y de calibración 2024–2025), en el que se exploraron seis bases de datos con 149.985 resultados declarados, 93.693 registros brutos importados y 58.856 registros canónicos deduplicados (auditando un precribado experimental de 50.865 registros y un pool de calibración de 575 candidatos contrastado frente a un Reference Set de 42 estudios seminales); y un Horizonte 2 (Ronda Definitiva Congelada 2014–2026), que constituye la fuente oficial de la revisión.

Con base en los hallazgos técnicos de la fase exploratoria —que evidenciaron alto solapamiento redundante de ScienceDirect con Scopus, truncamiento de exportación por lotes en Web of Science, baja cobertura empírica específica de software adaptativo en SciELO y restricciones de descarga masiva en ACM Digital Library—, el protocolo definitivo congelado seleccionó exclusivamente tres bases de datos científicas de alta reproducibilidad: Scopus, IEEE Xplore y ERIC, con una ventana temporal estricta de publicación entre 2014 y 2026 (conservando obras clásicas previas únicamente como referentes teóricos fundacionales en el marco conceptual).

La estrategia de búsqueda definitiva se operacionalizó mediante ocho familias temáticas (A, B, CA, CB, D, EA, EB y F) adaptadas a la sintaxis nativa de cada motor (TITLE-ABS-KEY y operadores de proximidad W/n en Scopus; Command Search con operadores NEAR/n en IEEE Xplore; y bloques booleanos con filtro temporal 2014–2026 en ERIC), totalizando 24 ejecuciones formales auditadas:

1. Familia A (Gamificación + autorregulación/permanencia): Scopus = 478 (SCOPUS_A), ERIC = 12 (ERIC_A), IEEE Xplore = 328 (IEEE_A).

2. Familia B (Gamificación adaptativa/personalizada): Scopus = 210 (SCOPUS_B), ERIC = 11 (ERIC_B), IEEE Xplore = 179 (IEEE_B).

3. Familia CA (Sistemas adaptativos y recomendadores educativos): Scopus = 84 (SCOPUS_CA3), ERIC = 384 (ERIC_CA), IEEE Xplore = 687 (IEEE_CA_FINAL).

4. Familia CB (IA generativa / LLM + adaptación, andamiaje y apoyo académico): Scopus = 497 (SCOPUS_CB), ERIC = 13 (ERIC_CB), IEEE Xplore = 148 (IEEE_CB).

5. Familia D (Learning analytics, tableros y sistemas de alerta temprana con intervención): Scopus = 868 (SCOPUS_D), ERIC = 716 (ERIC_D), IEEE Xplore = 715 (IEEE_D).

6. Familias EA, EB y F (Ética de analítica/adaptación [EA: Scopus = 306, ERIC = 256, IEEE = 284], Ética de GenAI/LLM [EB: Scopus = 113, ERIC = 14, IEEE = 33] e Integración con recursos y apoyos institucionales [F: Scopus = 28, ERIC = 109, IEEE = 100]).

Los criterios de inclusión exigieron: (1) estudios empíricos primarios publicados entre 2014 y 2026; (2) población en educación superior, ingeniería, ciencias de la computación o contextos universitarios directamente transferibles; (3) evaluación de ludificación adaptativa, autorregulación (SRL), sistemas recomendadores, analítica de aprendizaje, IA generativa/LLM o articulación con apoyos institucionales; y (4) reporte verificable de diseño metodológico y resultados con estudiantes. Se excluyeron duplicados exactos y secundarios, estudios en educación básica sin transferencia universitaria, videojuegos completos (serious games) ajenos a ludificación como capa de diseño, propuestas puramente algorítmicas sin validación con estudiantes (código FT8) y revisiones narrativas o secundarias (código FT9).

El flujo formal de selección PRISMA 2020 (V5) partió de 6.573 registros brutos identificados en las 24 búsquedas definitivas (Scopus = 2.584; IEEE Xplore = 2.474; ERIC = 1.515). La deduplicación determinista por DOI normalizado y título/año eliminó 1.240 duplicados exactos, consolidando 5.333 registros únicos para cribado. El pipeline escalonado de triaje retuvo 4.991 registros en Stage 1 (descartando 342 irrelevantes claros), 2.107 registros en Stage 2 y 672 registros prioritarios tras el consenso ciego multi-agente en Stage 3. Posteriormente, la aplicación del Filtro Nuclear identificó 146 registros DIRECT_CORE y la auditoría de rescate léxico semántico (Lexical Rescue sobre 140 candidatos en riesgo por sinónimos) recuperó 103 registros adicionales (RESCUE_TO_FULLTEXT), conformando 249 informes buscados para recuperación de texto completo.

Mediante dos rondas de recuperación legal en repositorios abiertos (OpenAlex, Unpaywall, ERIC, SciELO y repositorios universitarios) se obtuvieron 72 textos completos en PDF (28,9%), mientras que 177 informes quedaron registrados como no recuperados (148 por muros de pago editoriales comerciales y 29 por ausencia de copia pública disponible, sin contabilizarse como exclusiones metodológicas conforme a PRISMA 2020). En la evaluación de elegibilidad a texto completo (rúbrica FT1–FT11) se excluyeron 9 informes (5 por código FT8 sin validación empírica estudiantil, 3 por FT_OTHER fuera de educación superior y 1 por FT9 revisión previa), pasando 63 candidatos a verificación humana integral. En esta etapa final, la revisora principal identificó y excluyó 4 reportes duplicados secundarios tardíos (asociados a los estudios matrices S09 y S15, código DUPLICATE_REPORT) y 2 estudios fuera del rango temporal 2014–2026 (código OUTSIDE_DATE_RANGE), consolidando un corpus definitivo de 57 estudios empíricos primarios (5.333 únicos -> 249 buscados -> 72 recuperados -> 63 revisados humanamente -> 57 incluidos).

Figura 1. Diagrama de flujo PRISMA 2020 adaptado al proceso de selección del corpus definitivo (57 estudios empíricos primarios incluidos).

En sustitución de escalas numéricas genéricas (como puntajes únicos de 0 a 12 que resultan metodológicamente inadecuados para comparar diseños heterogéneos), la revisión V5 adoptó un marco de valoración crítica diferenciado según el diseño de cada estudio: herramientas del Joanna Briggs Institute (JBI) para estudios cuasiexperimentales, observacionales y cualitativos; la herramienta Mixed Methods Appraisal Tool (MMAT, versión 2018) para estudios de métodos mixtos; y AMSTAR 2 como referente para síntesis metodológicas (Shea et al., 2017; Hong et al., 2018; JBI, 2026). Asimismo, la suficiencia y consistencia de la evidencia transversal se cualificó mediante tres descriptores auditables: evidencia "convergente", "mixta" o "insuficiente".

El perfil temporal de los 57 estudios empíricos primarios (ventana estricta 2014–2026) evidencia una aceleración pronunciada en los últimos años: el 54,4% del corpus (31 estudios) se publicó entre 2024 y 2026, y el 49,1% (28 estudios) se concentra exclusivamente en el bienio 2025–2026. Esta concentración refleja la transición desde tableros descriptivos tempranos (2014–2021) hacia entornos adaptativos e intervenciones conversacionales asistidas por modelos de lenguaje grande en educación superior.

Figura 2. Distribución temporal de los 57 estudios incluidos en la síntesis central (2014–2026).

La distribución por eje temático principal de los 57 estudios incluidos demuestra el peso de la personalización y de la asistencia mediante IA: los sistemas adaptativos y recomendadores lideran el corpus con 19 estudios (33,3%), seguidos por inteligencia artificial generativa y asistentes conversacionales con 16 estudios (28,1%), analítica de aprendizaje y tableros reflexivos con 12 estudios (21,1%), alertas tempranas e intervenciones de retención con 6 estudios (10,5%) y dinámicas motivacionales de gamificación con 4 estudios (7,0%). En el plano disciplinar, el 42,1% de los estudios se desarrolló directamente en ingeniería y ciencias de la computación, y un 15,8% adicional en áreas STEM afines.

Además del corpus de 57 estudios empíricos, la revisión realizó un análisis funcional exploratorio de cuatro aplicaciones consolidadas (Habitica, Finch, MyStudyLife y Duolingo) y tres prototipos académicos recientes (SRLAgent [Ge et al., 2025], SmartFlash [Li et al., 2026] y LearnSpace), constatando que ninguno integra simultáneamente ludificación no punitiva, autorregulación académica, explicación asistida por LLM y conexión verificada con recursos institucionales universitarios reales.

Figura 3. Distribución de los 57 estudios por eje temático principal.

Respecto al tipo de evidencia metodológica (N = 57), el corpus está conformado íntegramente por estudios empíricos primarios: 18 estudios de métodos mixtos convergentes o explicativos (31,6%), 15 estudios observacionales y de modelado/analítica predictiva (26,3%), 9 ensayos controlados aleatorizados —RCT— (15,8%), 8 estudios cuasiexperimentales con grupo de comparación (14,0%) y 7 estudios cualitativos o de caso en profundidad (12,3%).

Figura 4. Tipos de evidencia metodológica incluidos en el corpus central (N = 57).

El cruce matricial entre eje temático y tipo de evidencia (Figura 5) muestra que el modelado observacional predomina en recomendadores y analítica, mientras que los estudios sobre IA generativa y asistentes conversacionales emplean mayoritariamente métodos mixtos y estudios de caso para capturar la calidad de la interacción y la percepción de agencia, y los ensayos controlados y cuasiexperimentos validan intervenciones gamificadas y de acompañamiento activo.

Figura 5. Matriz entre eje temático principal y tipo de evidencia (N = 57).

Finalmente, la trazabilidad de aportes frente a las cinco preguntas de revisión (Figura 6) confirma que, aunque existe evidencia convergente sobre el valor del andamiaje SRL y la necesidad de traducir alertas en acciones, la articulación directa con el catálogo de recursos institucionales universitarios y la evaluación longitudinal de efectos no deseados (presión, saturación, vigilancia percibida o pasividad metacognitiva) presentan todavía evidencia empírica directa insuficiente.

Figura 6. Número de estudios del corpus que aportan a cada pregunta de revisión (N = 57).

| Fase PRISMA 2020 (V5) | Aplicación auditada en la revisión sistemática definitiva (2014–2026) |
| --- | --- |
| Horizonte 1 (Exploratorio y calibración previa) | Mapeo exploratorio separado (2024–2025) con 149.985 resultados brutos declarados en seis bases, 93.693 registros importados en raw_records y 58.856 registros canónicos en prisma-review-app. Permitió calibrar el protocolo frente a un Reference Set de 42 estudios seminales y descartar bases con sesgos de exportación o solapamiento redundante. |
| Identificación (Horizonte 2 definitivo) | Búsqueda sincrónica congelada en Scopus (2.584), IEEE Xplore (2.474) y ERIC (1.515) mediante 8 familias temáticas (A, B, CA, CB, D, EA, EB y F; 24 ejecuciones formales), identificando 6.573 registros brutos en la ventana estricta 2014–2026. |
| Deduplicación y Cribado (Stages 1–3) | Se eliminaron 1.240 duplicados exactos por DOI y título/año normalizado, cribando 5.333 registros únicos: Stage 1 retuvo 4.991; Stage 2 retuvo 2.107; y el consenso ciego multi-agente en Stage 3 retuvo 672 registros prioritarios. |
| Filtro Nuclear, Rescate Léxico y Recuperación | Se consolidaron 249 informes buscados para texto completo (146 DIRECT_CORE + 103 rescatados vía Lexical Rescue). Se recuperaron legalmente 72 PDFs en acceso abierto y 177 quedaron como no recuperados por muros de pago editoriales o falta de copia pública. |
| Elegibilidad e Inclusión Final | De los 72 textos completos evaluados con la rúbrica FT1–FT11, se excluyeron 9 (FT8, FT9, FT_OTHER) y 63 pasaron a revisión humana final. Tras excluir 4 reportes duplicados tardíos (DUPLICATE_REPORT) y 2 fuera de ventana temporal (OUTSIDE_DATE_RANGE), se incluyeron 57 estudios empíricos primarios. |

### 4.10. Brechas identificadas en la literatura

La síntesis del corpus definitivo de 57 estudios empíricos permitió precisar siete vacíos de investigación que justifican directamente el diseño del prototipo Vivu. Primero, las mecánicas gamificadas genéricas (puntos, insignias fijas y rankings competitivos) muestran desgaste motivacional rápido si no se acoplan a ciclos de autorregulación académica y a modos de recuperación compasivos ante interrupciones. Segundo, los sistemas de alerta temprana y analítica predictiva identifican riesgo pero rara vez proveen al estudiante un puente operativo hacia recursos institucionales concretos, vigentes y verificados de su propia facultad.

Tercero, los asistentes basados en LLM (2024–2026) ofrecen alto potencial para explicar recomendaciones y estructurar información dispersa, pero entrañan riesgos de alucinación (invención de recursos o fechas) y desplazamiento de la agencia si no se subordinan a un motor determinista de reglas y a un catálogo institucional moderado. Cuarto, persiste una atención insuficiente a la medición simultánea de calidad de experiencia (QoE), calidad de servicio (QoS), calidad instrumental del componente LLM (groundedness, cumplimiento de esquema, tasa de fallback) y efectos adversos (presión, frustración, saturación y vigilancia percibida) en pruebas longitudinales con estudiantes de ingeniería.

### 4.11. Matriz comparativa de antecedentes

Los antecedentes se organizan por líneas de investigación y tipos de solución. Esta organización permite mostrar cómo cada línea aporta elementos para la propuesta y qué limitaciones permanecen frente al problema formulado.

| Línea de antecedente | Aporte principal (incluyendo corpus PRISMA V5) | Limitación frente a esta tesis |
| --- | --- | --- |
| Modelos de permanencia y valor percibido | Tinto (1993) y Strayhorn (2012) explican la integración académica/social y el sentido de pertenencia; se articula además la dimensión contextual sobre valor percibido de continuar la universidad. | Explican macrofactores de permanencia, pero no operacionalizan cómo traducirlos en microacciones semanales de autorregulación. |
| Autorregulación académica y formación de hábitos | Robbins et al. (2004), Credé y Kuncel (2008), Wood y Neal (2007), Lally et al. (2010) y Maimaiti y Hew (2025a, 2025b) fundamentan la planificación, el monitoreo y la repetición progresiva (promedio de 66 días, rango 18–254 días). | Requieren apoyo digital contextualizado y no punitivo para sostener la continuidad en primeros semestres de ingeniería. |
| Contexto Facultad de Minas y apoyos institucionales | Cross Arroyave (2024) documenta ~43% de deserción acumulada (75% en primeros cuatro semestres); Minas Contigo, monitorías y Bienestar ofrecen apoyo institucional real. | La información institucional suele estar dispersa entre páginas web, correos y anuncios docentes sin conexión con la planeación semanal del estudiante. |
| Analítica de aprendizaje y alerta temprana (12 y 6 estudios en V5) | Arnold y Pistilli (2012), de Freitas et al. (2015), Leitner et al. (2017) y Bergdahl et al. (2024) detectan señales tempranas de desenganche y apoyan la reflexión. | El diagnóstico o predicción de riesgo por sí solo no indica qué acción concreta tomar ni qué recurso institucional vigente utilizar. |
| Ludificación educativa y adaptativa (4 estudios nucleares y transversal en V5) | Deterding et al. (2011), Hamari et al. (2014), Gini et al. (2025), Misara et al. (2025) y Bai y Liu (2026) evidencian mejoras motivacionales cuando se supera el enfoque rígido de puntos e insignias. | Mecánicas rígidas o competitivas pueden inducir presión, saturación o pérdida de autonomía si carecen de modo recuperación. |
| Sistemas recomendadores e IA generativa / LLM (19 y 16 estudios en V5) | Deschênes (2020), Urdaneta-Ponte et al. (2021), Ge et al. (2025 [SRLAgent]), Li et al. (2026 [SmartFlash]), Brezoaie et al. (2026) y Marengo et al. (2025) muestran el valor de combinar adaptación con explicaciones generadas por LLM. | Un LLM sin catálogo verificado ni motor determinista puede alucinar recursos inexistentes o reducir la agencia estudiantil. |
| Ética, privacidad y gobernanza de datos | Cavoukian (2011), Slade y Prinsloo (2013), Jones (2019) y Cerratto Pargman y McGrath (2021) establecen principios de consentimiento, minimización, pseudonimización y agencia. | Exigen una matriz formal de gobernanza variable por variable, sanitización de PII antes de usar IA externa y prohibición de etiquetado público de riesgo. |

## 5. METODOLOGÍA A UTILIZAR

La investigación será aplicada, de alcance exploratorio y orientada al diseño y construcción de software. Integrará información cuantitativa descriptiva y cualitativa. La evaluación tendrá dos momentos: una sesión inicial para revisar funcionamiento, navegación y comprensión, y una prueba longitudinal de diez semanas para observar adherencia, continuidad, cumplimiento de misiones, uso del modo recuperación, utilidad percibida, pertinencia de recomendaciones y posibles efectos no deseados. La finalidad será formativa; no se pretende demostrar efectividad causal sobre deserción, rendimiento o permanencia (Creswell & Creswell, 2018; Creswell & Plano Clark, 2018).

Para el desarrollo del prototipo se empleará Scrum adaptado a un proyecto académico individual (Schwaber & Sutherland, 2020). El trabajo se organizará en un Product Backlog priorizado y en sprints de dos a tres semanas, cada uno con planificación, construcción de un incremento, revisión con el director y retrospectiva. La investigadora asumirá las actividades de análisis, diseño y desarrollo; el director apoyará la priorización y revisión académica, y los usuarios finales aportarán retroalimentación durante la validación. Esta adaptación conserva el carácter iterativo de Scrum sin presentar el proyecto como un equipo empresarial completo.

La población objetivo estará compuesta por estudiantes de programas de ingeniería de la Facultad de Minas de la Universidad Nacional de Colombia, sede Medellín, preferiblemente entre primero y cuarto semestre. La muestra será pequeña, no probabilística y por conveniencia, estimada entre 5 y 10 estudiantes voluntarios de uno o varios programas de ingeniería que acepten participar mediante consentimiento informado. El tamaño permitirá una evaluación formativa y longitudinal del prototipo, pero no generalizar resultados ni establecer comparaciones estadísticas entre programas.

### 5.1. Fases metodológicas

| Fase | Descripción | Producto esperado |
| --- | --- | --- |
| Fase 1. Revisión sistemática PRISMA V5 y antecedentes (OE1) | Consolidar la revisión sistemática definitiva en Scopus, IEEE Xplore y ERIC (ventana 2014–2026, 8 familias temáticas, 24 ejecuciones) con auditoría en prisma-review-app (6.573 identificados, 5.333 únicos, 249 buscados, 72 recuperados, 63 revisados, 57 estudios empíricos primarios). | Capítulo de revisión sistemática actualizado a V5, figuras PRISMA actualizadas, síntesis de 57 estudios empíricos y brechas de diseño. |
| Fase 2. Contexto institucional, requisitos y gobernanza de datos (OE1) | Especificar requisitos funcionales, no funcionales, éticos y la matriz formal de Gobernanza de Datos por variable, priorizando carga académica percibida y dificultad de organización sobre variables clínicas, e incorporando la dimensión contextual de valor percibido de la Universidad. | Especificación maestra de requisitos, matriz de Gobernanza de Datos y modelo de roles (STUDENT, PROFESSOR/RESOURCE_CONTRIBUTOR, FACILITATOR, ADMIN, RESEARCHER). |
| Fase 3. Diseño de arquitectura híbrida e ingesta multifuente (OE2) | Diseñar el catálogo estructurado y versionado de recursos (DRAFT a PUBLISHED), los conectores InstitutionalWebCollector (lista blanca) e InstitutionalMailConnector (con sanitización de PII), el registro manual por profesores/administradores y la separación entre motor determinista (reglas + scoring) y componente instrumental LLM. | Arquitectura C4/ADR, esquema de base de datos y eventos, contratos JSON Schema para extracción y explicación con LLM, y catálogo inicial de misiones y recursos. |
| Fase 4. Desarrollo iterativo del prototipo mediante Scrum (OE3) | Implementar el prototipo Vivu en sprints controlados: identidad y RBAC, consentimiento y perfil no clínico, misiones y modo recuperación, catálogo e ingesta/moderación de recursos, recomendador híbrido + LLM con fallback, telemetría pseudonimizada y paneles de facilitador/administrador. | Prototipo funcional incremental con pruebas automatizadas, bitácora de sprints y trazabilidad completa de recomendaciones. |
| Fase 5. Verificación técnica, de calidad de software y de salvaguardas LLM (OE3/OE4) | Verificar cumplimiento funcional, calidad de software (ISO/IEC 25010), métricas base de QoS (latencia, errores, fallback), groundedness del LLM (cero recursos inventados, cumplimiento de JSON Schema) y protección de privacidad antes del piloto. | Reporte de verificación técnica, pruebas de contrato y validación del catálogo institucional verificado. |
| Fase 6. Prueba piloto longitudinal de 10 semanas con usuarios finales (OE4) | Ejecutar sesión inicial de usabilidad y seguimiento longitudinal de diez semanas (70 días) con 5 a 10 estudiantes de ingeniería de la Facultad de Minas, recolectando telemetría pseudonimizada, microcuestionarios semanales, cuestionario final y entrevista. | Dataset pseudonimizado del piloto y registros longitudinales de uso, recomendaciones, QoE, QoS y calidad del componente LLM. |
| Fase 7. Análisis integrado y documento final de tesis (OE4) | Analizar descriptiva y cualitativamente los KPIs de uso/continuidad, KPIs de recomendaciones y conversión a recursos, QoE (ISO 9241-11/210), QoS, desempeño instrumental del LLM y efectos no deseados, contrastando con el corpus PRISMA V5. | Informe final de validación exploratoria, discusión, limitaciones, conclusiones y trabajo futuro. |

### 5.2. Estrategia propuesta

La estrategia se ubica por encima del software y se compone de cinco capas. Esta estructura permite diferenciar el aporte conceptual de su materialización en el prototipo funcional.

| Capa | Propósito | Componentes y reglas operativas |
| --- | --- | --- |
| 1. Contexto mínimo y autorizado (No clínico) | Identificar necesidades académicas de autorregulación bajo minimización de datos y consentimiento granular. | Programa de ingeniería, semestre, carga académica percibida, dificultad percibida de organización y manejo del tiempo, asignaturas de dificultad, disponibilidad horaria y valoración contextual sobre el sentido de continuar en la Universidad. |
| 2. Catálogo institucional multifuente y moderado | Mantener recursos universitarios reales, vigentes, verificados y con trazabilidad de procedencia (provenance y resource_versions). | Ingesta vía InstitutionalWebCollector (lista blanca UNAL/Facultad de Minas), InstitutionalMailConnector (con sanitización previa de PII) y registro directo por PROFESORES (RESOURCE_CONTRIBUTOR) y ADMINISTRADORES, con flujo DRAFT -> PENDING_REVIEW / NEEDS_REVIEW -> APPROVED -> PUBLISHED y detección de duplicados. |
| 3. Ludificación adaptativa y modo recuperación | Estructurar acciones de autorregulación mediante progreso visible y baja presión, evitando rankings competitivos o castigos. | Misiones semanales breves (planificación, estudio, monitorías, integración, orientación), retroalimentación formativa, metas mínimas viables y activación automática o voluntaria del modo recuperación. |
| 4. Recomendación híbrida (Reglas + Scoring + LLM instrumental) | Separar la selección determinista de candidatos de la explicación contextualizada generada por el modelo de lenguaje. | Motor de reglas + scoring sencillo (afinidad temática + semestre + programa + necesidad + disponibilidad + vigencia + horario + preferencias) sobre recursos PUBLISHED; LLM restringido a explicar la sugerencia sin inventar recursos ni diagnosticar; controles de agencia (ACEPTAR, RECHAZAR, POSPONER, EDITAR, NO QUIERO RECOMENDACIONES COMO ESTA). |
| 5. Evaluación multidimensional (Continuidad, Pertinencia, QoE, QoS y LLM) | Observar de forma exploratoria y longitudinal (10 semanas) el comportamiento del sistema y la experiencia estudiantil. | Telemetría pseudonimizada (16 tipos de eventos canónicos), KPIs de uso/continuidad, KPIs de recomendaciones y conversión a recursos, QoE (ISO 9241-11 / ISO 9241-210), QoS (latencia P50/P95, disponibilidad, fallback rate) y calidad del componente LLM (groundedness, cero alucinaciones, fidelidad de extracción y cumplimiento de schema). |

### 5.3. Componentes funcionales del prototipo

El prototipo funcional Vivu se implementa como una aplicación web progresiva (PWA local-first) respaldada por una arquitectura modular de servicios que materializa la estrategia híbrida. En primer lugar, define un modelo explícito de roles y permisos: (1) STUDENT (configurar perfil mínimo, consultar/aceptar/rechazar/posponer/editar/completar misiones, consultar progreso, activar modo recuperación, recibir recomendaciones explicables, abrir recursos, reportar utilidad o desactualización de un recurso e informar problemas; sin acceso a datos de otros estudiantes ni publicación de recursos oficiales); (2) PROFESSOR / RESOURCE_CONTRIBUTOR (crear y editar sus propios recursos académicos o de apoyo, definir destinatarios, vigencia, horarios, enlaces, ubicación y contacto institucional, enviarlos a revisión/publicación y desactivarlos cuando pierdan vigencia, contemplando extensibilidad arquitectónica futura hacia un nivel TRUSTED_CONTRIBUTOR); (3) ADMINISTRATOR (crear, editar, aprobar, rechazar, publicar, despublicar, archivar y marcar como vencidos los recursos; gestionar categorías, fuentes en lista blanca y remitentes autorizados; revisar extracciones automáticas; fusionar duplicados; y administrar colaboradores); (4) FACILITATOR (acompañamiento humano autorizado); y opcionalmente (5) RESEARCHER (consulta y exportación de analítica pseudonimizada separada de la administración operativa).

En segundo lugar, para que el catálogo de recursos institucionales no dependa de una única fuente estática, el sistema incorpora un pipeline multifuente de ingesta, normalización, extracción estructurada con LLM (validada por JSON Schema), detección de duplicados, moderación, versionamiento (resource_versions) y trazabilidad de procedencia (provenance). Las fuentes soportadas (source_type) son: WEB_OFFICIAL mediante el componente InstitutionalWebCollector (que opera exclusivamente sobre una lista blanca de páginas públicas oficiales de la UNAL, Facultad de Minas, Sede Medellín, Bienestar, monitorías, tutorías, biblioteca, programas curriculares y Minas Contigo, sin evadir autenticación, respetando frecuencias de consulta y registrando URL, fetched_at, last_verified_at, errores y duplicados); MAIL_AUTHORIZED mediante el componente InstitutionalMailConnector (conectado por API oficial o IMAP autorizado a una carpeta dedicada como "Recursos plataforma", buzón dedicado, remitentes autorizados o reenvío manual —nunca mediante scraping general del buzón— y aplicando sanitización obligatoria de PII antes de invocar al LLM); y registro manual directo (MANUAL_PROFESSOR, MANUAL_ADMIN, MANUAL_RESEARCHER, OTHER_AUTHORIZED). Todo recurso gestiona su ciclo de vida mediante estados formales (DRAFT, PENDING_REVIEW, NEEDS_REVIEW, APPROVED, PUBLISHED, REJECTED, EXPIRED, ARCHIVED) y una jerarquía configurable de fuente prioritaria (1. actualización manual por responsable autorizado; 2. página institucional oficial; 3. comunicación institucional; 4. extracción automática pendiente de verificar). Ningún recurso sin resource_id válido o sin estado PUBLISHED/ACTIVE puede ser recomendado al estudiante.

### 5.4. Indicadores (KPIs de uso, recomendaciones, QoE, QoS y calidad LLM), telemetría e instrumentos

| Dimensión / Categoría | Indicadores y métricas formales definidos | Fuente de datos e instrumento |
| --- | --- | --- |
| KPIs de uso y continuidad (Punto 8) | Adherencia semanal; Retención de uso en semanas 1, 4 y 10; Misiones mostradas (MISSION_SHOWN); Misiones aceptadas (MISSION_ACCEPTED); Misiones completadas (MISSION_COMPLETED); Tasa de finalización (completadas/aceptadas); Retorno después de interrupción; Uso del modo recuperación (RECOVERY_MODE_ACTIVATED); Continuidad de acciones de autorregulación. | Telemetría pseudonimizada del prototipo (SESSION_STARTED, SESSION_ENDED, eventos de misión) y microcuestionarios semanales. |
| KPIs de recomendaciones y recursos (Punto 9) | Tasa de aceptación (recomendaciones aceptadas / mostradas); Tasa de rechazo (rechazadas / mostradas); Tasa de posposición; Tasa de edición; Pertinencia percibida; Utilidad percibida; Conversión a recurso institucional (RESOURCE_OPENED / RECOMMENDATION_ACCEPTED); Uso reportado del recurso (RESOURCE_REPORTED_USED) sin invadir privacidad. | Eventos RECOMMENDATION_SHOWN, RECOMMENDATION_ACCEPTED, RECOMMENDATION_REJECTED, RESOURCE_OPENED, RESOURCE_REPORTED_USED, microcuestionarios y entrevista. |
| Quality of Experience — QoE (Punto 10; ISO 9241-11 / ISO 9241-210) | Facilidad de uso; Claridad; Esfuerzo percibido; Satisfacción; Utilidad; Pertinencia; Confianza; Autonomía y agencia percibida; Comprensión de explicaciones; y monitoreo explícito de efectos no deseados: Frustración, Presión, Saturación, Vigilancia percibida e Intención de continuidad. | Sesión inicial de usabilidad (guion de tareas), microcuestionarios semanales, cuestionario final y guía de entrevista semiestructurada. |
| Quality of Service — QoS (Punto 11) | Latency P50 (ms); Latency P95 (ms); Error Rate general; Timeout Rate; Disponibilidad del prototipo durante el piloto; LLM Error Rate; Fallback Rate (proporción de respuestas servidas por plantilla determinista ante fallo/timeout del LLM); Tiempo de actualización y publicación de recursos en el catálogo. | Telemetría técnica (latency_ms, status, LLM_REQUESTED, LLM_FALLBACK, ERROR_OCCURRED) y registros de auditoría del catálogo. |
| Calidad del componente LLM (Punto 12) | Groundedness (anclaje estricto a resource_id con estado PUBLISHED); Tasa de alucinaciones (meta: 0 recursos, horarios o contactos inventados); Recomendaciones inválidas bloqueadas; Fidelidad de extracción desde web/correo; Claridad; Pertinencia; Trazabilidad completa (rule_version, prompt_version, model_version); Cumplimiento del JSON Schema de salida. | Validador automático de JSON Schema, registros de trazabilidad de recomendaciones y auditoría muestral de salidas de extracción y explicación. |
| Dimensión contextual: valor percibido de la Universidad (Punto 7) | Valor percibido de continuar los estudios; Utilidad percibida de la formación; Sentido de pertenencia; Intención de continuidad; Expectativas académicas; Percepción de apoyo institucional; e ítem abierto: "¿Qué factores hacen que continuar en la Universidad tenga más o menos sentido para usted actualmente?". | Cuestionario inicial, cuestionario final y guía de entrevista semiestructurada. |
| Esquema de telemetría pseudonimizada (Punto 13) | Campos: event_id, participant_id_pseudonym, timestamp, session_id, event_type, mission_id, recommendation_id, resource_id, action, status, latency_ms, model_version, prompt_version. Eventos canónicos: SESSION_STARTED, MISSION_SHOWN, MISSION_ACCEPTED, MISSION_REJECTED, MISSION_COMPLETED, MISSION_POSTPONED, RECOVERY_MODE_ACTIVATED, RECOMMENDATION_SHOWN, RECOMMENDATION_ACCEPTED, RECOMMENDATION_REJECTED, RESOURCE_OPENED, RESOURCE_REPORTED_USED, LLM_REQUESTED, LLM_FALLBACK, ERROR_OCCURRED, SESSION_ENDED. | Servicio de analítica pseudonimizada y cola local de sincronización del prototipo. |

### 5.5. Duración del estudio

La construcción del prototipo se distribuirá en sprints a lo largo del cronograma. La validación con usuarios finales tendrá una duración longitudinal de diez semanas, equivalentes a 70 días. Cada participante realizará una sesión inicial de aproximadamente 45 a 60 minutos para conocer el prototipo, completar tareas representativas y configurar su perfil; posteriormente utilizará las funciones previstas en condiciones de uso regular, con microcuestionarios breves y seguimiento semanal.

| Momento | Duración | Propósito |
| --- | --- | --- |
| Preparación y pruebas técnicas | 2 a 3 semanas | Definir instrumentos, consentimiento, datos de prueba, criterios de observación y corregir fallos críticos. |
| Sesión inicial por participante | 45 a 60 minutos | Explicar el estudio, obtener consentimiento, configurar el perfil y recorrer tareas representativas. |
| Seguimiento longitudinal | 10 semanas (70 días) | Usar misiones, progreso, modo recuperación y recomendaciones en condiciones de uso regular. |
| Seguimiento semanal | 5 a 10 minutos por semana | Registrar utilidad, pertinencia, carga percibida, dificultades y continuidad de las acciones. |
| Cierre por participante | 30 a 45 minutos | Aplicar cuestionario final y entrevista sobre experiencia, efectos no deseados e intención de continuidad. |
| Análisis y ajustes | 2 a 3 semanas | Anonimizar y analizar registros, contrastar hallazgos y priorizar ajustes en el Product Backlog. |

La duración de diez semanas se eligió porque se aproxima al promedio de 66 días reportado por Lally et al. (2010) para el desarrollo progresivo de automaticidad. No obstante, el rango observado por ese estudio fue de 18 a 254 días y las conductas analizadas no correspondían al contexto académico. Por ello, la tesis hablará de repetición, adherencia, continuidad conductual y señales iniciales de formación de hábitos, sin afirmar que el prototipo consolida hábitos en todos los participantes.

### 5.6. Consideraciones éticas

La investigación aplica una estrategia formal de Gobernanza de Datos (Data Governance) alineada con Privacy by Design (Cavoukian, 2011) y con la normativa institucional. Por cada variable tratada en el estudio se documenta su nombre, finalidad, necesidad, fuente, nivel de sensibilidad, autorización requerida, tiempo de retención, control de acceso por rol, regla de pseudonimización (participant_id_pseudonym), política explícita sobre envío o no envío a proveedores externos de IA y mecanismo de eliminación. Se excluyen por defecto calificaciones, historia académica, documento de identidad, diagnósticos médicos o psicológicos, correos personales e información disciplinaria. Asimismo, se reemplaza la captura de variables clínicas de estrés o salud mental por indicadores académicos de autorregulación: carga académica percibida y dificultad percibida de organización y manejo del tiempo.

En el procesamiento de comunicaciones institucionales y en la generación de explicaciones asistidas por LLM se aplican tres candados éticos y técnicos: (1) sanitización previa de datos personales en correos (eliminando nombres privados, documentos, teléfonos, firmas e hilos antes de cualquier llamada al LLM); (2) prohibición absoluta de recursos inventados (toda recomendación exige un resource_id existente en el catálogo con estado PUBLISHED/ACTIVE y registra trazabilidad completa con recommendation_id, participant_id_pseudonym, resource_id, mission_id, reason_code, rule_version, prompt_version, model_version, shown_at y student_action); y (3) preservación de la agencia y no estigmatización (el estudiante nunca recibe etiquetas de "alto riesgo" y dispone siempre de las acciones ACEPTAR, RECHAZAR, POSPONER, EDITAR y "NO QUIERO RECOMENDACIONES COMO ESTA").

## 6. ALCANCES DEL TRABAJO

De acuerdo con el formato institucional, los alcances se concretan en resultados directos verificables y en los medios que permitirán comprobar su logro. La tabla siguiente resume esa relación; los numerales posteriores delimitan el alcance conceptual, metodológico, tecnológico y de datos.

| Resultado directo verificable | Características principales | Medio de verificación |
| --- | --- | --- |
| 1. Especificación de requisitos, arquitectura híbrida y Gobernanza de Datos (OE1, OE2) | Requisitos derivados de PRISMA V5 (57 estudios empíricos); matriz formal de Gobernanza de Datos variable por variable; diseño de arquitectura híbrida (reglas + scoring + LLM instrumental) y pipeline multifuente de recursos. | Documento de especificación maestra, ADRs, matriz de Gobernanza de Datos y Product Backlog revisado con la dirección. |
| 2. Prototipo funcional Vivu con ingesta multifuente y moderación (OE2, OE3) | Roles diferenciados (STUDENT, PROFESSOR/RESOURCE_CONTRIBUTOR, FACILITATOR, ADMIN, RESEARCHER); InstitutionalWebCollector (whitelist), InstitutionalMailConnector (con sanitización de PII) y carga manual con flujo DRAFT a PUBLISHED y versionamiento; misiones, modo recuperación y recomendador explicable. | Repositorio de código, pruebas automatizadas, bitácora de sprints, contratos JSON Schema y demostración funcional. |
| 3. Prueba piloto longitudinal de 10 semanas con usuarios finales (OE4) | Sesión inicial de usabilidad y seguimiento durante 10 semanas (70 días) con 5 a 10 estudiantes de ingeniería de la Facultad de Minas bajo consentimiento informado. | Consentimientos firmados, guion de tareas, base de telemetría pseudonimizada, microcuestionarios semanales, cuestionario final y entrevistas. |
| 4. Evaluación multidimensional del prototipo y del componente LLM (OE4) | Análisis de KPIs de uso y continuidad, KPIs de recomendaciones y conversión a recursos institucionales, QoE (ISO 9241-11/210), QoS (latencia P50/P95, disponibilidad, fallback rate), calidad del LLM (groundedness, fidelidad de extracción, schema compliance) y dimensión contextual de valor universitario. | Informe de evaluación formativa y longitudinal, tablas de indicadores y lista priorizada de mejoras. |
| 5. Documento final de tesis de maestría | Integración coherente de la revisión sistemática PRISMA V5, el diseño e implementación del prototipo, los resultados del piloto longitudinal, la discusión y las conclusiones. | Documento final aprobado por el director y sustentación pública ante jurados. |

### 6.1. Alcance conceptual

El alcance conceptual comprende el diseño, la implementación y la evaluación exploratoria de un prototipo funcional de sistema de ludificación adaptativa asistido por un modelo de lenguaje de gran escala (LLM) para apoyar acciones de aprendizaje autorregulado y el uso de recursos institucionales en estudiantes de ingeniería de la Facultad de Minas (Universidad Nacional de Colombia, Sede Medellín). El sistema articula misiones adaptativas, progreso no punitivo, modo recuperación y recomendaciones explicables sobre un catálogo institucional multifuente, empleando el LLM como componente estrictamente instrumental para estructuración de recursos y redacción contextualizada, sin convertirse en un proyecto de predicción de deserción ni de entrenamiento de modelos propios de Machine Learning.

### 6.2. Alcance metodológico

El alcance metodológico corresponde a una investigación aplicada, exploratoria y formativa con desarrollo iterativo mediante Scrum adaptado y validación longitudinal de diez semanas (70 días) con una muestra no probabilística por conveniencia de 5 a 10 estudiantes de ingeniería de la Facultad de Minas. Integra una sesión inicial de usabilidad, seguimiento semanal mediante telemetría pseudonimizada y microcuestionarios, y cierre mixto (cuestionario final y entrevista semiestructurada), evaluando calidad de software, calidad de experiencia (QoE según ISO 9241-11 e ISO 9241-210), calidad de servicio (QoS), calidad instrumental del componente LLM, continuidad de uso, pertinencia de las recomendaciones y dimensión contextual sobre el valor percibido de continuar en la Universidad.

### 6.3. Alcance tecnológico

El alcance tecnológico abarca el prototipo funcional de alcance controlado (PWA local-first y servicios modulares) que implementa autenticación y control de acceso por roles (STUDENT, PROFESSOR/RESOURCE_CONTRIBUTOR, FACILITATOR, ADMINISTRATOR y opcionalmente RESEARCHER), perfil mínimo y preferencias de personalización, catálogo estructurado y versionado de recursos institucionales con flujo de moderación (DRAFT a PUBLISHED) e ingesta multifuente (InstitutionalWebCollector con lista blanca, InstitutionalMailConnector con sanitización de PII y carga manual), motor híbrido de recomendación (reglas deterministas + scoring sencillo + explicación asistida por LLM con fallback determinista) y registro de eventos de telemetría pseudonimizada.

### 6.4. Alcance de datos

El alcance de datos se rige por la matriz formal de Gobernanza de Datos y se restringe a datos mínimos, autorizados y no clínicos: programa curricular, semestre, carga académica percibida, dificultad percibida de organización y manejo del tiempo, asignaturas de dificultad, disponibilidad horaria, preferencias de acompañamiento, valoración contextual sobre el sentido de continuar en la Universidad, telemetría pseudonimizada de interacción (event_id, participant_id_pseudonym, session_id, event_type, mission_id, recommendation_id, resource_id, action, status, latency_ms, model_version, prompt_version) y metadatos verificados de recursos institucionales. No se recolectan calificaciones, historias académicas, datos clínicos o médicos, documentos de identidad ni correos privados.

### 6.5. Limitaciones

• La muestra será pequeña, no probabilística y por conveniencia; por tanto, los resultados no podrán generalizarse a todos los estudiantes de ingeniería de la Facultad de Minas.

• El seguimiento de diez semanas permitirá observar repetición y continuidad, pero no garantizará hábitos consolidados para todos los participantes, debido a la variabilidad de 18 a 254 días reportada en la literatura.

• La convocatoria se dirigirá a estudiantes de distintos programas de ingeniería; sin embargo, la participación efectiva podría concentrarse en uno o varios programas según disponibilidad.

• La valoración de autorregulación, utilidad de los recursos y pertinencia de las recomendaciones dependerá parcialmente de la percepción y el autorreporte de los usuarios.

• El prototipo tendrá alcance controlado y no será una plataforma de producción ni un servicio institucional definitivo de la Facultad de Minas.

• El componente de inteligencia artificial será instrumental; no se validará un modelo propio avanzado, no se compararán arquitecturas algorítmicas y no se automatizarán decisiones académicas.

• Los resultados podrán verse afectados por el calendario académico, semanas de parciales, carga de cursos, experiencia digital, disponibilidad y continuidad de participación de los estudiantes.

• Las recomendaciones dependerán de la calidad, pertinencia y actualización de las fuentes institucionales autorizadas de la Facultad de Minas.

• El estudio no utilizará datos sensibles ni información académica restringida sin autorización formal, lo que limita el nivel de personalización y análisis posible.

• Los hallazgos cualitativos y los reportes de presión, frustración, saturación o percepción de vigilancia dependerán de la disposición de los participantes para comunicar su experiencia.

Esta investigación no pretende demostrar reducción de la deserción, permanencia hasta graduación ni formación garantizada de hábitos. Tampoco busca desarrollar una plataforma institucional definitiva ni validar un modelo avanzado de inteligencia artificial. Su aporte se concentra en el diseño e implementación de un prototipo funcional contextualizado en la Facultad de Minas y en su validación formativa y longitudinal con una muestra pequeña de estudiantes de ingeniería.

### 6.6. Productos esperados

• Revisión sistemática de literatura documentada bajo directrices PRISMA 2020 (Versión Final V5), ejecutada en Scopus, IEEE Xplore y ERIC para el periodo 2014–2026 mediante 8 familias temáticas (24 búsquedas formales), con trazabilidad en prisma-review-app, separación del horizonte exploratorio (149.985 registros brutos / 58.856 canónicos) y síntesis de 57 estudios empíricos primarios.

• Requisitos conceptuales, funcionales, no funcionales y éticos derivados de la revisión y del contexto institucional de la Facultad de Minas.

• Diseño de la arquitectura híbrida de ludificación adaptativa asistida por LLM, incluyendo motor determinista de reglas y scoring sencillo, pipeline multifuente de ingesta y moderación de recursos (InstitutionalWebCollector, InstitutionalMailConnector y registro por profesores/administradores) y esquema de versionamiento y procedencia.

• Catálogo de misiones académicas, de autorregulación, bienestar, integración institucional, orientación vocacional y modo recuperación, vinculadas con recursos autorizados de la Facultad de Minas.

• Estrategia formal de Gobernanza de Datos (Data Governance por variable), reglas de explicabilidad no estigmatizante, controles de agencia estudiantil (aceptar, posponer, editar, rechazar, silenciar tipo de recomendación) y protocolo de validación de groundedness y ausencia de recursos inventados en el componente LLM.

• Product Backlog, criterios de aceptación, bitácora de sprints, reportes de revisión y lineamientos éticos para el tratamiento de datos.

• Prototipo funcional de alcance controlado para estudiantes de ingeniería de la Facultad de Minas.

• Instrumentos de validación: guión de tareas iniciales, lista de observación, cuestionario de inicio, microcuestionarios semanales, cuestionario final, guía de entrevista y consentimiento informado.

• Base de telemetría pseudonimizada y registros longitudinales de diez semanas sobre KPIs de uso y continuidad, KPIs de recomendaciones y conversión a recursos institucionales, métricas de QoE (ISO 9241-11/210), métricas de QoS (latencia P50/P95, tasa de error, timeout, disponibilidad, tasa de fallback) y métricas de calidad del componente LLM.

• Informe de validación formativa y longitudinal con hallazgos de funcionamiento, usabilidad, continuidad, utilidad, pertinencia, posibles efectos no deseados, ajustes realizados y trabajo futuro.

## 7. PLAN DE TEMAS Y CRONOGRAMA

El cronograma se presenta con actividades pendientes y segmentadas para evitar incluir como tareas principales aquellas fases ya avanzadas en la construcción de la propuesta. La revisión sistemática se mantiene como consolidación y documentación final, no como inicio desde cero. La prueba longitudinal de diez semanas se ubicará entre los meses 6 y 8, después de las pruebas técnicas y los ajustes críticos del prototipo.

| Actividad pendiente | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Depuración final de matriz PRISMA, resultados y antecedentes | X | X |  |  |  |  |  |  |
| Ajuste del título, problema, preguntas y marco teórico | X | X |  |  |  |  |  |  |
| Levantamiento de requisitos y construcción del Product Backlog | X | X | X |  |  |  |  |  |
| Diseño de la estrategia, misiones y reglas de adaptación |  | X | X |  |  |  |  |  |
| Diseño de instrumentos y consentimiento informado |  | X | X |  |  |  |  |  |
| Diseño de arquitectura e interfaces del prototipo |  |  | X | X |  |  |  |  |
| Desarrollo iterativo del prototipo mediante sprints |  |  | X | X | X |  |  |  |
| Pruebas técnicas y revisiones de sprint |  |  |  | X | X |  |  |  |
| Ajustes del prototipo y de los instrumentos |  |  |  |  | X |  |  |  |
| Convocatoria y selección de estudiantes de ingeniería de la Facultad de Minas |  |  |  |  | X | X |  |  |
| Prueba longitudinal pequeña con usuarios finales (10 semanas) |  |  |  |  |  | X | X | X |
| Procesamiento y anonimización de datos |  |  |  |  |  |  |  | X |
| Análisis descriptivo y cualitativo de los hallazgos |  |  |  |  |  |  |  | X |
| Redacción de resultados, discusión, limitaciones y conclusiones |  |  |  |  |  |  |  | X |
| Revisión final con dirección y preparación de sustentación |  |  |  |  |  |  |  | X |

### 7.1. Plan de temas del documento final

1. Introducción, motivación y contexto institucional.

2. Planteamiento del problema y preguntas de investigación.

3. Marco teórico: antecedentes de permanencia y autorregulación en ingeniería, contexto de la Facultad de Minas, prototipo funcional, ludificación, inteligencia artificial, hábitos, personalización y ética.

4. Revisión sistemática de literatura y antecedentes.

5. Diseño de la estrategia de ludificación con inteligencia artificial y recursos institucionales.

6. Diseño e implementación del prototipo funcional mediante Scrum adaptado.

7. Metodología de prueba longitudinal pequeña con usuarios finales y análisis de indicadores.

8. Resultados de validación: funcionamiento, usabilidad, adherencia, continuidad, utilidad, pertinencia y efectos no deseados.

9. Discusión, limitaciones, conclusiones y trabajo futuro.

## 8. BIBLIOGRAFÍA Y FUENTES DE INFORMACIÓN

Arnold, K. E., & Pistilli, M. D. (2012). Course signals at Purdue: Using learning analytics to increase student success. Proceedings of the 2nd International Conference on Learning Analytics and Knowledge, 267-270. https://doi.org/10.1145/2330601.2330666

Barata, G., Gama, S., Jorge, J., & Gonçalves, D. (2013). Improving participation and learning with gamification. Proceedings of the First International Conference on Gameful Design, Research, and Applications, 10-17. https://doi.org/10.1145/2583008.2583010

Bergdahl, N., Bond, M., Sjöberg, J., Dougherty, M., & Oxley, E. (2024). Unpacking student engagement in higher education learning analytics: A systematic review. International Journal of Educational Technology in Higher Education, 21, Article 63. https://doi.org/10.1186/s41239-024-00493-y

Bulut, A., & Ulusoy, F. (2026). Artificial intelligence in gamification: A systematic review. Entertainment Computing. Advance online publication. https://doi.org/10.1016/j.entcom.2026.101112

Cavoukian, A. (2011). Privacy by Design: The 7 foundational principles. Information and Privacy Commissioner of Ontario.

Cerratto Pargman, T., & McGrath, C. (2021). Mapping the ethics of learning analytics in higher education: A systematic literature review of empirical research. Journal of Learning Analytics, 8(2). https://doi.org/10.18608/jla.2021.1

Credé, M., & Kuncel, N. R. (2008). Study habits, skills, and attitudes: The third pillar supporting collegiate academic performance. Perspectives on Psychological Science, 3(6), 425-453. https://doi.org/10.1111/j.1745-6924.2008.00089.x

Creswell, J. W., & Creswell, J. D. (2018). Research design: Qualitative, quantitative, and mixed methods approaches (5th ed.). SAGE.

Creswell, J. W., & Plano Clark, V. L. (2018). Designing and conducting mixed methods research (3rd ed.). SAGE.

Cross Arroyave, Y. (2024). Análisis de los factores asociados a la deserción estudiantil en la Facultad de Minas de la Universidad Nacional de Colombia [Trabajo final de maestría, Universidad Nacional de Colombia].

de Freitas, S., Gibson, D., du Plessis, C., Halloran, P., Williams, E., Ambrose, M., Dunwell, I., & Arnab, S. (2015). Foundations of dynamic learning analytics: Using university student data to increase retention. British Journal of Educational Technology, 46(6), 1175-1188. https://doi.org/10.1111/bjet.12212

Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. Psychological Bulletin, 125(6), 627-668. https://doi.org/10.1037/0033-2909.125.6.627

Denny, P. (2013). The effect of virtual achievements on student engagement. Proceedings of the SIGCHI Conference on Human Factors in Computing Systems, 763-772. https://doi.org/10.1145/2470654.2470763

Deschênes, M. (2020). Recommender systems to support learners agency in a learning context: A systematic review. International Journal of Educational Technology in Higher Education, 17, Article 50. https://doi.org/10.1186/s41239-020-00219-w

Deterding, S., Dixon, D., Khaled, R., & Nacke, L. (2011). From game design elements to gamefulness: Defining gamification. En Proceedings of the 15th International Academic MindTrek Conference: Envisioning Future Media Environments (pp. 9-15). ACM. https://doi.org/10.1145/2181037.2181040

Domínguez, A., Saenz-de-Navarrete, J., de-Marcos, L., Fernández-Sanz, L., Pagés, C., & Martínez-Herráiz, J. J. (2013). Gamifying learning experiences: Practical implications and outcomes. Computers & Education, 63, 380-392. https://doi.org/10.1016/j.compedu.2012.12.020

du Plooy, H., Casteleijn, D., & Franzsen, R. (2024). Personalized adaptive learning in higher education: A scoping review of key characteristics and impact on academic performance and engagement. Heliyon, 10(20), e38826. https://doi.org/10.1016/j.heliyon.2024.e38826

Fang, J., Ren, X., & Sotardi, V. A. (2025). Rethinking student wellbeing in higher education: A multifaceted approach to stress management. Education Sciences, 15(7), 872. https://doi.org/10.3390/educsci15070872

Gini, F., Bassanelli, S., Bonetti, F., Mogavi, R. H., Bucchiarione, A., & Marconi, A. (2025). The role and scope of gamification in education: A scientometric literature review. Acta Psychologica, 259, 105418. https://doi.org/10.1016/j.actpsy.2025.105418

Hakulinen, L., Auvinen, T., & Korhonen, A. (2015). The effect of achievement badges on students behavior: An empirical study in a university-level computer science course. International Journal of Emerging Technologies in Learning, 10(1), 18-29. https://doi.org/10.3991/ijet.v10i1.4221

Hamari, J., Koivisto, J., & Sarsa, H. (2014). Does gamification work? A literature review of empirical studies on gamification. En 2014 47th Hawaii International Conference on System Sciences (pp. 3025-3034). IEEE. https://doi.org/10.1109/HICSS.2014.377

Hariyanto, D., Kristianingsih, K., & Maharani, N. (2025). Artificial intelligence in adaptive education: A systematic review of techniques for personalized learning. Discover Education, 4, Article 186. https://doi.org/10.1007/s44217-025-00908-6

ISO 9241-11:2018. (2018). Ergonomics of human-system interaction - Part 11: Usability: Definitions and concepts. International Organization for Standardization.

ISO 9241-210:2019. (2019). Ergonomics of human-system interaction - Part 210: Human-centred design for interactive systems. International Organization for Standardization.

ISO/IEC 25010:2023. (2023). Systems and software engineering - Systems and software Quality Requirements and Evaluation (SQuaRE) - Product quality model. International Organization for Standardization.

ISO/IEC/IEEE 29148:2018. (2018). Systems and software engineering - Life cycle processes - Requirements engineering. International Organization for Standardization.

Jones, K. M. L. (2019). Learning analytics and higher education: A proposed model for establishing informed consent mechanisms to promote student privacy and autonomy. International Journal of Educational Technology in Higher Education, 16, Article 24. https://doi.org/10.1186/s41239-019-0155-0

Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J. (2010). How are habits formed: Modelling habit formation in the real world. European Journal of Social Psychology, 40(6), 998-1009. https://doi.org/10.1002/ejsp.674

Leitner, P., Khalil, M., & Ebner, M. (2017). Learning analytics in higher education: A literature review. En A. Peña-Ayala (Ed.), Learning analytics: Fundaments, applications, and trends (pp. 1-23). Springer. https://doi.org/10.1007/978-3-319-52977-6_1

Li, T., Wang, Y., Wang, H., et al. (2024). Bringing generative AI to adaptive learning in education. arXiv. https://doi.org/10.48550/arXiv.2402.14601

Ministerio de Educación Nacional. (2013). Política y estrategias para incentivar la permanencia y graduación en educación superior 2013-2014. Ministerio de Educación Nacional.

Ministerio de Educación Nacional. (2023). Estadísticas de deserción: Sistema para la Prevención de la Deserción en las Instituciones de Educación Superior. Ministerio de Educación Nacional.

Misara, R., Verma, D., Mishra, S., & Dubey, R. S. (2025). Beyond points and badges: Unveiling the impact of gamification in management studies. Acta Psychologica, 258, 105114. https://doi.org/10.1016/j.actpsy.2025.105114

Moher, D., Liberati, A., Tetzlaff, J., Altman, D. G., & The PRISMA Group. (2009). Preferred reporting items for systematic reviews and meta-analyses: The PRISMA statement. PLoS Medicine, 6(7), e1000097. https://doi.org/10.1371/journal.pmed.1000097

Nielsen, J. (1994). Usability engineering. Morgan Kaufmann.

Oliveira, M., Abelha, A., Sousa, R., & Peixoto, H. (2024). Gamification in mobile applications: Techniques, benefits and challenges. Procedia Computer Science, 251, 678-683. https://doi.org/10.1016/j.procs.2024.11.168

Page, M. J., McKenzie, J. E., Bossuyt, P. M., Boutron, I., Hoffmann, T. C., Mulrow, C. D., Shamseer, L., Tetzlaff, J. M., Akl, E. A., Brennan, S. E., Chou, R., Glanville, J., Grimshaw, J. M., Hróbjartsson, A., Lalu, M. M., Li, T., Loder, E. W., Mayo-Wilson, E., McDonald, S., ... Moher, D. (2021). The PRISMA 2020 statement: An updated guideline for reporting systematic reviews. PLoS Medicine, 18(3), e1003583. https://doi.org/10.1371/journal.pmed.1003583

Richardson, M., Abraham, C., & Bond, R. (2012). Psychological correlates of university students academic performance: A systematic review and meta-analysis. Psychological Bulletin, 138(2), 353-387. https://doi.org/10.1037/a0026838

Robbins, S. B., Lauver, K., Le, H., Davis, D., Langley, R., & Carlstrom, A. (2004). Do psychosocial and study skill factors predict college outcomes? A meta-analysis. Psychological Bulletin, 130(2), 261-288. https://doi.org/10.1037/0033-2909.130.2.261

Rodríguez, S., González-Suárez, R., Vieites, T., Piñeiro, I., & Díaz-Freire, F. M. (2022). Self-regulation and students well-being: A systematic review 2010-2020. Sustainability, 14(4), 2346. https://doi.org/10.3390/su14042346

Ryan, R. M., & Deci, E. L. (2000). Intrinsic and extrinsic motivations: Classic definitions and new directions. Contemporary Educational Psychology, 25(1), 54-67. https://doi.org/10.1006/ceps.1999.1020

Salmela-Aro, K., & Read, S. (2017). Study engagement and burnout profiles among Finnish higher education students. Burnout Research, 7, 21-28. https://doi.org/10.1016/j.burn.2017.11.001

Seminara, M. P., & Aparicio, M. T. (2018). La deserción universitaria ¿un concepto equívoco? Revisión de estudios latinoamericanos sobre conceptos alternativos. Revista de Orientación Educacional, 32, 33-61.

Schwaber, K., & Sutherland, J. (2020). The Scrum Guide: The definitive guide to Scrum: The rules of the game. Scrum Guides.

Slade, S., & Prinsloo, P. (2013). Learning analytics: Ethical issues and dilemmas. American Behavioral Scientist, 57(10), 1510-1529. https://doi.org/10.1177/0002764213479366

Strayhorn, T. L. (2012). College students sense of belonging: A key to educational success for all students. Routledge.

Tan, S. C., Hu, X., Yeo, J., & Cheong, H. (2025). Artificial intelligence-enabled adaptive learning platforms: A review. Smart Learning Environments, 12, Article 36. https://doi.org/10.1186/s40561-025-00426-1

Tinto, V. (1993). Leaving college: Rethinking the causes and cures of student attrition (2nd ed.). University of Chicago Press.

Universidad Nacional de Colombia, Facultad de Minas. (s.f.). Minas Contigo [Programa institucional de acompañamiento académico].

Urdaneta-Ponte, M. C., Mendez-Zorrilla, A., & Oleagordia-Ruiz, I. (2021). Recommendation systems for education: Systematic review. Electronics, 10(14), 1611. https://doi.org/10.3390/electronics10141611

Valda Sánchez, F., & Arteaga Rivero, C. (2015). Diseño e implementación de una estrategia de gamificación en una plataforma virtual de educación. Fides et Ratio, 9, 65-80.

Wood, W., & Neal, D. T. (2007). A new look at habits and the habit-goal interface. Psychological Review, 114(4), 843-863. https://doi.org/10.1037/0033-295X.114.4.843

Bai, S., & Liu, Y. (2026). Enhancing learning through adaptive gamification: A comparative study on behavioural patterns, computational thinking skills, and motivation. Research and Practice in Technology Enhanced Learning, 22, 001. https://doi.org/10.58459/rptel.2027.22001

Brezoaie, R.-E., Uta, B.-I., Dobre, B.-G., & Dascalu, M.-I. (2026). An explainable hybrid AI–gamification framework for adaptive e-learning systems [Preprint]. Preprints.org. https://www.preprints.org/manuscript/202608.1516

Ge, W., Sun, Y., Wang, Z., Zheng, H., He, W., Wang, P., Zhu, Q., & Wang, B. (2025). SRLAgent: Enhancing self-regulated learning skills through gamification and LLM assistance [Preprint]. arXiv. https://doi.org/10.48550/arXiv.2506.09968

Hong, Q. N., Fàbregues, S., Bartlett, G., Boardman, F., Cargo, M., Dagenais, P., Gagnon, M.-P., Griffiths, F., Nicolau, B., O’Cathain, A., Rousseau, M.-C., Vedel, I., & Pluye, P. (2018). The Mixed Methods Appraisal Tool (MMAT) version 2018 for information professionals and researchers. Education for Information, 34(4), 285–291. https://doi.org/10.3233/EFI-180221

JBI. (2026). Critical appraisal tools. Joanna Briggs Institute. https://jbi.global/critical-appraisal-tools

Li, H., Esmaeiligoujar, S., Adham, N., Li, H., & Huang, R. (2026). “I spend all my energy preparing”: Balancing AI automation and agency for self-regulated learning in SmartFlash [Preprint]. arXiv. https://doi.org/10.48550/arXiv.2602.14431

Maimaiti, G., & Hew, K. F. (2025a). Gamification bolsters self-regulated learning, learning performance and reduces strategy decline in flipped classrooms: A longitudinal quasi-experiment. Computers & Education, 230, 105278. https://doi.org/10.1016/j.compedu.2025.105278

Maimaiti, G., & Hew, K. F. (2025b). Gamified self-regulated learning improves EFL reading comprehension, motivation, self-regulation skills and process patterns: Quasi-experiment with process mining. The Internet and Higher Education, 67, 101042. https://doi.org/10.1016/j.iheduc.2025.101042

Marengo, A., Pagano, A., Lund, B., & Santamato, V. (2025). Research AI: Integrating AI and gamification in higher education for e-learning optimization and soft skills assessment through a cross-study synthesis. Frontiers in Computer Science, 7, 1587040. https://doi.org/10.3389/fcomp.2025.1587040

Shea, B. J., Reeves, B. C., Wells, G., Thuku, M., Hamel, C., Moran, J., Moher, D., Tugwell, P., Welch, V., Kristjansson, E., & Henry, D. A. (2017). AMSTAR 2: A critical appraisal tool for systematic reviews that include randomised or non-randomised studies of healthcare interventions, or both. BMJ, 358, j4008. https://doi.org/10.1136/bmj.j4008
