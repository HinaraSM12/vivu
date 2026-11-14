# ADR-006: Ingesta multifuente, moderación, procedencia, versionamiento y extracción estructurada con LLM para el catálogo de recursos institucionales

- **Estado:** Aprobado
- **Fecha:** 2026-11-10
- **Contexto:** Alineación integral del prototipo Vivu con el proyecto de tesis actualizado y la revisión sistemática PRISMA 2020 (V5)

---

## 1. Contexto y problema

La revisión sistemática PRISMA 2020 (V5, $N = 57$ estudios empíricos primarios) identificó que uno de los principales vacíos de las plataformas universitarias de autorregulación y gamificación es su desconexión respecto a los servicios y recursos institucionales reales (monitorías, tutorías, asesorías, talleres, bienestar, convocatorias, semilleros, bibliotecas y programas como *Minas Contigo*).

Asimismo, en el contexto real de la Facultad de Minas (Universidad Nacional de Colombia, Sede Medellín), la oferta de apoyos institucionales no reside en una única base de datos centralizada: se publica en páginas web oficiales, se difunde mediante correos institucionales y es creada o actualizada directamente por profesores y dependencias administrativas.

Depender de una sola fuente estática dejaría obsoleto el catálogo durante las 10 semanas del piloto; por el contrario, permitir que un modelo de lenguaje grande (LLM) invente recursos o que un scraper no supervisado publique información sin moderación violaría las salvaguardas éticas y de calidad del sistema.

---

## 2. Decisión arquitectónica

Se adopta una arquitectura de **Catálogo Estructurado, Moderado y Multifuente de Recursos Institucionales** dentro de `resource-service` (con asistencia instrumental de extracción estructurada en `recommendation-ai-service`), regida por las siguientes decisiones:

### 2.1. Fuentes autorizadas del catálogo (`source_type`)

El catálogo recibe información mediante seis tipos formales de fuente (`ResourceSourceType`):

1. `WEB_OFFICIAL`: Páginas públicas oficiales de la UNAL y la Facultad de Minas procesadas mediante `InstitutionalWebCollector`.
2. `MAIL_AUTHORIZED`: Comunicaciones institucionales autorizadas procesadas mediante `InstitutionalMailConnector`.
3. `MANUAL_PROFESSOR`: Registro manual directo por profesores o colaboradores autorizados (`PROFESSOR` / `RESOURCE_CONTRIBUTOR`).
4. `MANUAL_ADMIN`: Registro manual directo por administradores (`ADMIN` / `ADMINISTRATOR`).
5. `MANUAL_RESEARCHER`: Registro manual por el rol opcional de investigación (`RESEARCHER`) en contextos autorizados del piloto.
6. `OTHER_AUTHORIZED`: Otras integraciones institucionales formalmente autorizadas.

### 2.2. `InstitutionalWebCollector` y política de lista blanca

- Opera exclusivamente sobre una **lista blanca (`WHITELIST`)** configurable de dominios y rutas públicas oficiales:
  - Facultad de Minas (`minas.medellin.unal.edu.co`)
  - Sede Medellín (`medellin.unal.edu.co`)
  - Bienestar Universitario
  - Monitorías y tutorías académicas
  - Sistema de Bibliotecas
  - Programas curriculares y direcciones de escuela
  - Eventos, convocatorias y apoyos estudiantiles
  - *Minas Contigo*, cuando exista fuente pública válida
- **Prohibición de rastreo indiscriminado:** Nunca rastrea de forma abierta toda la web de la UNAL.
- **Política operativa obligatoria:**
  - Procesa únicamente páginas públicas sin evadir autenticación ni controles de acceso;
  - Respeta frecuencias razonables de consulta (`rate limiting` y ventana mínima entre recolecciones);
  - Conserva `source_url`, `fetched_at` y `last_verified_at`;
  - Valida vigencia temporal (`start_date`, `end_date`);
  - Detecta duplicados antes de crear registros;
  - Registra errores técnicos por fuente;
  - Permite habilitar o deshabilitar fuentes individuales desde administración.

### 2.3. `InstitutionalMailConnector` y sanitización previa de datos personales (PII)

