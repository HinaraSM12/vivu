# Especificación Técnica — Sprint 7: Facilitador (`@vivu/support-service`)

## 1. Objetivo del Sprint
Implementar el dominio de acompañamiento humano (`@vivu/support-service`, contratos en `@vivu/contracts`, rutas `/api/v1/facilitator/*` en `@vivu/api-gateway` y vistas `FAC-01..FAC-04` en `@vivu/web`), garantizando:
1. **Aislamiento estricto por asignación (`PB-022`):** Cada `FACILITATOR` solo puede consultar y registrar seguimientos sobre los estudiantes explícitamente asignados a su cohorte.
2. **Señales formativas no estigmatizantes (`PB-023`):** Las señales de continuidad se presentan como `Continuidad activa`, `Pausa suave` o `Sugerencia de retomar con paso ligero`, prohibiendo etiquetas de "riesgo de deserción" o "alerta roja".
3. **Notas de acompañamiento y acuerdos (`PB-024`):** Registro de notas (`facilitator.note_created.v1`) y compromisos compartidos (`commitment.updated.v1`) con trazabilidad seudonimizada.

