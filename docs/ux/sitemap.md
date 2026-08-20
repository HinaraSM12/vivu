# Sitemap V1

## Student

```mermaid
flowchart TD
  L[Login] --> C[Consentimiento]
  C --> O[Onboarding]
  O --> H[Inicio / Tu semana]
  H --> M[Misiones]
  H --> P[Progreso]
  H --> R[Recuperación]
  H --> REC[Recomendaciones]
  H --> RES[Recursos]
  H --> S[Seguimiento]
  H --> PF[Perfil]
  M --> MD[Detalle de misión]
  REC --> WHY[Por qué]
  REC --> RES
  S --> Q[Microcuestionario]
  PF --> PRIV[Privacidad y consentimiento]
  H --> SYNC[Estado de sincronización]
  SYNC --> CONFLICT[Conflictos pendientes]
```

## Facilitator

```mermaid
flowchart TD
  L[Login] --> D[Dashboard]
  D --> AS[Estudiantes asignados]
  AS --> ST[Detalle estudiante]
  ST --> TL[Timeline]
  ST --> N[Nueva nota]
  ST --> CO[Compromisos]
  D --> R[Recursos]
```

## Admin

```mermaid
flowchart TD
  L[Login] --> D[Dashboard]
  D --> U[Usuarios]
  D --> A[Asignaciones]
  D --> M[Misiones]
  D --> R[Recursos]
  D --> G[Reglas de ludificación]
  D --> AI[Recomendador / IA]
  D --> S[Cuestionarios]
  D --> AN[Analítica]
  D --> E[Exportaciones]
  D --> AU[Auditoría]
  D --> CFG[Configuración]
```

## Navegación

- Student: navegación primaria corta; no más de 4-5 destinos principales visibles simultáneamente en mobile.
- Facilitator/Admin: sidebar desktop con permisos; ocultar y además bloquear rutas no permitidas.
- La URL nunca es mecanismo de autorización.

## PWA

Los estados `offline`, `pendiente`, `sincronizado` y `conflicto` son estados transversales y no requieren convertirse en destinos principales. La pantalla de estado de sincronización debe ser accesible desde Student sin aumentar la navegación primaria más allá de 4-5 destinos.
