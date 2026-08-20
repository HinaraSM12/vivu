# Estrategia de pruebas

## Objetivo

Reducir defectos en flujos del piloto y verificar especialmente reglas, autorización, contratos, eventos, privacidad y fallback de IA.

## Capas

### Unit
Enfocar en reglas puras: transiciones de misión, scoring, elegibilidad, recuperación, permisos de dominio, mapeos de eventos.

### Integration
PostgreSQL y RabbitMQ reales en contenedores efímeros o entorno CI. Probar migraciones, repositorios, publicación/consumo e idempotencia.

### Contract
- snapshots/validation de OpenAPI;
- esquemas de eventos versionados;
- compatibility check al modificar DTOs.

### E2E Playwright
Flujos obligatorios:
1. onboarding -> misión -> completar -> progreso;
2. baja continuidad -> recuperación -> misión mínima;
3. recomendación -> explicación -> recurso;
4. facilitator asignado -> nota -> compromiso;
5. admin crea/publica misión;
6. admin exporta datos seudonimizados;
7. instalar/abrir PWA offline;
8. completar misión offline -> reload -> reconectar -> sync sin duplicado;
9. conflicto de perfil -> resolución explícita;
10. recomendación `OFFLINE_RULES` -> reconexión -> recomendación online nueva.

## Recomendador

- golden contexts;
- score determinístico;
- hard rules;
- LLM invalid output;
- timeout/rate limit;
- fallback;
- minimización de payload;
- paridad Python/TypeScript sobre fixtures compartidos;
- cero llamadas LLM en modo offline.

## Seguridad

Cada endpoint sensible debe tener tests allow/deny. Incluir acceso a recursos ajenos, manipulación de IDs, token expirado y usuario deshabilitado.

## Datos de prueba

Usar fixtures sintéticos. No incluir datos reales de estudiantes en repositorio, snapshots, screenshots o CI.

## CI gates

PR no se integra si falla:
- lint/format check;
- typecheck;
- unit tests;
- integration tests críticas;
- Python Ruff/Pytest;
- build;
- validación de contratos.

E2E puede ejecutarse en pipeline posterior durante etapas tempranas, pero es obligatorio para release candidata a piloto.

## Cobertura

No perseguir cobertura global como único objetivo. Exigir cobertura directa de invariantes y ramas críticas: autorización, estados de misión, hard rules, scoring, fallback, idempotencia y exportación.

## Pilot readiness

Antes de involucrar participantes:
- E2E críticos verdes;
- restauración de backup ensayada;
- fallos LLM ensayados;
- RabbitMQ retry/DLQ ensayados;
- revisión de logs para ausencia de PII accidental;
- prueba básica de concurrencia/carga acotada;
- accesibilidad y usabilidad inicial revisadas;
- pruebas de red intermitente, outbox y conflictos verdes;
- migración/limpieza de IndexedDB ensayada.


## PWA / offline

Usar Playwright con context offline/online y, cuando aplique, control de red para probar persistencia y reintentos. Deben existir pruebas unitarias del reducer/repositorio local, integration tests del sync endpoint y E2E de reconexión. Background Sync no puede ser la única ruta probada: el flujo debe funcionar al reabrir la app y recuperar conectividad.
