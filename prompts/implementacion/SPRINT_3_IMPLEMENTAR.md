# Prompt de Implementación — Sprint 3: Misiones, ludificación y progreso

## Contexto obligatorio
1. Leer VIVU_CONTEXT_HANDOFF.md, docs/00-master-spec.md, docs/roadmap/vivu-sprint-roadmap.md y docs/ux/mockup-guide.md.
2. Verificar el estado actual de main y crear la rama $(System.Collections.Hashtable.Branch).

## Alcance a implementar en Sprint 3
- Catálogo y asignaciones de misiones en gamification-service, aceptación, inicio, posposición y finalización con Idempotency-Key, progreso personal (ProgressRing, niveles y logros no competitivos), continuidad semanal y pantallas STU-09 a STU-14.

## Restricciones invariables
- Mantener código e identificadores en inglés; documentación, commits, PR y textos de interfaz en español.
- Respetar separación por microservicios y ownership de datos por servicio.
- Garantizar privacidad, minimización de datos, ausencia de rankings públicos y ausencia de etiquetas de riesgo.
- Ejecutar 
pm run lint, 
pm run typecheck, 
pm run test y 
pm run build antes de abrir PR.
- Actualizar VIVU_CONTEXT_HANDOFF.md y docs/thesis/bitacora-sprints.md al cierre del sprint.
