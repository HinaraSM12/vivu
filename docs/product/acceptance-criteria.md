# Criterios de aceptación V1

## Convenciones

Los criterios se expresan en formato Given/When/Then. Los casos de seguridad negativos son obligatorios.

## AC-01 Autenticación y roles

- **Dado** un usuario con credenciales válidas, **cuando** inicia sesión, **entonces** recibe una sesión con rol verificable y acceso limitado a ese rol.
- **Dado** un `FACILITATOR`, **cuando** intenta abrir un estudiante no asignado, **entonces** recibe `403` y el acceso se registra sin exponer el dato solicitado.
- **Dado** un `STUDENT`, **cuando** intenta una ruta `/admin/*`, **entonces** la operación es rechazada aunque manipule el frontend.

## AC-02 Consentimiento

- Sin consentimiento vigente no se ejecuta personalización del piloto.
- La aceptación almacena `consentVersion`, fecha y sujeto.
- El retiro impide nuevos tratamientos definidos por el consentimiento y genera auditoría.

## AC-03 Onboarding y perfil

- Solo se solicitan campos incluidos en la especificación aprobada.
- Campos sensibles opcionales muestran propósito y pueden omitirse cuando el flujo lo permita.
- Actualizar el perfil publica `student.profile_updated.v1` sin payloads innecesariamente identificables.

## AC-04 Misiones

- Solo misiones publicadas y elegibles pueden asignarse.
- Cambios de estado inválidos se rechazan (por ejemplo, completar una misión cancelada).
- Completar una misión es idempotente y no duplica progreso ante reintento.
- La UI no presenta rankings públicos.

## AC-05 Progreso y recuperación

- El progreso refleja únicamente acciones del estudiante actual.
- Una interrupción no resta logros previamente obtenidos.
- En recuperación se priorizan acciones de baja carga y metas mínimas viables.
- El estudiante puede salir del modo recuperación sin penalización pública.

## AC-06 Recursos

- Recursos inactivos, vencidos o no autorizados no aparecen como recomendación.
- ADMIN puede desactivar un recurso sin borrar la trazabilidad histórica de recomendaciones pasadas.

## AC-07 Recomendador

- Todos los candidatos pasan hard rules antes del scoring.
- `score_components` y versión de pesos se persisten.
- Un LLM no puede devolver un `missionId` o `resourceId` fuera de candidatos permitidos.
- Si el LLM falla o excede timeout, se usa plantilla determinística.
- Toda recomendación visible contiene explicación breve y opción de descartar.

## AC-08 Facilitación

- FACILITATOR solo ve asignados.
- Notas y compromisos tienen autor, timestamp y estado.
- No se muestra una etiqueta definitiva del tipo “alto riesgo” como clasificación pública.

## AC-09 Administración

- Crear/editar/publicar/desactivar misión queda auditado.
- Cambiar parámetros del recomendador crea nueva versión, no sobrescribe silenciosamente la anterior.
- Exportaciones quedan auditadas con actor, fecha, alcance y resultado.

## AC-10 Microcuestionarios

- Una respuesta referencia la versión exacta del instrumento.
- El sistema evita duplicación accidental si el participante reintenta la misma entrega.
- Los instrumentos pueden incluir utilidad, pertinencia, carga percibida, dificultades y continuidad.

## AC-11 Analítica

- Un evento duplicado no duplica el conteo de métricas.
- Se pueden obtener actividad en semanas/hitos, misiones aceptadas/completadas, recuperación y consultas de recursos.
- La analítica no requiere exponer credenciales ni identificadores directos del usuario.

## AC-12 Calidad técnica

- `docker compose up` inicia dependencias y servicios definidos para el entorno local.
- Cada servicio publica health/readiness.
- CI ejecuta lint, typecheck, unit/integration tests relevantes y build.
- Los flujos E2E críticos definidos en la master spec pasan antes de etiquetar una release de piloto.


## AC-13 PWA y sincronización offline

- El primer login/bootstrap requiere conexión.
- Tras sincronizar, STUDENT puede abrir la PWA sin red y consultar datos mínimos cacheados.
- Completar una misión offline sobrevive a recarga/cierre y queda en outbox.
- Reenviar la misma acción con el mismo `clientEventId` no duplica progreso ni eventos de dominio.
- Al recuperar conexión, la UI distingue `pending`, `syncing`, `applied`, `conflict` y `rejected` con copy comprensible.
- Un conflicto de perfil concurrente no se resuelve con `last-write-wins` silencioso.
- Recursos/catálogos cacheados muestran antigüedad y se actualizan mediante sync pull.
- El recomendador offline usa solo configuración/catálogo previamente sincronizados y registra `source=OFFLINE_RULES`.
- El recomendador offline no realiza llamadas al LLM.
- Fixtures compartidos producen ranking equivalente en Python y TypeScript.
- FACILITATOR no crea notas/compromisos offline.
- ADMIN no puede ejecutar mutaciones administrativas offline.
- Logout/retiro aplica la política de limpieza/inutilización de datos locales.
