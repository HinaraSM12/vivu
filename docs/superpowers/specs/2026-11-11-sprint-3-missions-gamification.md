# Especificación Técnica — Sprint 3: Misiones, Ludificación y Progreso

**Fecha:** 2026-11-11  
**Sprint:** 3  
**Rama objetivo:** `feat/sprint-3-missions-gamification`  
**Issue relacionado:** #4 (`[Sprint 3] Misiones, ludificación y progreso`)  
**Servicios involucrados:** `packages/contracts`, `services/gamification-service`, `apps/api-gateway`, `apps/web`

---

## 1. Objetivo del Sprint

Implementar el motor de ludificación no competitiva y gestión de misiones en `@vivu/gamification-service`, exponiendo sus contratos a través de `@vivu/api-gateway` y construyendo en `@vivu/web` las experiencias completas del estudiante para Inicio semanal (`STU-09`), Catálogo y filtros de misiones (`STU-10`), Detalle de misión (`STU-11`), Misión en progreso con pausa/posposición sin castigo (`STU-12`), Finalización con retroalimentación positiva (`STU-13`) y Progreso personal y logros no competitivos (`STU-14`).

---

## 2. Reglas de Dominio, Ética y Ludificación No Punitiva

1. **Reglas de negocio en backend (`ADR-001`, `docs/00-master-spec.md`):**
   - El cálculo de niveles, logros personales, estados de misión y señales de continuidad se ejecuta exclusivamente en `@vivu/gamification-service` bajo una versión explícita (`ruleVersion = "1.0.0"`).
2. **Niveles de progreso personal (`ruleVersion = "1.0.0"`):**
   - Nivel 1 (`EXPLORATION` — *Exploración*): `0` a `2` misiones completadas.
   - Nivel 2 (`INITIAL_CONSISTENCY` — *Constancia inicial*): `3` a `6` misiones completadas.
   - Nivel 3 (`AUTONOMOUS_PACE` — *Ritmo autónomo*): `7` a `12` misiones completadas.
   - Nivel 4 (`CONSOLIDATED_SELF_REGULATION` — *Autorregulación consolidada*): `13+` misiones completadas.
3. **Ausencia total de rankings y castigos:**
   - Prohibido exponer percentiles, posiciones en tablas de clasificación (*leaderboards*), puntajes competitivos o mensajes de culpa (*"vas atrasado"*, *"perdiste tu racha"*).
   - Pausar (`pause`) o posponer/descartar (`skip`) una misión nunca resta progreso ni degrada el nivel o los logros desbloqueados.
4. **Idempotencia preparada para PWA local-first (`ADR-005`):**
   - Las operaciones `accept`, `complete` y `skip` aceptan `clientEventId` (o cabecera `Idempotency-Key`).
   - Reenviar la misma finalización de misión con el mismo `clientEventId` devuelve el estado ya procesado sin duplicar el conteo de misiones completadas ni emitir eventos duplicados.
5. **Privacidad y seudonimización en eventos (`ADR-003`, `docs/testing/analytics-events.md`):**
   - Emisión de `mission.assigned.v1`, `mission.accepted.v1`, `mission.completed.v1` y `mission.skipped.v1` con `subjectId` seudónimo (`analyticsSubjectId`) y sin PII en el payload.

---

## 3. Contratos HTTP (`/api/v1`)

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| `GET` | `/api/v1/missions` | `STUDENT` | Lista las misiones del estudiante con su estado actual (`available`, `accepted`, `in_progress`, `paused`, `skipped`, `completed`) y filtro opcional (`today`, `week`, `all`, `completed`, `category`). |
| `GET` | `/api/v1/missions/catalog` | `STUDENT`, `FACILITATOR`, `ADMIN` | Consulta el catálogo oficial versionado de plantillas de misiones (`ruleVersion: "1.0.0"`). |
| `GET` | `/api/v1/missions/:missionCode` | `STUDENT` | Obtiene el detalle completo de una misión (`STU-11`: pasos, por qué sirve, duración, qué necesita, recurso relacionado) y su estado de asignación. |
| `POST` | `/api/v1/missions/:missionCode/accept` | `STUDENT` | Acepta una misión (`available | skipped -> accepted`), idempotente por `clientEventId`, y emite `mission.accepted.v1`. |
| `POST` | `/api/v1/missions/:missionCode/start` | `STUDENT` | Inicia o retoma una misión (`available | accepted | paused -> in_progress`). |
| `POST` | `/api/v1/missions/:missionCode/pause` | `STUDENT` | Pausa una misión en curso (`in_progress -> paused`) sin penalización. |
| `POST` | `/api/v1/missions/:missionCode/skip` | `STUDENT` | Pospone o descarta una misión para otro momento (`-> skipped`) con motivo opcional y sin penalización; emite `mission.skipped.v1`. |
| `POST` | `/api/v1/missions/:missionCode/complete` | `STUDENT` | Completa una misión (`accepted | in_progress | paused -> completed`), idempotente por `clientEventId`, recalcula nivel y logros personales, devuelve feedback positivo (`STU-13`) y emite `mission.completed.v1`. |
| `GET` | `/api/v1/progress` | `STUDENT` | Obtiene el resumen de progreso personal (`STU-14`: nivel 1–4, misiones aceptadas/completadas, continuidad semanal flexible, categorías trabajadas y logros personales). |

---

## 4. Pantallas y Flujos Frontend (`@vivu/web`)

1. **`STU-09` — Home / Inicio semanal:**
   - Saludo breve, misión recomendada / siguiente acción inmediata, resumen de progreso de la semana, llamado suave a modo recuperación cuando `continuitySignal === 'recovery_suggested'` y acceso rápido a misiones.
2. **`STU-10` — Lista de misiones:**
   - Filtros simples: `Hoy`, `Esta semana`, `Todas`, `Completadas` y filtro por categoría.
   - Tarjetas `MissionCard` con título, categoría, duración estimada, esfuerzo (`Bajo`, `Medio`, `Alto`), razón breve de relevancia, estado y CTA contextual.
3. **`STU-11` — Detalle de misión:**
   - Responde claramente: *¿Qué tengo que hacer?*, *¿Por qué puede servirme?*, *¿Cuánto tarda?*, *¿Qué necesito?* y *¿Qué recurso de apoyo está relacionado?*.
4. **`STU-12` — Misión en progreso:**
   - Lista de pasos mínimos, nota/reflexión breve opcional, botón de **Pausar sin castigo**, botón de **Posponer para otro momento** y CTA **Completar misión**.
5. **`STU-13` — Misión completada:**
   - Banner/modal de retroalimentación positiva breve, avance hacia el siguiente nivel personal, logro desbloqueado (si aplica) y acciones: *"Ver mi progreso"*, *"Elegir otra misión"* o *"Terminar por ahora"*.
6. **`STU-14` — Progreso personal:**
   - Nivel actual (`1..4`), barra de avance personal no competitiva, misiones aceptadas y completadas, continuidad semanal flexible, categorías trabajadas y logros personales desbloqueados.

