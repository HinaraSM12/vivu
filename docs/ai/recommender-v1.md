# Especificación de la Arquitectura Híbrida de Recomendación V1

## 1. Objetivo y Arquitectura Híbrida (Puntos 1, 3, 38 y 39)

Priorizar misiones de aprendizaje autorregulado y recursos institucionales verificados de forma explicable, trazable y reproducible mediante una **arquitectura híbrida** que separa estrictamente la decisión determinista de la redacción asistida por LLM:

```text
DATOS MÍNIMOS Y AUTORIZADOS (no clínicos)
        ↓
REGLAS DETERMINISTAS (Hard Rules)
        ↓
CATÁLOGO DE MISIONES Y RECURSOS (status = PUBLISHED / ACTIVE)
        ↓
SELECCIÓN / PRIORIZACIÓN (Rule Engine + Scoring sencillo)
        ↓
LLM INSTRUMENTAL PARA CONTEXTUALIZAR O EXPLICAR (con Fallback determinista)
        ↓
ESTUDIANTE (Agencia completa)
        ↓
ACEPTA / POSPONE / EDITA / RECHAZA / NO QUIERO RECOMENDACIONES COMO ESTA
        ↓
TELEMETRÍA PSEUDONIMIZADA
        ↓
ANÁLISIS QoE + QoS + CALIDAD LLM + CONTINUIDAD + PERTINENCIA
```

El proyecto **NO entrena un modelo predictivo de Machine Learning** con 5–10 estudiantes ni convierte al LLM en el único motor de decisión.

---

## 2. Entrada normalizada y no clínica (Puntos 43–45)

```json
{
  "student": {
    "program": "Ingeniería de Sistemas e Informática",
    "semester": 2,
    "perceivedAcademicLoad": "low|medium|high",
    "perceivedOrganizationDifficulty": "low|medium|high",
    "difficultSubjects": ["Cálculo Diferencial"],
    "weeklyAvailabilityMinutes": 180,
    "preferredTimeBlocks": ["MORNING", "AFTERNOON"],
    "studyPractices": ["pomodoro", "resumenes"],
    "continuityState": "stable|low|recovery",
    "mutedRecommendationCategories": [],
    "mutedResourceIds": []
  },
  "recentActivity": {
    "acceptedMissionTypes": ["academic"],
    "completedMissionTypes": ["planning"],
    "recoveryActive": false
  },
  "candidateMissionIds": ["uuid"],
  "candidateResourceIds": ["uuid"],
  "ruleVersion": "1.0.0"
}
```

- Nunca incluye correo, contraseña, documento de identidad, calificaciones, historia académica ni diagnósticos clínicos de estrés o salud mental.

---

## 3. Separación entre decisión (Reglas + Scoring) y redacción (LLM) (Puntos 37–40)

### 3.1. Reglas deterministas obligatorias (Hard Rules)
1. Toda misión candidata debe tener estado `PUBLISHED` y versión activa;
2. Todo recurso institucional candidato debe tener `resource_id` existente y `status = PUBLISHED` (o `ACTIVE`) y encontrarse dentro de su ventana de vigencia (`start_date` $\le$ hoy $\le$ `end_date`); **si no existe `resource_id` publicado, está prohibido recomendarlo como recurso institucional real (Punto 37)**;
3. Respeto absoluto al consentimiento activo y a las exclusiones de agencia del estudiante (`mutedRecommendationCategories`, `mutedResourceIds` de la acción `NO QUIERO RECOMENDACIONES COMO ESTA`);
4. Si el estudiante tiene activo el **Modo Recuperación** (`recoveryActive = true`) o reporta `perceivedAcademicLoad = high` con `perceivedOrganizationDifficulty = high`, se filtran misiones de alto esfuerzo y se priorizan metas mínimas viables;
5. Ejemplo canónico de regla determinista (Punto 39):
   `dificultad reportada en Cálculo` + `monitoría activa en catálogo (status = PUBLISHED)` + `horario compatible` $\rightarrow$ **recurso candidato elegible**.

### 3.2. Scoring determinista sencillo (Punto 38)
Sobre los candidatos que superan las reglas duras se calcula un puntaje transparente y reproducible en $[0, 1]$:

```text
score =
  0.25 * thematic_affinity      (afinidad temática / asignatura de dificultad)
+ 0.10 * semester_fit           (adecuación al semestre actual, priorizando 1.º a 4.º)
+ 0.10 * program_fit            (compatibilidad con el programa de ingeniería)
+ 0.20 * need_fit               (alineación con carga académica y dificultad de organización)
+ 0.10 * availability_fit       (compatibilidad con minutos semanales disponibles)
+ 0.10 * validity_freshness     (vigencia y verificación reciente del recurso)
+ 0.10 * schedule_fit           (compatibilidad con bloques horarios del estudiante)
+ 0.05 * preference_diversity   (preferencias declaradas y diversidad semanal)
```

### 3.3. Explicabilidad no estigmatizante (Punto 40)
El componente LLM (o la plantilla determinista en modo fallback/offline) redacta la explicación mostrando la razón concreta y accionable:
- **Correcto:** *"Te sugerimos esta monitoría porque reportaste dificultad en esta asignatura y actualmente existe una sesión disponible compatible con tu horario."*
- **Prohibido:** *"Te recomendamos esto porque eres un estudiante de alto riesgo de deserción."*

---

## 4. Agencia del estudiante sobre cada recomendación (Punto 41)

Toda recomendación presentada en la interfaz expone cinco acciones explícitas de agencia estudiantil:
1. `ACCEPT` (`ACEPTAR`): incorpora la misión o abre/agenda el recurso sugerido;
2. `REJECT` (`RECHAZAR`): descarta la recomendación actual;
3. `POSTPONE` (`POSPONER`): pospone la sugerencia para otro momento de la semana;
4. `EDIT` (`EDITAR`): permite ajustar meta, duración o paso mínimo de la misión sugerida;
5. `DISMISS_CATEGORY` (`NO QUIERO RECOMENDACIONES COMO ESTA`): silencia ese tipo de recomendación o recurso específico en futuras ejecuciones del motor.

---

## 5. Registro de trazabilidad de recomendaciones (Punto 42)

Cada recomendación generada y mostrada persiste un registro auditable con los campos canónicos:

```json
{
  "recommendation_id": "uuid",
  "participant_id_pseudonym": "pseudonym-uuid",
  "resource_id": "uuid-or-null",
  "mission_id": "uuid-or-null",
  "reason_code": "DIFFICULT_SUBJECT_ACTIVE_TUTORING_MATCH",
  "rule_version": "1.0.0",
  "prompt_version": "explain-rec-v1.0",
  "model_version": "gemini-2.5-flash-or-deterministic-fallback",
  "shown_at": "2026-11-10T18:00:00.000Z",
  "student_action": "ACCEPTED|REJECTED|POSTPONED|EDITED|DISMISSED_SIMILAR|PENDING"
}
```
