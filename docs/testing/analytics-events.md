# Analítica de eventos para la validación

## Propósito

Registrar evidencia suficiente para observar funcionamiento, adherencia, continuidad, misiones, recuperación, utilidad y pertinencia, sin convertir la plataforma en un sistema de vigilancia.

## Eventos de interacción

| Evento | Métrica derivable |
|---|---|
| `mission.assigned.v1` | misiones propuestas/asignadas |
| `mission.accepted.v1` | tasa de aceptación |
| `mission.completed.v1` | completitud y continuidad |
| `mission.skipped.v1` | descarte/posposición según códigos definidos |
| `recovery.activated.v1` | uso del modo recuperación |
| `resource.viewed.v1` | consulta de apoyos |
| `survey.submitted.v1` | adherencia al seguimiento |
| `recommendation.generated.v1` | volumen, fallback y versiones del recomendador |
| `recommendation.offline_used.v1` | uso de recomendaciones determinísticas offline |
| `sync.action_applied.v1` | latencia y confiabilidad de sincronización, sin contenido sensible |
| `commitment.updated.v1` | actividad de acompañamiento, si se incluye en análisis aprobado |

## Interacción significativa semanal

Para V1, una semana cuenta como activa si el participante realiza al menos una interacción significativa definida por configuración del estudio, por ejemplo: completar/aceptar una misión, responder seguimiento o consultar un recurso desde una recomendación. La definición exacta debe congelarse antes del análisis final.

## Hitos

Calcular estado de actividad en semanas/hitos 1, 4 y 10, además de métricas semanales.

## Métricas

- semanas activas por participante;
- participantes activos en hitos;
- misiones aceptadas/completadas;
- proporción de finalización;
- activaciones de recuperación;
- recursos consultados;
- microcuestionarios respondidos;
- fallback rate del recomendador;
- incidencias técnicas por sesión/semana cuando exista fuente válida.

## Percepción

Utilidad, pertinencia, presión/saturación, claridad e intención de continuidad provienen de instrumentos; no inferir estas variables únicamente de logs de clicks.

## Privacidad

Analytics recibe `subjectId` seudónimo. No necesita email ni credenciales. Eventos con texto libre deben evitarse; las notas del facilitador no se copian a analytics salvo decisión metodológica explícita.

## Reproducibilidad

Guardar definición/versiones de métricas, ventanas temporales y filtros utilizados para cada exportación del estudio.

## Cronología offline

Para acciones offline se conservan `clientOccurredAt` y tiempo de ingestión del servidor. El análisis conductual no debe confundir “sincronizado hoy” con “realizado hoy”. La definición de métricas debe documentar cuál timestamp usa y cómo trata timestamps de cliente anómalos.
