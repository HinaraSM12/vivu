# Especificación Técnica — Sprint 2: Consentimiento, Onboarding y Perfil

**Fecha:** 2026-11-10  
**Sprint:** 2  
**Rama objetivo:** `feat/sprint-2-consent-onboarding-profile`  
**Issue relacionado:** #3 (`[Sprint 2] Consentimiento, onboarding y perfil`)  
**Servicios involucrados:** `packages/contracts`, `services/student-service`, `apps/api-gateway`, `apps/web`

---

## 1. Objetivo del Sprint

Implementar el dominio completo de contexto del estudiante (`@vivu/student-service`), incluyendo consentimiento informado versionado (`consentVersion: "1.0"`), derecho de retiro voluntario sin consecuencias académicas, wizard de onboarding paso a paso (`STU-03` a `STU-08`), perfil académico autorreportado editable (`STU-19`), panel de privacidad y preferencias de personalización (`STU-20`), aislamiento de `analyticsSubjectId` seudónimo y emisión de los eventos de dominio `consent.updated.v1` y `student.profile_updated.v1`.

---

## 2. Reglas de Dominio, Ética y Privacidad

1. **Consentimiento informado versionado obligatorio antes del tratamiento:**
   - Un estudiante (`STUDENT`) no puede guardar datos de onboarding/perfil ni activar personalización mientras no tenga un registro de consentimiento con `status === 'accepted'` para la versión vigente (`1.0`).
   - Intentar actualizar `/api/v1/me/profile` sin consentimiento activo devuelve `403 CONSENT_REQUIRED`.
2. **Retiro de consentimiento (`POST /api/v1/me/consent/withdraw`):**
   - Marca el consentimiento como `withdrawn` con `withdrawnAt`.
   - Desactiva inmediatamente `allowPersonalization` y `allowOptionalWellbeingContext` en `personalization_preferences` y limpia `wellbeingInputs` opcionales.
   - Emite `consent.updated.v1` con `{ status: 'withdrawn', consentVersion }` usando el `analyticsSubjectId` seudónimo.
3. **Minimización de datos y prohibición de datos no autorizados:**
   - Solo se admiten los campos autorizados en `docs/00-master-spec.md` y `docs/security/privacy-and-consent.md`:
     - `engineeringProgram` (string)
     - `semester` (entero 1–12)
     - `perceivedLoad` (`'low' | 'moderate' | 'high'`)
     - `difficultSubjects` (`string[]`, autorreportadas, sin calificaciones)
     - `weeklyAvailabilityMinutes` (entero `15..1200`)
     - `externalResponsibilities` (`string[]`)
     - `studyPractices` (`string[]`)
     - `interests` (`string[]`)
     - `wellbeingInputs` (opcional: `{ motivationLevel?: 1..5, stressPerception?: 'low' | 'moderate' | 'high', preferredSupportGoal?: string }`, guardado únicamente si `allowOptionalWellbeingContext === true`).
   - Cualquier intento de enviar calificaciones (`gpa`, `grades`, `academicHistory`) es rechazado por validación DTO/dominio (`400 UNSUPPORTED_SENSITIVE_FIELD`).
4. **Seudonimización para analítica:**
   - Cada estudiante recibe un `analyticsSubjectId` (UUID distinto de su `studentId` y nunca derivado públicamente de su email).
   - Los eventos `consent.updated.v1` y `student.profile_updated.v1` usan `subjectId = analyticsSubjectId` y no incluyen PII ni texto libre sensible en `payload` (`changedFieldCodes` lista solo los códigos de campo modificados).
5. **Autorización RBAC y propiedad de datos:**
   - Las rutas `/api/v1/me/consent`, `/api/v1/me/profile` y `/api/v1/me/personalization-preferences` están restringidas a `STUDENT` y derivan el `studentId` exclusivamente del `sub` del JWT autenticado.

---

## 3. Contratos HTTP (`/api/v1`)

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| `GET` | `/api/v1/me/consent` | `STUDENT` | Obtiene el estado actual del consentimiento (`pending`, `accepted`, `withdrawn`, `consentVersion`). |
| `POST` | `/api/v1/me/consent` | `STUDENT` | Registra la aceptación explícita del consentimiento (`consentVersion`, preferencias iniciales) y emite `consent.updated.v1`. |
| `POST` | `/api/v1/me/consent/withdraw` | `STUDENT` | Registra el retiro voluntario del consentimiento, desactiva personalización y emite `consent.updated.v1`. |
| `GET` | `/api/v1/me/profile` | `STUDENT` | Obtiene el perfil del estudiante, estado de onboarding (`onboardingCompleted`) y preferencias. |
| `PUT` | `/api/v1/me/profile` | `STUDENT` | Crea o actualiza el perfil mínimo del estudiante (requiere consentimiento `accepted`) y emite `student.profile_updated.v1`. |
| `GET` | `/api/v1/me/personalization-preferences` | `STUDENT` | Consulta preferencias de personalización y contexto opcional de bienestar. |
| `PUT` | `/api/v1/me/personalization-preferences` | `STUDENT` | Actualiza preferencias de personalización (`allowPersonalization`, `allowOptionalWellbeingContext`, `preferredTone`). |

---

## 4. Pantallas y Flujos Frontend (`@vivu/web`)

Alineado con `docs/ux/mockup-guide.md`:

1. **Consentimiento informado (`STU-03`):**
   - Resumen claro de finalidades, qué datos se recolectan y cuáles no, papel instrumental de la IA, casillas explícitas y opción clara y no oculta de **"No aceptar por ahora"** (sin dark patterns).
2. **Wizard de Onboarding por pasos (`STU-04` a `STU-08`):**
   - Paso 1 (`STU-04`): Contexto académico mínimo (programa de ingeniería y semestre).
   - Paso 2 (`STU-05`): Carga percibida y áreas/materias retadoras (sin calificaciones).
   - Paso 3 (`STU-06`): Disponibilidad semanal y responsabilidades externas.
   - Paso 4 (`STU-07`): Intereses y prácticas de estudio.
   - Paso 5 (`STU-08`): Autopercepción y bienestar opcional (con opción explícita de omitir).
   - Navegación `"Anterior"` / `"Siguiente"` conservando estado entre pasos y barra de progreso del wizard.
3. **Perfil Editable (`STU-19`) y Privacidad / Retiro (`STU-20`):**
   - En la pestaña `Perfil` del estudiante: separación clara entre **Cuenta**, **Contexto para personalización** (editable en cualquier momento) y **Privacidad y consentimiento** (transparencia de IA, toggles de personalización y botón de **Retirar consentimiento** con confirmación clara).

