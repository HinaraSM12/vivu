# Especificación Técnica — Sprint 5: Recomendador V1 Online (Híbrido Determinista + LLM Instrumental)

## 1. Objetivo del Sprint
Implementar el motor de recomendaciones híbrido online (`@vivu/recommendation-service` en Python/FastAPI, contratos en `@vivu/contracts`, rutas en `@vivu/api-gateway` y pantalla `STU-16` en `@vivu/web`), garantizando que:
1. Las reglas deterministas filtren y prioricen primero sobre el catálogo curado de misiones y recursos `PUBLISHED`.
2. El LLM actúe exclusivamente como componente instrumental de explicación/contextualización con fallback determinista (`ONLINE_RULES` / `ONLINE_AI`).
3. El estudiante conserve agencia completa mediante 5 acciones explícitas (`ACCEPT`, `POSTPONE`, `EDIT`, `REJECT`, `DISMISS_SIMILAR`) con trazabilidad pseudonimizada (`RecommendationTraceRecordDto`).

## 2. Reglas Duras y Fórmula de Puntaje (`ruleVersion: "1.0.0"`)
- **Reglas duras:**
  - En modo recuperación (`recoveryModeActive = true`), solo se permiten misiones con `isRecoveryEligible = true` y `effort = "LOW"`.
  - Nunca se recomienda un recurso institucional cuyo estado sea distinto de `PUBLISHED` (`ADR-006`).
  - Se excluyen misiones ya completadas en el ciclo o descartadas con `DISMISS_SIMILAR`.
  - Máximo 3 recomendaciones por ejecución (`maxRecommendationsPerRun = 3`).
- **Puntaje determinista ponderado:**
  $$\text{score} = 0.30 \cdot \text{need\_fit} + 0.20 \cdot \text{time\_fit} + 0.15 \cdot \text{difficulty\_fit} + 0.15 \cdot \text{continuity\_fit} + 0.15 \cdot \text{resource\_fit} + 0.05 \cdot \text{diversity\_fit}$$
