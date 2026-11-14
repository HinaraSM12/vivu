# Sprint 2 Consent, Onboarding & Profile Implementation Plan

**Goal:** Implementar el consentimiento informado versionado, flujo de retiro voluntario, wizard de onboarding de 5 pasos, perfil editable del estudiante y preferencias de personalización en `@vivu/contracts`, `@vivu/student-service`, `@vivu/api-gateway` y `@vivu/web`.

**Spec:** `docs/superpowers/specs/2026-11-10-sprint-2-consent-onboarding-profile.md`

---

## Tareas Secuenciales

### Task 1: Contratos de Consentimiento, Perfil y Eventos en `@vivu/contracts`
- [ ] Crear `packages/contracts/src/student/student-contracts.ts` con tipos `ConsentStatus`, `PerceivedLoad`, `PreferredTone`, `ConsentRecordDto`, `PersonalizationPreferencesDto`, `WellbeingInputsDto`, `StudentProfileDto`, `UpdateStudentProfileInput`, `ConsentUpdatedEventPayload` y `StudentProfileUpdatedEventPayload`.
- [ ] Agregar pruebas unitarias en `packages/contracts/src/student/student-contracts.spec.ts` y exportar desde `packages/contracts/src/index.ts`.

### Task 2: Dominio y Endpoints de Estudiante en `@vivu/student-service`
- [ ] Implementar `StudentRepository` con seeds coherentes para `est.activo@vivu.local` (consentimiento aceptado y onboarding completo), `est.recuperacion@vivu.local` (consentimiento aceptado y carga alta) y `est.nuevo@vivu.local` (consentimiento pendiente y sin onboarding).
- [ ] Implementar `StudentContextService` con validación de consentimiento previo (`CONSENT_REQUIRED`), rechazo de campos sensibles prohibidos (`grades`, `gpa`, `academicHistory`), gestión de retiro de consentimiento y emisión de eventos `consent.updated.v1` y `student.profile_updated.v1` con `analyticsSubjectId` seudónimo.
- [ ] Exponer `StudentController` y cubrir con pruebas unitarias exhaustivas en `services/student-service/src/student/student-context.service.spec.ts`.

### Task 3: Rutas `/api/v1/me/*` en `@vivu/api-gateway`
- [ ] Exponer `GET/POST /api/v1/me/consent`, `POST /api/v1/me/consent/withdraw`, `GET/PUT /api/v1/me/profile` y `GET/PUT /api/v1/me/personalization-preferences` protegidos con `JwtAuthGuard` y `@RequireRoles('STUDENT')`, derivando `studentId` exclusivamente de `request.authClaims.sub`.
- [ ] Agregar pruebas E2E en `apps/api-gateway/test/student-context.e2e-spec.ts` verificando bloqueo sin consentimiento (`403 CONSENT_REQUIRED`), aceptación de consentimiento, guardado de onboarding/perfil, rechazo de campos prohibidos, retiro de consentimiento y denegación RBAC para roles no `STUDENT`.

### Task 4: Consentimiento (`STU-03`), Wizard de Onboarding (`STU-04..08`), Perfil (`STU-19`) y Privacidad (`STU-20`) en `@vivu/web`
- [ ] Implementar `student-context-client.ts` y almacenamiento local de caché de perfil permitido para `STUDENT` (que se limpia automáticamente al cerrar sesión o retirar consentimiento).
- [ ] Integrar en `App.tsx` el flujo de entrada para estudiantes sin consentimiento/onboarding (`STU-03` Consentimiento -> `STU-04..08` Wizard de 5 pasos -> Home) y las vistas de `Perfil` (`STU-19`) y `Privacidad y consentimiento` (`STU-20`) con edición y retiro voluntario.
- [ ] Ampliar `apps/web/src/app/App.test.tsx` con pruebas de aceptación/rechazo de consentimiento, recorrido completo del wizard de 5 pasos, edición de perfil y retiro de consentimiento.

### Task 5: Verificación Integral, Handoff y Bitácora
- [ ] Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build`.
- [ ] Actualizar `VIVU_CONTEXT_HANDOFF.md` y `docs/thesis/bitacora-sprints.md` con el cierre del Sprint 2.

