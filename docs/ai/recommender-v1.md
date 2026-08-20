# Especificación del recomendador V1

## Objetivo

Priorizar misiones y recursos autorizados de forma explicable y reproducible usando **hard rules + scoring determinístico + LLM controlado** online, manteniendo un motor determinístico equivalente en la PWA para operación offline.

## No objetivo

No predecir deserción con un modelo propio ni convertir el LLM en agente autónomo que decide acciones académicas.

## Input normalizado

```json
{
  "student": {
    "program": "string",
    "semester": 2,
    "perceivedLoad": "low|medium|high",
    "difficultSubjects": ["string"],
    "weeklyAvailabilityMinutes": 180,
    "studyPractices": ["string"],
    "continuityState": "stable|low|recovery",
    "optionalWellbeing": null
  },
  "recentActivity": {
    "acceptedMissionTypes": ["academic"],
    "completedMissionTypes": ["planning"],
    "recoveryActive": false
  },
  "candidateMissionIds": ["uuid"],
  "candidateResourceIds": ["uuid"],
  "configVersion": 1
}
```

No incluir email, contraseña, documento, historia académica restringida ni datos no requeridos.

## Modos de ejecución

- `ONLINE_AI`: rules + score Python + LLM controlado.
- `ONLINE_RULES`: rules + score Python + explicación determinística cuando LLM no está disponible.
- `OFFLINE_RULES`: rules + score TypeScript en PWA + explicación determinística, sin llamadas de red/LLM.

## Pipeline

1. Construir candidatos desde misiones publicadas y recursos activos.
2. Aplicar hard rules.
3. Calcular componentes de score en `[0,1]`.
4. Calcular score ponderado.
5. Ordenar y aplicar límites de diversidad/saturación.
6. Seleccionar Top-N.
7. Si LLM está habilitado y saludable, solicitar explicación/rewrite controlado.
8. Validar salida contra JSON Schema y listas de IDs permitidas.
9. Si falla, usar plantilla determinística.
10. Persistir run, componentes, versiones y fallback.

## Score baseline

```text
score =
  0.30 * need_fit
+ 0.20 * time_fit
+ 0.15 * difficulty_fit
+ 0.15 * continuity_fit
+ 0.15 * resource_fit
+ 0.05 * diversity_fit
```

Los pesos son configuración de ingeniería V1, no conclusión científica. Deben versionarse.

### need_fit
Compatibilidad entre necesidad reportada y objetivo/etiquetas de la misión.

### time_fit
Compatibilidad entre tiempo disponible y duración estimada.

### difficulty_fit
Evita recomendar acciones desproporcionadas para carga/dificultad actual.

### continuity_fit
Favorece continuidad o recuperación sin castigar interrupciones.

### resource_fit
Sube cuando la misión tiene recurso autorizado y pertinente.

### diversity_fit
Reduce repetición excesiva del mismo tipo de misión.

## Hard rules obligatorias

- misión `published` y versión válida;
- recurso `active` y vigente;
- respeto a preferencias/consentimiento;
- no exceder límite de recomendaciones simultáneas;
- recuperación -> preferir duración/esfuerzo bajo;
- no recomendar el mismo ítem ya completado si no es repetible;
- no usar recursos fuera del catálogo autorizado.

## Salida interna

```json
{
  "runId": "uuid",
  "configVersion": 1,
  "fallbackUsed": false,
  "items": [
    {
      "candidateType": "mission",
      "candidateId": "uuid",
      "score": 0.87,
      "scoreComponents": {
        "needFit": 1.0,
        "timeFit": 0.8,
        "difficultyFit": 0.9,
        "continuityFit": 0.8,
        "resourceFit": 0.7,
        "diversityFit": 0.5
      },
      "why": "Se ajusta a la dificultad que reportaste y al tiempo disponible esta semana."
    }
  ]
}
```

## Pseudocódigo

```python
def recommend(ctx, catalog, config, llm):
    candidates = build_candidates(ctx, catalog)
    eligible = [c for c in candidates if hard_rules_pass(ctx, c, config)]
    scored = [score_candidate(ctx, c, config) for c in eligible]
    top = diversify_and_limit(scored, config)
    try:
        explanation = llm.explain(ctx=minimize(ctx), items=top) if llm.enabled else None
        validated = validate_llm_output(explanation, allowed_ids={x.id for x in top})
        return persist_result(top, validated, fallback=False)
    except RecoverableLLMError:
        return persist_result(top, deterministic_explanations(top, ctx), fallback=True)
```

## Trazabilidad

Por run registrar: `configVersion`, `policyVersion`, `provider`, `model`, `promptVersion`, scores, IDs candidatos/seleccionados, timeout/fallback y timestamps. No guardar prompts completos con PII en logs generales.

## Tests mínimos

- recurso inactivo nunca se selecciona;
- modo recuperación favorece baja carga;
- score reproducible con misma entrada/config;
- IDs inventados por LLM son rechazados;
- timeout del LLM activa fallback;
- datos prohibidos no aparecen en payload hacia `LLMProvider`.


## Contrato de reglas compartido PWA/servidor

La configuración versionada del scoring es un contrato serializable consumido por Python y TypeScript. `packages/recommendation-fixtures` contiene casos canónicos con input y output esperado. CI debe ejecutar los mismos fixtures en ambos motores.

La PWA solo usa una configuración recibida del servidor y marcada como `lastKnownGood`. No modifica pesos ni inventa reglas.

## Recomendación offline

Sin conexión, el contexto se construye únicamente con datos ya sincronizados. Se aplican hard rules que puedan evaluarse localmente y se genera un ranking determinístico. El resultado se almacena con `source=OFFLINE_RULES`, `ruleVersion`, `catalogVersion`, `clientGeneratedAt` y score components.

Al volver la conexión, la recomendación histórica no se reemplaza. El backend puede generar una recomendación nueva para el contexto actual.

## Tests de paridad adicionales

- mismos fixtures -> mismo orden de candidatos Python/TypeScript;
- componentes de score equivalentes dentro de tolerancia;
- versión desconocida/inválida -> no ejecutar reglas inventadas; usar última versión válida o mostrar que se requiere sincronización;
- `OFFLINE_RULES` no invoca `LLMProvider`;
- un recurso no presente en el catálogo cacheado válido nunca se inventa.
