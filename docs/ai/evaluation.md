# Marco de Evaluación Integral del Prototipo y del Componente LLM (OE4)

## 1. Propósito de la evaluación (Puntos 4 y 5)

Evaluar de forma exploratoria y longitudinal (10 semanas / 70 días, con 5 a 10 estudiantes de ingeniería de la Facultad de Minas) el prototipo **Vivu** mediante indicadores de:
1. **Calidad de software** (ISO/IEC 25010:2023);
2. **Calidad de experiencia — QoE** (ISO 9241-11:2018 e ISO 9241-210:2019);
3. **Calidad de servicio — QoS**;
4. **Calidad instrumental del componente LLM** (evaluado como componente del sistema, no como benchmarking de modelos fundacionales);
5. **KPIs de uso y continuidad**;
6. **KPIs de recomendaciones y conversión a recursos institucionales**; y
7. **Dimensión contextual sobre interés y valor percibido de continuar en la Universidad**.

---

## 2. KPIs de Uso y Continuidad (Punto 8)

| KPI | Definición operativa y fórmula |
|---|---|
| `ADHERENCIA_SEMANAL` | Número y proporción de semanas (sobre las 10 semanas del piloto) en las que el participante registra al menos una interacción significativa (`SESSION_STARTED` con acción sobre misión, recurso o microcuestionario). |
| `RETENCION_SEMANA_1_4_10` | Proporción de participantes activos al cierre de los hitos de la Semana 1, Semana 4 y Semana 10. |
| `MISIONES_MOSTRADAS` | Conteo total y semanal de eventos `MISSION_SHOWN` por participante. |
| `MISIONES_ACEPTADAS` | Conteo total y semanal de eventos `MISSION_ACCEPTED` por participante. |
| `MISIONES_COMPLETADAS` | Conteo total y semanal de eventos `MISSION_COMPLETED` por participante. |
| `TASA_FINALIZACION_MISIONES` | $\text{Misiones completadas} / \text{Misiones aceptadas}$. |
| `RETORNO_DESPUES_INTERRUPCION` | Número de episodios en los que un participante retoma actividad tras $\ge 7$ días sin interacción. |
| `USO_MODO_RECUPERACION` | Conteo de activaciones (`RECOVERY_MODE_ACTIVATED`) y tasa de finalización de misiones mínimas viables durante semanas de recuperación. |
| `CONTINUIDAD_ACCIONES_SRL` | Repetición semanal de acciones de autorregulación (planificación, estudio, preparación de evaluaciones, búsqueda de ayuda). |

---

## 3. KPIs de Recomendaciones y Recursos Institucionales (Punto 9)

| KPI | Definición operativa y fórmula |
|---|---|
| `TASA_ACEPTACION_RECOMENDACIONES` | $\text{Recomendaciones aceptadas (`RECOMMENDATION_ACCEPTED`)} / \text{Recomendaciones mostradas (`RECOMMENDATION_SHOWN`)}$. |
| `TASA_RECHAZO_RECOMENDACIONES` | $\text{Recomendaciones rechazadas (`RECOMMENDATION_REJECTED`)} / \text{Recomendaciones mostradas (`RECOMMENDATION_SHOWN`)}$. |
| `TASA_POSPOSICION_RECOMENDACIONES` | $\text{Recomendaciones pospuestas (`action = POSTPONED`)} / \text{Recomendaciones mostradas}$. |
| `TASA_EDICION_RECOMENDACIONES` | $\text{Recomendaciones editadas (`action = EDITED`)} / \text{Recomendaciones mostradas}$. |
| `PERTINENCIA_PERCIBIDA` | Valoración en escala Likert (1–5) y cualitativa sobre qué tan adecuada fue la recomendación para el momento académico del estudiante. |
| `UTILIDAD_PERCIBIDA` | Valoración en escala Likert (1–5) y cualitativa sobre qué tan útil resultó la sugerencia para ejecutar una acción concreta. |
| `CONVERSION_A_RECURSO_INSTITUCIONAL` | $\text{Recursos abiertos (`RESOURCE_OPENED`)} / \text{Recomendaciones aceptadas (`RECOMMENDATION_ACCEPTED`)}$. |
| `USO_REPORTADO_DEL_RECURSO` | Conteo y proporción de eventos `RESOURCE_REPORTED_USED` y autorreporte voluntario en microcuestionario semanal sin invadir privacidad. |