- **Prohibiciones estrictas:**
  - NO realizar scraping general de la interfaz web del correo;
  - NO leer indiscriminadamente todo el buzón de una cuenta.
- **Mecanismos autorizados de conexión:** API oficial o IMAP autorizado por el proveedor institucional, operando exclusivamente sobre:
  - **A. Carpeta dedicada** (p. ej., `Recursos plataforma`);
  - **B. Lista blanca de remitentes institucionales autorizados**;
  - **C. Buzón dedicado exclusivamente a la plataforma**; o
  - **D. Reenvío manual controlado**.
- **Sanitización obligatoria previa al LLM (`MailPiiSanitizer`):**
  Antes de enviar cualquier fragmento de correo al componente LLM para extracción estructurada, el conector elimina o enmascara obligatoriamente:
  - nombres personales de terceros o estudiantes;
  - correos electrónicos personales;
  - números de documento de identidad;
  - firmas personales y cargos privados;
  - números telefónicos privados;
  - cadenas o hilos de conversación previos (`Re:`, `Fwd:`, citas anidadas);
  - información irrelevante y archivos adjuntos privados.
  Solo se conserva el texto descriptivo público del recurso institucional.

### 2.4. Registro directo por Profesores (`PROFESSOR` / `RESOURCE_CONTRIBUTOR`) y Administradores (`ADMIN`)

Para que la plataforma no dependa exclusivamente de automatización, scraping o correo, los roles `PROFESSOR` (`RESOURCE_CONTRIBUTOR`) y `ADMIN` pueden registrar y mantener recursos manualmente (monitorías, asesorías, tutorías, grupos de estudio, actividades académicas, talleres, charlas, convocatorias, becas, eventos, actividades de bienestar, semilleros, servicios institucionales, recursos bibliográficos y actividades de integración).

- **Permisos de `PROFESSOR` / `RESOURCE_CONTRIBUTOR`:**
  - Crear recursos;
  - Editar únicamente los recursos que haya creado;
  - Indicar destinatarios (`target_population`, `programs`, `semesters`), vigencia (`start_date`, `end_date`), horarios (`schedule`), enlaces (`registration_url`, `source_url`), ubicación (`location`), modalidad (`modality`) y contacto institucional (`contact`);
  - Enviar el recurso a revisión (`DRAFT` $\rightarrow$ `PENDING_REVIEW`);
  - Desactivar o actualizar sus recursos cuando pierdan vigencia.
  - *Extensibilidad futura:* La arquitectura contempla el atributo opcional `trustLevel = TRUSTED_CONTRIBUTOR` para permitir en el futuro publicación directa a determinadas dependencias sin requerir su activación obligatoria en el MVP.
- **Permisos de `ADMIN` (`ADMINISTRATOR`):**
  - Crear, editar, aprobar, rechazar, publicar, despublicar, archivar y marcar recursos como vencidos;
  - Gestionar categorías, fuentes web en lista blanca y remitentes de correo autorizados;
  - Revisar recursos extraídos automáticamente (`NEEDS_REVIEW` / `PENDING_REVIEW`);
  - Fusionar duplicados preservando la trazabilidad de ambas fuentes;
  - Gestionar usuarios con rol de colaborador y atender reportes estudiantiles de recursos desactualizados o incorrectos.

### 2.5. Estados y flujo de publicación y moderación

Todo recurso tiene un estado formal dentro del conjunto:

`DRAFT` | `PENDING_REVIEW` | `NEEDS_REVIEW` | `APPROVED` | `PUBLISHED` | `REJECTED` | `EXPIRED` | `ARCHIVED`

- **Flujo manual por profesor:**
  `Profesor crea recurso` $\rightarrow$ `DRAFT` $\rightarrow$ `SUBMIT` $\rightarrow$ `PENDING_REVIEW` $\rightarrow$ `Administrador verifica` $\rightarrow$ `APPROVED` / `REJECTED` $\rightarrow$ `PUBLISHED`.
- **Flujo automático (Web Collector / Mail Connector):**
  Ningún recurso extraído automáticamente se publica sin validación; ingresa como `NEEDS_REVIEW` o `PENDING_REVIEW` según el nivel de confianza de la fuente.
