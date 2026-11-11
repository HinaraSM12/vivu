# Privacidad, Consentimiento, Gobernanza de Datos y Ética por Diseño

## 1. Alcance

Este documento traduce los principios éticos del proyecto de tesis y de la revisión sistemática PRISMA 2020 (V5) a requisitos verificables de software. Se complementa con la matriz detallada por variable en [`docs/security/data-governance-matrix.md`](file:///d:/Escritorio/proyecto-tesis-app/docs/security/data-governance-matrix.md).

---

## 2. Principios éticos y técnicos (Puntos 19, 40–45)

1. **Participación voluntaria y consentimiento granular versionado** (`consentVersion = "1.0"`).
2. **Derecho de retiro inmediato** (`POST /api/v1/me/consent/withdraw`) con revocación de personalización y limpieza de contexto opcional.
3. **Minimización de datos y no clínica (Punto 45):** Se priorizan constructos académicos accionables (**carga académica percibida** y **dificultad percibida de organización y manejo del tiempo**) y se evita recopilar variables clínicas de estrés, salud mental o diagnósticos psicológicos.
4. **Datos prohibidos por defecto (Punto 44):** Prohibido recolectar calificaciones (`gpa`, `grades`), historia académica (`academicHistory`), documento de identidad (`institutionalIdNumber`), diagnósticos médicos/clínicos (`clinicalDiagnosis`), correos privados o registros disciplinarios.
5. **Sanitización previa en correo institucional (Punto 19):** `InstitutionalMailConnector` elimina nombres personales, correos privados, documentos, firmas, teléfonos privados, hilos de conversación y archivos privados **antes** de cualquier llamada al LLM.
6. **Prohibición de recursos inventados (Punto 37):** Ninguna recomendación puede emitirse sin un `resource_id` existente en el catálogo con `status = PUBLISHED / ACTIVE`.
7. **Explicabilidad no estigmatizante (Punto 40):** Se explica el motivo concreto de la sugerencia sin etiquetar jamás al estudiante como *"en alto riesgo"*.
8. **Agencia estudiantil completa (Punto 41):** El estudiante siempre puede `ACEPTAR`, `RECHAZAR`, `POSPONER`, `EDITAR` o indicar `NO QUIERO RECOMENDACIONES COMO ESTA`.
9. **Separación de identidad y telemetría pseudonimizada (Punto 13):** `analytics-service` opera exclusivamente sobre `participant_id_pseudonym` (`analyticsSubjectId`).

---

## 3. Inventario mínimo autorizado

- Programa de ingeniería y semestre actual;
- Carga académica percibida (`low` | `medium` | `high`);
- Dificultad percibida de organización y manejo del tiempo (`low` | `medium` | `high`);
- Asignaturas de dificultad autorreportadas;
- Disponibilidad semanal en minutos y bloques horarios preferidos;
- Prácticas de estudio y preferencias de tipo de apoyo;
- Valoración contextual sobre la continuidad universitaria (cuestionario/entrevista);
- Telemetría pseudonimizada de interacción (16 tipos de eventos canónicos);
- Respuestas a instrumentos aprobados del piloto (QoE ISO 9241-11 / ISO 9241-210).

---

## 4. Datos locales en la PWA

- IndexedDB almacena únicamente el estado necesario para la continuidad local-first del estudiante autenticado.
- No se replican hashes de contraseña ni datos de otros usuarios en el almacenamiento local.
- El cierre de sesión (`logout`) y el retiro de consentimiento (`withdraw`) limpian inmediatamente el snapshot local de la PWA.
