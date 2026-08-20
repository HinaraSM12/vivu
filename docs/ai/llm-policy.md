# Política de uso del LLM

## Principio

El LLM es un componente de lenguaje y apoyo de priorización limitada. No sustituye las reglas de elegibilidad, el motor de ludificación, el criterio del estudiante ni el acompañamiento humano.

## Permitido

- Explicar por qué se seleccionó una recomendación ya válida.
- Adaptar tono dentro de opciones autorizadas.
- Reescribir copy sin cambiar intención, dificultad ni requisitos.
- Desempatar candidatos de score muy similar si la política lo habilita.
- Resumir contexto no sensible estrictamente necesario.

## Prohibido

- Inventar misión, recurso, dependencia, horario o servicio institucional.
- Acceder directamente a bases de datos.
- Cambiar estado de misión/progreso.
- Emitir diagnósticos psicológicos, médicos o académicos.
- Etiquetar al estudiante con conclusiones definitivas de riesgo.
- Saltarse hard rules.
- Decidir sanciones, bloqueos o acciones obligatorias.
- Generar lenguaje culpabilizante, coercitivo o de vigilancia.

## Minimización antes del proveedor

El adapter construye un payload específico para la tarea. Nunca enviar el objeto completo del perfil por comodidad.

## Salida estructurada

Todas las tareas de producción usan schema estructurado. Ejemplo:

```json
{
  "items": [
    {"candidateId": "uuid", "explanation": "string", "tone": "supportive"}
  ]
}
```

Cualquier ID fuera de `allowedCandidateIds` invalida la respuesta completa o el item afectado según política.

## Versionado

Registrar:
- provider;
- model;
- promptVersion;
- policyVersion;
- schemaVersion;
- configVersion del recomendador.

## Logs

- No loggear prompts/respuestas completos por defecto.
- Logs técnicos usan runId, latencia, estado, tokens/costo si aplica y códigos de error.
- Muestras para depuración requieren entorno controlado y sanitización.

## Fallback

Ante timeout, rate limit, error de proveedor, respuesta inválida o policy violation, devolver explicación determinística basada en score y contexto permitido.

## Cambio de proveedor

La aplicación depende de `LLMProvider`, no del SDK del proveedor desde el dominio. Cambiar proveedor/modelo no debe alterar contratos públicos ni scoring.


## PWA y offline

El LLM se considera una capacidad **online**. La PWA no descarga, ejecuta ni emula un LLM local. Sin red, el estudiante recibe recomendaciones del motor determinístico TypeScript o consulta recomendaciones online previamente cacheadas. La UI no debe presentar una recomendación offline como si hubiera sido generada por IA generativa.
