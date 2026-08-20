# User flows V1

## UF-01 Consentimiento y onboarding

```mermaid
flowchart LR
  Login --> Consent[Leer consentimiento]
  Consent -->|Acepta| Profile[Perfil mínimo]
  Consent -->|No acepta| Exit[Salir / no iniciar piloto]
  Profile --> Pref[Preferencias]
  Pref --> Home[Home semanal]
```

**Reglas:** el estudiante puede omitir campos opcionales; se explica el propósito de datos usados para personalización.

## UF-02 Misión principal

```mermaid
flowchart LR
  Home --> List[Misiones]
  List --> Detail[Detalle]
  Detail -->|Aceptar| Active[Activa]
  Detail -->|Descartar| Dismiss[Descartada]
  Active -->|Completar| Feedback[Feedback positivo]
  Feedback --> Progress[Progreso actualizado]
```

## UF-03 Recuperación

```mermaid
flowchart LR
  Low[Baja continuidad] --> Offer[Ofrecer recuperación]
  Offer -->|Aceptar| Small[Misiones mínimas viables]
  Offer -->|Ahora no| Home[Home normal]
  Small --> Complete[Completar acción corta]
  Complete --> Return[Retorno gradual]
```

**Copy:** no usar “fallaste”, “rompiste la racha” ni urgencia artificial.

## UF-04 Recomendación

```mermaid
flowchart LR
  Request[Solicitar / cargar recomendación] --> Rules[Hard rules + score]
  Rules --> Explain[Explicación]
  Explain -->|Aceptar| Mission[Asignar/abrir misión]
  Explain -->|Ver recurso| Resource[Recurso autorizado]
  Explain -->|Descartar| Reason[Motivo opcional]
```

## UF-05 Facilitator

```mermaid
flowchart LR
  Dashboard --> Assigned[Asignados]
  Assigned --> Student[Detalle]
  Student --> Note[Registrar nota]
  Student --> Commit[Crear compromiso]
  Commit --> Close[Cerrar/actualizar]
```

## UF-06 Admin publica misión

```mermaid
flowchart LR
  Catalog --> Create[Crear borrador]
  Create --> Rules[Elegibilidad / esfuerzo]
  Rules --> Preview[Vista previa]
  Preview --> Publish[Publicar versión]
  Publish --> Audit[Auditoría]
```

## UF-07 Retiro de consentimiento

```mermaid
flowchart LR
  Privacy[Privacidad] --> Withdraw[Solicitar retiro]
  Withdraw --> Confirm[Confirmación explícita]
  Confirm --> Stop[Detener nuevos tratamientos definidos]
  Stop --> Audit[Registrar evento]
  Audit --> Guidance[Mostrar qué ocurre con datos ya recolectados según política aprobada]
```


## UF-08 Misión offline y sincronización

```mermaid
flowchart LR
  Mission[Misión cacheada] --> Complete[Completar sin red]
  Complete --> Local[Guardar estado local]
  Local --> Outbox[Outbox pendiente]
  Outbox --> Reconnect[Vuelve conexión]
  Reconnect --> Validate[Revalidar sesión/consentimiento]
  Validate --> Push[Enviar clientEventId]
  Push --> Applied[Applied / already_applied]
  Applied --> Pull[Pull de estado nuevo]
  Pull --> Synced[Sincronizado]
```

## UF-09 Conflicto de perfil

```mermaid
flowchart LR
  Offline[Editar campo offline] --> Push[Sincronizar]
  Push --> Conflict[Servidor detecta misma propiedad modificada]
  Conflict --> Compare[Mostrar valores y contexto]
  Compare --> Choice[Usuario elige valor]
  Choice --> Retry[Enviar nueva versión]
```

## UF-10 Recomendación offline

```mermaid
flowchart LR
  NoNet[Sin red] --> Cache[Contexto + catálogo cacheado]
  Cache --> Rules[Hard rules TS]
  Rules --> Score[Scoring TS]
  Score --> Rec[OFFLINE_RULES]
  Rec --> Use[Usar/descartar]
  Use --> Sync[Sincronizar trazabilidad al volver red]
  Sync --> Online[Nueva recomendación online opcional]
```
