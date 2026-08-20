# Especificación para Figma

## Objetivo

Diseñar una experiencia académica de baja presión, centrada en autonomía, progreso personal, conexión con recursos y recuperación sin castigo.

## Archivo Figma

```text
00 Cover & Notes
01 Foundations
02 Components
10 Student
20 Facilitator
30 Admin
40 Responsive & PWA
90 Prototype
99 Dev Handoff
```

## Breakpoints

- Student: mobile 390 px primero y desktop 1440 px.
- Facilitator/Admin: desktop 1440 px primero; tablet responsive en segunda pasada.

## Foundations

Definir tokens para:
- tipografía;
- escala de espaciado;
- radios;
- bordes;
- colores semánticos `surface`, `text`, `success`, `warning`, `error`, `info`;
- estados focus/hover/disabled;
- elevación mínima.

No usar identidad gráfica oficial de la Universidad hasta confirmar autorización. Primer sistema visual: académico neutral.

## Componentes

- Button: primary/secondary/tertiary/destructive.
- Input, select, checkbox, radio, textarea.
- Chip/tag.
- MissionCard + MissionStatus.
- ProgressIndicator.
- Achievement personal.
- RecoveryCallout.
- RecommendationCard + “¿Por qué te la sugerimos?”.
- ResourceCard.
- SurveyScale.
- DataTable.
- Timeline.
- EmptyState, LoadingState, ErrorState.
- Modal confirmatorio.
- Toast no intrusivo.
- PrivacyConsentPanel.
- ConnectivityIndicator.
- SyncStatus / PendingAction.
- ConflictResolutionSheet.
- LastSyncLabel.
- AppUpdateBanner.

## Student screens

1. Login.
2. Consentimiento.
3. Onboarding paso a paso.
4. Home semanal.
5. Lista de misiones.
6. Detalle de misión.
7. Completar misión + feedback.
8. Progreso.
9. Modo recuperación.
10. Recomendación explicada.
11. Recursos: catálogo/detalle.
12. Microcuestionario.
13. Perfil, personalización y privacidad.
14. Estado offline / pendientes de sincronización.
15. Conflicto de perfil.
16. Primera sincronización requerida / app no preparada para offline.

### Home semanal
Debe responder en menos de unos segundos visuales a: “¿qué puedo hacer esta semana?”, “¿cómo voy?” y “¿qué apoyo tengo disponible?”. Evitar dashboards densos.

### Recuperación
Usar copy de retorno, no pérdida: “Retoma con algo pequeño” en vez de “perdiste tu racha”. La acción principal debe ser de baja carga y opcional.

### Recomendación
Mostrar: acción/recurso, esfuerzo estimado, motivo breve, botón aceptar/ver y opción descartar. No presentar “la IA decidió”.

## Facilitator screens

1. Login.
2. Dashboard de asignados.
3. Lista de estudiantes asignados.
4. Detalle del estudiante.
5. Timeline de seguimiento.
6. Nueva nota/compromiso.
7. Recursos institucionales.

La información visible debe ser limitada y orientada a acompañamiento, no a clasificación.

## Admin screens

1. Dashboard.
2. Usuarios y roles.
3. Asignaciones.
4. Catálogo de misiones.
5. Editor/versiones de misión.
6. Recursos.
7. Reglas de ludificación.
8. Configuración del recomendador.
9. Cuestionarios.
10. Analítica del piloto.
11. Exportaciones.
12. Auditoría.

## Estados obligatorios

Cada pantalla clave debe diseñar: loading, vacío, error recuperable, error de autorización, datos parciales y confirmación de éxito. Para STUDENT añadir offline, pendiente de sync, conflicto, cache desactualizado y actualización de PWA disponible.

## Accesibilidad

- contraste AA como objetivo;
- focus visible;
- no depender solo del color;
- labels persistentes;
- targets táctiles adecuados;
- tablas administrativas con navegación clara;
- copy comprensible y no coercitivo.

## Prototipos Figma prioritarios

1. Student: consentimiento -> onboarding -> home -> misión -> progreso.
2. Student: baja continuidad -> recuperación -> misión mínima.
3. Student: recomendación -> explicación -> recurso.
4. Facilitator: asignado -> detalle -> nota -> compromiso.
5. Admin: crear misión -> publicar -> verificar disponibilidad.
6. Student: completar misión sin red -> pendiente -> reconectar -> sincronizado.
7. Student: recomendación offline -> recuperar red -> recomendación online actualizada.
8. Student: conflicto de perfil -> elegir/resolver.
