# Historias de usuario V1

Las historias están organizadas por actor. Los criterios completos viven en `acceptance-criteria.md`.

## STUDENT

### US-STU-01 - Consentimiento
**Como** estudiante participante, **quiero** conocer y aceptar las condiciones de tratamiento y uso de IA, **para** decidir voluntariamente si participo.

- La versión aceptada queda registrada con fecha.
- El sistema permite retirar el consentimiento.
- Sin consentimiento vigente no se inicia el flujo de personalización del piloto.

### US-STU-02 - Onboarding
**Como** estudiante, **quiero** configurar un perfil mínimo, **para** recibir misiones pertinentes sin entregar información innecesaria.

### US-STU-03 - Semana actual
**Como** estudiante, **quiero** ver una vista simple de mi semana, **para** entender qué acciones pequeñas puedo realizar ahora.

### US-STU-04 - Gestionar misión
**Como** estudiante, **quiero** aceptar, iniciar, posponer, descartar o completar una misión, **para** mantener autonomía sobre mi plan.

### US-STU-05 - Progreso personal
**Como** estudiante, **quiero** ver mi progreso individual, **para** reconocer avances sin compararme públicamente con otros.

### US-STU-06 - Recuperación
**Como** estudiante con baja continuidad, **quiero** un modo de recuperación de menor carga, **para** retomar sin sentir castigo por una interrupción.

### US-STU-07 - Recomendación explicada
**Como** estudiante, **quiero** saber por qué se me recomienda una misión o recurso, **para** decidir si me resulta pertinente.

### US-STU-08 - Recursos institucionales
**Como** estudiante, **quiero** consultar apoyos autorizados y vigentes, **para** convertir una necesidad en una acción concreta.

### US-STU-09 - Microcuestionario
**Como** participante, **quiero** responder un seguimiento breve, **para** aportar información sobre utilidad, pertinencia, carga y dificultades.

### US-STU-10 - Privacidad y preferencias
**Como** estudiante, **quiero** revisar preferencias de personalización y privacidad, **para** mantener control sobre mi participación.

## FACILITATOR

### US-FAC-01 - Ver asignados
**Como** facilitador, **quiero** ver únicamente estudiantes asignados, **para** acompañar sin acceder a participantes ajenos.

### US-FAC-02 - Seguimiento limitado
**Como** facilitador, **quiero** ver señales de continuidad y actividad permitida, **para** orientar el acompañamiento sin etiquetas absolutas de riesgo.

### US-FAC-03 - Nota de acompañamiento
**Como** facilitador, **quiero** registrar una nota, **para** conservar contexto de una interacción de apoyo.

### US-FAC-04 - Compromisos
**Como** facilitador, **quiero** crear y cerrar compromisos, **para** dar continuidad al acompañamiento humano.

### US-FAC-05 - Consultar recursos
**Como** facilitador, **quiero** consultar el catálogo institucional autorizado, **para** orientar al estudiante con información válida.

## ADMIN

### US-ADM-01 - Usuarios y roles
**Como** administrador, **quiero** gestionar cuentas, roles y estados, **para** operar el piloto.

### US-ADM-02 - Asignaciones
**Como** administrador, **quiero** asignar estudiantes a facilitadores, **para** controlar el alcance de acceso del acompañamiento.

### US-ADM-03 - Catálogo de misiones
**Como** administrador, **quiero** crear, editar, versionar, publicar y desactivar misiones, **para** ajustar la intervención sin cambiar código.

### US-ADM-04 - Recursos
**Como** administrador, **quiero** mantener recursos institucionales autorizados y vigentes, **para** impedir recomendaciones basadas en información obsoleta o inventada.

### US-ADM-05 - Reglas de ludificación
**Como** administrador, **quiero** configurar parámetros permitidos y versiones de reglas, **para** mantener cambios auditables.

### US-ADM-06 - Recomendador
**Como** administrador, **quiero** ajustar pesos y límites seguros del recomendador, **para** experimentar de forma controlada y reproducible.

### US-ADM-07 - Microcuestionarios
**Como** administrador, **quiero** versionar y publicar instrumentos breves, **para** recolectar seguimiento longitudinal consistente.

### US-ADM-08 - Analítica
**Como** administrador, **quiero** ver métricas agregadas del piloto, **para** detectar problemas de funcionamiento y continuidad sin convertir el sistema en vigilancia.

### US-ADM-09 - Exportación
**Como** administrador, **quiero** exportar datos seudonimizados/anonimizados, **para** analizarlos en el estudio sin incluir identificadores innecesarios.

### US-ADM-10 - Auditoría
**Como** administrador, **quiero** revisar cambios sensibles, **para** reconstruir quién modificó reglas, roles, configuraciones o exportaciones.

## Historias técnicas transversales

### US-TEC-01 - Observabilidad
Como equipo de desarrollo, necesitamos correlation IDs, health checks y métricas mínimas para diagnosticar fallos sin registrar datos personales innecesarios.

### US-TEC-02 - Contratos
Como equipo de desarrollo, necesitamos OpenAPI y esquemas de eventos versionados para que los microservicios evolucionen sin acoplamiento implícito.

### US-TEC-03 - Fallback IA
Como sistema, necesitamos mantener recomendaciones determinísticas cuando el LLM no esté disponible para que una dependencia externa no bloquee el flujo central.


## PWA / OFFLINE

### US-PWA-01 - Continuar sin conexión
**Como** estudiante previamente sincronizado, **quiero** abrir la PWA y continuar mis flujos esenciales sin conexión, **para** no depender de conectividad continua.

### US-PWA-02 - Sincronizar acciones pendientes
**Como** estudiante, **quiero** que las acciones realizadas offline se sincronicen automáticamente y sin duplicados al volver la conexión, **para** confiar en que mi progreso no se pierde.

### US-PWA-03 - Comprender el estado de sincronización
**Como** estudiante, **quiero** saber si una acción está guardada en el dispositivo, pendiente o sincronizada, **para** entender el estado sin recibir mensajes alarmistas.

### US-PWA-04 - Resolver conflictos de forma explícita
**Como** estudiante, **quiero** revisar un conflicto cuando el mismo dato cambió en servidor y dispositivo, **para** evitar que el sistema sobrescriba información silenciosamente.

### US-PWA-05 - Recomendación offline
**Como** estudiante sin conexión, **quiero** obtener una recomendación determinística a partir de reglas y contenido ya sincronizados, **para** continuar recibiendo apoyo sin depender del LLM.

### US-PWA-06 - Lectura limitada del facilitador
**Como** facilitador, **quiero** poder consultar de forma limitada información cacheada previamente cuando se corte la red, **para** mantener contexto, sin crear notas/compromisos offline.

### US-PWA-07 - Administración segura online
**Como** administrador, **quiero** que las mutaciones administrativas requieran conexión y validación del servidor, **para** evitar conflictos de configuración sensibles.
