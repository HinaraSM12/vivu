# Evaluación del recomendador V1

## Objetivo de evaluación

Comprobar funcionamiento, seguridad, trazabilidad, utilidad y pertinencia del recomendador dentro del prototipo. No demostrar causalidad sobre permanencia ni validar un modelo avanzado de IA.

## Métricas técnicas

| Métrica | Definición |
|---|---|
| `recommendation_success_rate` | runs que producen salida válida / runs totales. |
| `fallback_rate` | runs que usaron fallback / runs totales. |
| `invalid_llm_output_rate` | respuestas rechazadas por schema/policy / llamadas LLM. |
| `recommendation_latency_ms` | p50/p95 de generación. |
| `candidate_coverage` | candidatos elegibles considerados por run. |
| `unauthorized_resource_violations` | debe ser 0. |
| `unknown_id_violations` | debe ser 0 después de validación. |
| `offline_online_parity_rate` | proporción de fixtures con ranking equivalente Python/TypeScript; objetivo 100%. |

## Tests offline con casos sintéticos

Mantener una suite de “golden contexts”:

1. alta carga + poco tiempo -> misiones cortas;
2. dificultad reportada + recurso académico vigente -> recurso compatible;
3. recuperación activa -> metas mínimas y baja presión;
4. recurso vencido -> nunca aparece;
5. LLM caído -> misma selección base con explicación determinística;
6. mismo contexto/config -> mismo ranking determinístico;
7. mismo fixture ejecutado en Python y TypeScript -> ranking/componentes equivalentes;
8. offline -> cero llamadas a `LLMProvider`.

## Indicadores con usuarios

El estudio puede observar:
- pertinencia percibida;
- utilidad percibida;
- claridad de la explicación;
- frecuencia de aceptación/descartar recomendaciones;
- carga o saturación percibida;
- continuidad y uso del modo recuperación.

Estas métricas describen la experiencia del prototipo; no deben presentarse como prueba causal de reducción de deserción.

## Cambios de scoring

Todo cambio de pesos crea una versión nueva. Comparar resultados por versión de forma descriptiva; no sobrescribir ejecuciones previas ni cambiar retrospectivamente el score histórico.

## Gate para piloto

Antes de usar con participantes:
- 0 violaciones de recurso no autorizado en suite sintética;
- fallback probado;
- trazabilidad completa por run;
- payload al LLM inspeccionado para minimización;
- explicación comprensible revisada en prueba de usabilidad;
- suite de paridad offline/online en 100% para fixtures aprobados.
