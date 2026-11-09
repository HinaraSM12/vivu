# Roadmap completo de desarrollo — Vivu

**Repositorio:** `HinaraSM12/vivu`  
**Estado:** Sprint 0 completado; este paquete define Sprints 1 a 9.  
**Cadencia recomendada:** 2 semanas por sprint; Sprint 6 y Sprint 9 pueden extenderse a 3 semanas por su complejidad.  
**Regla de trabajo:** un sprint = una rama + un PR + CI verde + revisión antes de merge.

## Orden y dependencias

| Sprint | Nombre | Resultado demostrable | Depende de |
|---:|---|---|---|
| 0 | Fundación técnica | Monorepo, servicios base, CI, Docker, PostgreSQL, RabbitMQ | — |
| 1 | Identidad y acceso | Registro/login/RBAC funcionando | 0 |
| 2 | Consentimiento, onboarding y perfil | Estudiante autorizado con contexto mínimo | 1 |
| 3 | Misiones y ludificación | Primera misión aceptada/completada + progreso | 2 |
| 4 | Recursos, encuestas y recuperación | Apoyos + check-ins + recuperación | 3 |
| 5 | Recomendador V1 online | Reglas + scoring + LLM opcional | 2,3,4 |
| 6 | PWA offline y sync | STUDENT trabaja offline y sincroniza | 3,4,5 |
| 7 | Facilitador | Acompañamiento humano de estudiantes asignados | 3,4 |
| 8 | Administración | Catálogos, reglas, asignaciones y exportes | 5,7 |
| 9 | Analítica y preparación piloto | Prototipo integrado listo para validación | 1-8 |

## Principios invariables

- React + TypeScript + Vite; npm Workspaces.
- Backend Node.js + TypeScript + NestJS.
- `recommendation-service` en Python + FastAPI.
- PostgreSQL y RabbitMQ.
- Microservicios por dominio; `support-service` es el nombre canónico del servicio de acompañamiento.
- `STUDENT`, `FACILITATOR`, `ADMIN`; no existe `RESEARCHER`.
- Código e identificadores técnicos en inglés; documentación, commits y PRs en español.
- IA instrumental: reglas y candidatos autorizados primero; LLM opcional después.
- Sin rankings públicos ni etiquetas de riesgo.
- Datos mínimos autorizados, consentimiento y trazabilidad.
- PWA local-first: offline completo para STUDENT; FACILITATOR principalmente online; ADMIN con escrituras online.

## Estrategia Git

Cada sprint parte de `main` actualizado. Usar la rama indicada en el spec del sprint. Al finalizar: ejecutar suite completa, push, abrir PR en español, esperar CI verde, revisión y merge. No acumular dos sprints sin integrar salvo decisión explícita.

## Puertas de calidad por sprint

Cada PR debe pasar, cuando aplique: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`; validaciones Python (`lint`, `typecheck`, `pytest`); pruebas de contratos; Docker Compose config; y E2E cuando el sprint agrega un flujo de usuario completo.
