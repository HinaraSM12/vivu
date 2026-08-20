# Privacidad, consentimiento y ética por diseño

## Alcance

Este documento traduce los principios éticos del proyecto a requisitos de software. No sustituye revisión jurídica o aprobación ética institucional.

## Principios

1. Participación voluntaria.
2. Consentimiento informado y versionado.
3. Posibilidad de retiro.
4. Minimización de datos.
5. Control de acceso.
6. Transparencia de IA y recomendaciones.
7. Agencia del estudiante.
8. No etiquetado público de riesgo.
9. Uso de recursos institucionales autorizados.
10. Analítica orientada a validación, no vigilancia.

## Inventario mínimo permitido

- programa y semestre;
- carga percibida;
- materias de dificultad autorreportadas;
- disponibilidad;
- responsabilidades externas cuando sea pertinente;
- prácticas de estudio;
- actividad en el prototipo;
- misiones y recuperación;
- recursos consultados;
- respuestas a instrumentos aprobados.

Calificaciones, historia académica restringida, datos sensibles adicionales o integraciones institucionales requieren aprobación formal previa.

## Consentimiento

El sistema guarda:
- `consentVersion`;
- estado;
- fecha de aceptación;
- fecha de retiro si aplica.

La UI debe explicar de forma separable: participación, analítica del prototipo, personalización y uso de proveedor LLM cuando corresponda.

## Retiro

El flujo debe:
1. confirmar intención;
2. marcar retiro;
3. detener nuevos tratamientos definidos por ese consentimiento;
4. invalidar personalización futura si aplica;
5. registrar auditoría;
6. informar el tratamiento de datos ya recolectados según la política aprobada para el estudio.

## Seudonimización

Analytics usa un `analytics_subject_id` que no sea el email ni un código institucional. La tabla que relaciona identidad y sujeto analítico queda fuera del dominio analytics.

## Exportaciones

Por defecto excluir:
- email;
- hashes/credenciales;
- refresh sessions;
- IDs internos innecesarios;
- contenido libre de notas de facilitador salvo aprobación metodológica explícita.

Toda exportación registra actor, alcance, timestamp y hash/identificador del artefacto.

## IA

- enviar contexto mínimo;
- explicar recomendaciones;
- no registrar prompts completos con PII en logs comunes;
- no permitir decisiones obligatorias;
- permitir descartar recomendaciones;
- no usar lenguaje diagnóstico o coercitivo.

## Revisión antes del piloto

- consentimiento final aprobado;
- inventario de datos validado;
- retención y eliminación documentadas;
- acceso por rol probado;
- exportación inspeccionada;
- payload LLM inspeccionado;
- backups y restauración documentados;
- incident response básico definido.


## Datos locales en la PWA

- IndexedDB contiene solo datos necesarios para la experiencia offline del usuario autenticado.
- No replicar credenciales, hashes ni datos administrativos en el cache STUDENT.
- Cache Storage se limita a app shell/activos y recursos explícitamente seguros; no es el almacén general de respuestas autenticadas.
- Mostrar `lastSuccessfulSyncAt` cuando la vigencia del dato importe.
- Logout y retiro de consentimiento ejecutan la política de limpieza/inutilización local correspondiente.
- La ventana máxima de acceso offline debe fijarse antes del piloto según el entorno de dispositivos y riesgo.
- Una revocación realizada mientras el dispositivo está offline se aplica en cuanto el servidor pueda revalidar la sesión; por ello el sistema no debe prometer autorización offline indefinida.
