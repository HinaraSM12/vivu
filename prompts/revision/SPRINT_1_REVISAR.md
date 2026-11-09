# Prompt de Revisión — Sprint 1: Identidad y Acceso

## Lista de verificación crítica antes de mergear el PR de Sprint 1

1. **Seguridad y RBAC:**
   - ¿El endpoint de registro fuerza siempre el rol `STUDENT` e ignora/rechaza cualquier intento de inyectar `ADMIN` o `FACILITATOR`?
   - ¿Las contraseñas se almacenan con hash seguro y nunca aparecen en respuestas HTTP, logs ni eventos?
   - ¿La rotación de refresh tokens invalida el token anterior y detecta reutilización?
   - ¿Los guards de `api-gateway` bloquean con `401` tokens ausentes/inválidos y con `403` accesos cruzados entre roles?

2. **Alineación UX y Ética:**
   - ¿Las pantallas de Login (`STU-01`) y Registro (`STU-02`) respetan el tono cercano, no punitivo y accesible de `docs/ux/mockup-guide.md`?
   - ¿Cada rol (`STUDENT`, `FACILITATOR`, `ADMIN`) ve únicamente el shell y opciones de navegación que le corresponden?

3. **Frontera PWA-ready:**
   - ¿Se evitó guardar el access token Bearer en `localStorage`?
   - ¿Quedó preparado el contrato de snapshot de sesión para la ventana offline futura de `STUDENT`?

4. **Puertas de calidad y trazabilidad:**
   - ¿Pasan `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build`?
   - ¿Se actualizaron `VIVU_CONTEXT_HANDOFF.md` y `docs/thesis/bitacora-sprints.md`?
