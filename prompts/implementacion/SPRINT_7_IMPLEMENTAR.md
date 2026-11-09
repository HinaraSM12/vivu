# Prompt de Implementación — Sprint 7: Facilitador (support-service)

## Contexto obligatorio
1. Leer VIVU_CONTEXT_HANDOFF.md, docs/00-master-spec.md, docs/roadmap/vivu-sprint-roadmap.md y docs/ux/mockup-guide.md.
2. Verificar el estado actual de main y crear la rama $(System.Collections.Hashtable.Branch).

## Alcance a implementar en Sprint 7
- Asignaciones facilitador-estudiante en support-service, listado exclusivo de asignados, señales de continuidad sin etiquetas de riesgo, registro de notas de acompañamiento y compromisos (FAC-01 a FAC-05) y lectura cacheada limitada.

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
