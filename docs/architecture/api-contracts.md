# Contratos API V1

## Convenciones globales

- Prefijo público: `/api/v1`.
- JSON UTF-8.
- Fechas ISO-8601 UTC.
- JWT Bearer para rutas autenticadas.
- `X-Correlation-Id` aceptado o generado por gateway.
- `Idempotency-Key` requerido en operaciones críticas definidas. Para acciones offline, el valor estable se deriva de `clientEventId`.
- OpenAPI es parte del contrato y debe generarse en CI.

## Error estándar

```json
{
  "code": "MISSION_INVALID_STATE",
  "message": "La misión no puede completarse desde su estado actual.",
  "correlationId": "uuid",
  "details": {}
}
```

`details` nunca contiene stack traces, tokens o datos personales innecesarios.

## Auth

| Método | Ruta | Rol | Uso |
|---|---|---|---|
| POST | `/auth/login` | público | Crear sesión. |
| POST | `/auth/refresh` | sesión | Rotar refresh token. |
| POST | `/auth/logout` | autenticado | Revocar sesión actual. |
| GET | `/me` | autenticado | Perfil de sesión y capacidades. |

## Student

| Método | Ruta | Rol |
|---|---|---|
| GET/PUT | `/me/profile` | STUDENT |
| GET/POST | `/me/consent` | STUDENT |
| GET/PUT | `/me/personalization-preferences` | STUDENT |
| GET | `/me/progress` | STUDENT |
| GET | `/me/recovery` | STUDENT |
| POST | `/me/recovery/activate` | STUDENT |

Ejemplo `PUT /me/profile`:

```json
{
  "engineeringProgram": "Ingeniería de Sistemas",
  "semester": 2,
  "perceivedLoad": "high",
  "difficultSubjects": ["Cálculo"],
  "weeklyAvailabilityMinutes": 180,
  "externalResponsibilities": ["work"],
  "studyPractices": ["weekly_planning"]
}
```

## Misiones

| Método | Ruta | Rol |
|---|---|---|
| GET | `/missions` | STUDENT |
| GET | `/missions/{assignmentId}` | STUDENT |
| POST | `/missions/{assignmentId}/accept` | STUDENT |
| POST | `/missions/{assignmentId}/postpone` | STUDENT |
| POST | `/missions/{assignmentId}/discard` | STUDENT |
| POST | `/missions/{assignmentId}/complete` | STUDENT |

Las operaciones de cambio de estado usan `Idempotency-Key`.

## Recomendaciones

| Método | Ruta | Rol |
|---|---|---|
| POST | `/recommendations/generate` | STUDENT |
| GET | `/recommendations/{runId}` | STUDENT dueño |
| POST | `/recommendations/{runId}/items/{itemId}/dismiss` | STUDENT dueño |

Respuesta resumida:

```json
{
  "runId": "uuid",
  "fallbackUsed": false,
  "items": [
    {
      "type": "mission",
      "id": "uuid",
      "score": 0.87,
      "why": "Se ajusta a la dificultad que reportaste y al tiempo disponible esta semana."
    }
  ]
}
```

## Recursos

- `GET /resources`
- `GET /resources/{id}`
- `POST /resources/{id}/view` opcional si la lectura no se instrumenta en gateway.

## Surveys

- `GET /surveys/active`
- `GET /surveys/{versionId}`
- `POST /surveys/{versionId}/responses`

## Sincronización PWA

No se crea un servicio de sync independiente. El gateway coordina y delega.

| Método | Ruta | Rol | Uso |
|---|---|---|---|
| GET | `/sync/bootstrap` | STUDENT | Snapshot mínimo inicial para offline. |
| GET | `/sync/pull?cursor=...` | STUDENT | Deltas desde último cursor. |
| POST | `/sync/actions` | STUDENT | Replay de outbox con resultados por acción. |

Cada acción incluye `clientEventId`, `actionType`, `aggregateId`, `aggregateVersion?`, `clientOccurredAt` y payload validado por schema. Los estados de respuesta son `applied`, `already_applied`, `conflict`, `rejected` y `retryable_error`.

El gateway revalida sesión/consentimiento antes de aplicar. El servicio dueño del dominio valida invariantes y deduplicación; el gateway no decide reglas de misión, perfil o survey.

## Facilitator

- `GET /facilitator/students`
- `GET /facilitator/students/{studentId}`
- `GET /facilitator/students/{studentId}/timeline`
- `POST /facilitator/students/{studentId}/notes`
- `POST /facilitator/students/{studentId}/commitments`
- `PATCH /facilitator/commitments/{id}`

Todas estas rutas verifican asignación activa además del rol.

## Admin

- `/admin/users/*`
- `/admin/assignments/*`
- `/admin/missions/*`
- `/admin/resources/*`
- `/admin/gamification-rules/*`
- `/admin/recommendation-config/*`
- `/admin/surveys/*`
- `/admin/analytics/*`
- `/admin/exports/*`
- `/admin/audit/*`

## Contratos internos

Los servicios pueden exponer `/internal/v1/*` solo en red privada. Deben usar autenticación service-to-service definida en una fase posterior; no se aceptan endpoints internos sin autenticación por asumir que “solo están en Docker”.