---

## 4. Quality of Experience — QoE (Punto 10; ISO 9241-11 / ISO 9241-210)

Se evalúan catorce dimensiones de experiencia de usuario mediante observación inicial, microcuestionarios semanales, cuestionario final y entrevista semiestructurada:
- **Dimensiones facilitadoras:** (1) facilidad de uso, (2) claridad, (3) esfuerzo percibido, (4) satisfacción, (5) utilidad, (6) pertinencia, (7) confianza, (8) autonomía/agencia percibida, (9) comprensión de explicaciones y (10) intención de continuidad.
- **Dimensiones de efectos no deseados (monitoreo ético):** (11) frustración, (12) presión percibida, (13) saturación informativa y (14) vigilancia percibida.

---

## 5. Quality of Service — QoS (Punto 11)

| Métrica QoS | Definición operativa |
|---|---|
| `LATENCY_P50` | Percentil 50 de latencia de respuesta (`latency_ms`) en endpoints principales y de recomendación. |
| `LATENCY_P95` | Percentil 95 de latencia de respuesta (`latency_ms`). |
| `ERROR_RATE` | Proporción de solicitudes o eventos con `ERROR_OCCURRED` sobre el total de operaciones. |
| `TIMEOUT_RATE` | Proporción de solicitudes que exceden el umbral de tiempo configurado. |
| `DISPONIBILIDAD_PILOTO` | Porcentaje de tiempo operativo del servicio durante las 10 semanas del piloto (complementado con continuidad local-first en la PWA). |
| `LLM_ERROR_RATE` | Proporción de llamadas `LLM_REQUESTED` que fallan por error del proveedor o validación. |
| `FALLBACK_RATE` | Proporción de solicitudes de recomendación/explicación resueltas mediante el motor/plantilla determinista (`LLM_FALLBACK / LLM_REQUESTED`). |
| `TIEMPO_ACTUALIZACION_RECURSOS` | Tiempo transcurrido desde la detección o registro de un recurso (`fetched_at` / `created_at`) hasta su verificación y paso a `PUBLISHED`. |

---

## 6. Calidad del Componente LLM (Punto 12)

| Indicador del componente LLM | Definición y criterio de aceptación |
|---|---|
| `GROUNDEDNESS` | Proporción de explicaciones y resúmenes cuyos datos fácticos coinciden estrictamente con los atributos del `resource_id` / `mission_id` en el catálogo (meta: 100%). |
| `ALUCINACIONES` | Conteo de salidas con recursos, horarios, enlaces o contactos inexistentes (meta tras validador: 0). |
| `RECOMENDACIONES_INVALIDAS` | Proporción de salidas del LLM que referencian un ID fuera de `allowedPublishedResourceIds` y son bloqueadas por el validador. |
| `FIDELIDAD_EXTRACCION` | Precisión de campos extraídos por el LLM desde páginas web en lista blanca o correos institucionales sanitizados frente a la verificación del moderador humano. |
| `CLARIDAD` | Valoración estudiantil sobre la comprensibilidad del mensaje redactado con asistencia del LLM. |
| `PERTINENCIA` | Adecuación contextual de la explicación generada respecto al motivo determinista (`reason_code`). |
| `TRAZABILIDAD` | Completitud del registro (`recommendation_id`, `rule_version`, `prompt_version`, `model_version`, `resource_id`, `shown_at`, `student_action`) (meta: 100%). |
| `CUMPLIMIENTO_SCHEMA_SALIDA` | Proporción de respuestas del LLM que cumplen válidamente el JSON Schema de salida en el primer intento. |