- **Publicación directa en el MVP:** Los administradores autorizados (`ADMIN`) pueden publicar directamente (`MANUAL_ADMIN` $\rightarrow$ `PUBLISHED`) tras verificar la lista de chequeo de calidad.
- **Lista de verificación de moderación y calidad (previa a `PUBLISHED`):**
  1. El recurso existe realmente;
  2. Es institucionalmente pertinente para estudiantes de ingeniería;
  3. Tiene fechas de vigencia válidas;
  4. Tiene unidad o responsable institucional identificable (`owner_unit`);
  5. Cuenta con fuente o evidencia verificable;
  6. Define público objetivo (`target_population`, `programs`, `semesters`);
  7. Contiene datos suficientes para la acción del estudiante;
  8. No contiene datos personales innecesarios.

### 2.6. Entidad estructurada `Resource`, Procedencia (`Provenance`) y Versionamiento (`resource_versions`)

La entidad `Resource` incorpora los 26 atributos canónicos:
`resource_id`, `title`, `category`, `description`, `target_population`, `eligibility`, `programs`, `semesters`, `start_date`, `end_date`, `schedule`, `location`, `modality`, `contact`, `registration_url`, `source_url`, `source_type`, `source_name`, `owner_unit`, `created_at`, `updated_at`, `fetched_at`, `last_verified_at`, `status`, `created_by`, `verified_by`, `published_by` (más `source_message_id` opcional y `version`).

Cada modificación sobre campos críticos (`schedule`, `start_date`, `end_date`, `description`, `eligibility`, `location`, `status`) inserta un registro inmutable en `resource_versions`:
- `version_id`
- `resource_id`
- `previous_value` (JSONB)
- `new_value` (JSONB)
- `changed_by`
- `changed_at`
- `reason`

### 2.7. Detección de duplicados y jerarquía configurable de fuente prioritaria

Cuando una misma monitoría o apoyo es registrada por un profesor y además capturada por `InstitutionalWebCollector` o `InstitutionalMailConnector`, el detector de duplicados evalúa similitud compuesta sobre:
`title` + `owner_unit` + `start_date`/`end_date` + `source_url`/`registration_url` + `location` + `category`.

No se muestran entradas duplicadas al estudiante; se vinculan las fuentes en el registro de procedencia y se aplica una **jerarquía configurable de fuente prioritaria**:
1. Dato actualizado manualmente por responsable autorizado (`MANUAL_PROFESSOR` verificado / `MANUAL_ADMIN`);
2. Página institucional oficial (`WEB_OFFICIAL`);
3. Comunicación institucional autorizada (`MAIL_AUTHORIZED`);
4. Extracción automática pendiente de verificar (`NEEDS_REVIEW`).

### 2.8. Extracción estructurada con LLM y prohibición absoluta de recursos inventados

Cuando una fuente autorizada contiene texto en lenguaje natural, el LLM transforma el texto (previamente sanitizado) en un objeto JSON validado estrictamente contra el esquema:

```json
{
  "title": "",
  "category": "",
  "target_population": "",
  "eligibility": "",
  "start_date": "",
  "end_date": "",
  "schedule": "",
  "location": "",
  "contact": "",
  "registration_url": "",
  "institution": "",
  "source": ""
}
```

**Regla dura inquebrantable:** Toda recomendación mostrada al estudiante debe referenciar un `resource_id` existente en el catálogo con `status = PUBLISHED` (o `ACTIVE` equivalente). Si no existe `resource_id` publicado y vigente, el sistema tiene prohibido recomendarlo como recurso institucional real.

---

## 3. Consecuencias

- **Positivas:** El catálogo combina sostenibilidad operativa (web + correo + profesores + administradores) con trazabilidad auditable, cero alucinaciones de recursos inexistentes y protección estricta de datos personales.
- **Costos asumidos:** Se incorporan estados de moderación, tabla de versiones (`resource_versions`) y el rol `PROFESSOR` (`RESOURCE_CONTRIBUTOR`) en los contratos de identidad y recursos.

