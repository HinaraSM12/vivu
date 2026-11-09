# Prompt de Implementación — Sprint 2: Consentimiento, onboarding y perfil

## Contexto obligatorio
1. Leer VIVU_CONTEXT_HANDOFF.md, docs/00-master-spec.md, docs/roadmap/vivu-sprint-roadmap.md y docs/ux/mockup-guide.md.
2. Verificar el estado actual de main y crear la rama $(System.Collections.Hashtable.Branch).

## Alcance a implementar en Sprint 2
- Consentimiento informado versionado (consentVersion), flujo de retiro voluntario, wizard de onboarding paso a paso (STU-03 a STU-08), perfil editable en student-service (STU-19, STU-20) y emisión de eventos consent.updated.v1 y student.profile_updated.v1.

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
