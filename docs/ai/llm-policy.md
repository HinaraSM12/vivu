# Política de uso del LLM (Componente Instrumental)

## 1. Principio conceptual: LLM $\neq$ ML predictivo (Puntos 1, 2 y 3)

En **Vivu**, el modelo de lenguaje de gran escala (LLM) se define estrictamente como un **componente instrumental del sistema** dentro de una arquitectura híbrida.
- **No es** un clasificador predictivo de deserción ni un modelo propio de Machine Learning entrenado con datos de 5–10 estudiantes;
- **No sustituye** al motor determinista de reglas ni al sistema de puntuación (`scoring`);
- **No constituye** el único motor de decisión ni automatiza decisiones académicas sobre el estudiante.

---

## 2. Qué PUEDE hacer el LLM (Punto 2)

El LLM está autorizado únicamente para:
1. Contextualizar recomendaciones previamente seleccionadas por el motor determinista de reglas y puntuación;
2. Adaptar el tono de los mensajes dentro de opciones autorizadas (`supportive`, `clear`, `low_pressure`);
3. Explicar de forma comprensible y no estigmatizante por qué se sugiere una acción (p. ej., *"Te sugerimos esta monitoría porque reportaste dificultad en esta asignatura y actualmente existe una sesión disponible"*);
4. Redactar mensajes a partir de datos estructurados y autorizados;
5. Transformar información institucional no estructurada (procedente de `InstitutionalWebCollector` o `InstitutionalMailConnector` previamente sanitizado) en registros JSON estructurados sujetos a validación por JSON Schema;
6. Resumir convocatorias, eventos, talleres o apoyos institucionales vigentes;
7. Ayudar a presentar misiones de forma comprensible;
8. Generar alternativas controladas de redacción sin alterar requisitos ni dificultad;
9. Apoyar interacción conversacional limitada y acotada al catálogo autorizado;
10. Trabajar **únicamente** sobre misiones y recursos previamente recuperados, autorizados y con `resource_id` válido y estado `PUBLISHED` (`ACTIVE`).

---

## 3. Qué NO PUEDE hacer el LLM (Puntos 2 y 37)

El LLM tiene terminantemente prohibido:
1. Diagnosticar psicológica, médica o clínicamente al estudiante;
2. Decidir o sugerir si el estudiante debe continuar o abandonar la Universidad;
3. Tomar decisiones académicas;
4. Asignar sanciones, bloqueos o penalizaciones;
5. Crear, inferir o estimar calificaciones;
6. Acceder libremente a historias académicas o bases de datos institucionales;
7. Utilizar datos institucionales restringidos sin autorización formal;
8. **Inventar recursos institucionales** (toda recomendación de recurso exige un `resource_id` existente con `status = PUBLISHED / ACTIVE`);
9. Inventar horarios, contactos, enlaces, ubicaciones o convocatorias;
10. Etiquetar pública o internamente al estudiante como *"estudiante en alto riesgo"* o usar lenguaje culpabilizante, coercitivo o de vigilancia.

---

## 4. Sanitización y minimización antes de invocar al proveedor (Puntos 19 y 43–45)

1. **Explicación de recomendaciones:** El adaptador construye un payload mínimo sin PII (`email`, `userId`, nombre, documento). Tampoco envía variables clínicas de estrés o salud mental, sino únicamente etiquetas discretas autorizadas (`perceivedAcademicLoad`, `perceivedOrganizationDifficulty`, `difficultSubjects`, `semester`, `program`).
2. **Extracción estructurada desde correo (`InstitutionalMailConnector`):** Antes de cualquier llamada al LLM se ejecuta el sanitizador de PII que elimina nombres personales, correos privados, números de documento, firmas, teléfonos privados, cadenas de conversación y archivos privados.

---

## 5. Esquemas de salida estructurada (Puntos 12 y 36)

### 5.1. Esquema para explicación de recomendaciones
```json
{
  "items": [
    {
      "candidateId": "uuid",
      "resourceId": "uuid-or-null",
      "explanation": "Te sugerimos esta monitoría porque reportaste dificultad en esta asignatura y actualmente existe una sesión disponible.",
      "tone": "supportive"
    }
  ]
}
```
Cualquier `candidateId` o `resourceId` fuera de `allowedCandidateIds` / `allowedPublishedResourceIds` invalida la respuesta y activa el fallback determinista.

### 5.2. Esquema para extracción estructurada de recursos institucionales (Punto 36)
```json
{
  "title": "",
  "category": "",
  "target_population": "",
  "eligibility": "",
  "start_date": "",
  "end_date": "",
  "schedule": "",
  "location": "",
  "contact": "",
  "registration_url": "",
  "institution": "",
  "source": ""
}
```
Todo recurso extraído por LLM entra con estado `NEEDS_REVIEW` o `PENDING_REVIEW` y requiere validación de esquema y moderación antes de pasar a `PUBLISHED`.

---

## 6. Versionado, trazabilidad y fallback (Puntos 11, 12 y 42)

Por cada ejecución se registra:
- `recommendation_id` / `run_id`;
- `rule_version`;
- `prompt_version`;
- `model_version`;
- `latency_ms`;
- `status` (`LLM_REQUESTED`, `LLM_FALLBACK`, `ERROR_OCCURRED`).

Ante timeout, rate limit, error del proveedor, incumplimiento del JSON Schema o intento de referenciar un `resource_id` inexistente o no publicado, el sistema activa inmediatamente el **fallback determinista** basado en plantillas verificadas.

---

## 7. PWA y operación offline

El LLM es una capacidad **online**. La PWA no descarga ni ejecuta un LLM local. Sin conexión, el estudiante recibe recomendaciones del motor determinista TypeScript (`OFFLINE_RULES`) con explicación por plantilla verificada, sin presentar la salida offline como si hubiera sido redactada en vivo por IA generativa.
