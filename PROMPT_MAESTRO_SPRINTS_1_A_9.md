# Prompt maestro — ejecución secuencial de Sprints 1 a 9 de Vivu

Repositorio: `HinaraSM12/vivu`.

Este archivo NO autoriza a ejecutar todos los sprints de una sola vez. Su propósito es mantener el orden y las puertas de aprobación.

## Regla

Para cada Sprint N:

1. actualizar `main`;
2. leer `prompts/implementacion/SPRINT_N_IMPLEMENTAR.md`;
3. presentar análisis previo y esperar `APROBADO. CONTINÚA CON SPRINT N.`;
4. implementar solo ese sprint;
5. abrir PR y esperar CI;
6. ejecutar `prompts/revision/SPRINT_N_REVISAR.md` con un revisor independiente o una nueva pasada crítica;
7. corregir hallazgos;
8. merge solo con aprobación humana;
9. volver a `main`, pull y comenzar el siguiente sprint.

No mantener más de un sprint funcional sin integrar salvo instrucción explícita. El roadmap de autoridad es `docs/roadmap/vivu-sprint-roadmap.md`.

## Orden

Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4 → Sprint 5 → Sprint 6 → Sprint 7 → Sprint 8 → Sprint 9.

No saltar Sprint 2 antes de consentimiento/perfil, ni implementar recomendaciones antes de existir misiones/recursos suficientes, ni implementar offline completo antes de estabilizar los flujos online.
