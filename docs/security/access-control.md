# Control de acceso y RBAC

## Roles

- `STUDENT`: datos y acciones propias.
- `FACILITATOR`: estudiantes con asignación activa y funciones de acompañamiento.
- `ADMIN`: administración global del prototipo y operación del piloto.

No existe `RESEARCHER`.

## Autorización en capas

1. Gateway valida token, audiencia, issuer y rol general.
2. Servicio dueño del recurso aplica autorización de dominio.
3. Para facilitación, rol no basta: se verifica asignación activa.
4. Para datos propios, `subjectId` se deriva del token/relación, no de un parámetro confiado del cliente.

## Claims JWT sugeridos

```json
{
  "sub": "user-uuid",
  "roles": ["STUDENT"],
  "iss": "student-support-platform",
  "aud": "student-support-web",
  "iat": 0,
  "exp": 0,
  "jti": "uuid"
}
```

No incluir perfil académico completo en el JWT.

## Matriz resumida

| Recurso/acción | STUDENT | FACILITATOR | ADMIN |
|---|:---:|:---:|:---:|
| Perfil propio | R/W | - | soporte limitado |
| Misiones propias | R/W estado | - | configura catálogo |
| Progreso propio | R | - | agregado/soporte |
| Estudiantes asignados | - | R | R |
| Notas/compromisos | - | R/W asignados | R/W excepcional |
| Recursos | R | R | CRUD |
| Reglas de ludificación | - | - | CRUD/versionado |
| Config recomendador | - | - | CRUD/versionado |
| Surveys | responder | - | CRUD/versionado |
| Analítica | propia limitada | asignados limitada | global |
| Exportación | - | - | crear/descargar |
| Roles | - | - | administrar |

## Casos negativos obligatorios

- STUDENT accede a otro `studentId` -> 403/404 consistente.
- FACILITATOR sin asignación -> 403.
- FACILITATOR modifica configuración -> 403.
- Token expirado -> 401.
- Refresh token reutilizado después de rotación -> revocar cadena según política.
- Usuario deshabilitado -> no crear nuevas sesiones.

## Service-to-service

V1 debe preparar autenticación interna. No confiar únicamente en que el servicio está en una red Docker privada. Antes del piloto desplegado, definir credenciales/mTLS/token de servicio según infraestructura seleccionada.

## Auditoría

Auditar al menos:
- cambios de roles;
- asignaciones;
- cambios en misión/reglas/config IA;
- exportaciones;
- cambios de consentimiento;
- acciones ADMIN sensibles.


## Autorización offline

- No existe login nuevo offline.
- STUDENT puede acceder a su réplica local dentro de una ventana de acceso offline configurable después de una sesión online válida.
- FACILITATOR solo dispone de lectura cacheada limitada; no se crean notas/compromisos offline.
- ADMIN no realiza mutaciones offline.
- Al reconectar, toda outbox se somete nuevamente a autenticación/autorización del servidor antes de ser aplicada.
- Un rol revocado o consentimiento retirado provoca rechazo de acciones pendientes que ya no estén autorizadas.
