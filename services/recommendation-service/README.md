# Recomendaciones — recommendation-service

[Inicio](../../README.md) · [Auditoría y hallazgos compartidos](../../docs/auditoria-arquitectura.md)

## Propósito y estado

Servicio FastAPI que genera recomendaciones mediante puntuación y reglas, registra acciones y trazas y ofrece extracción de recursos con sanitización. Los proveedores contextuales y de fallo son implementaciones controladas; no se evidencia un proveedor LLM externo en este flujo. El motor conserva resultados y trazas en memoria. El gateway contiene su propio motor y no se identificó una llamada a este servicio.

## Interfaces y dependencias

`POST /recommendations/generate`, `GET /students/{student_id}/recommendations`, `POST /recommendations/{recommendation_id}/action`, `GET /recommendations/traces`, `POST /extract-resource`, `GET /health` y `GET /ready`. FastAPI publica su documentación interactiva; Compose solo lo expone en su red interna. PostgreSQL y RabbitMQ se configuran en Compose, pero la configuración no demuestra su uso por el motor.

## Configuración y ejecución

| Variable | Condición |
| --- | --- |
| `RECOMMENDATION_ENV` | `development` por defecto; admite `development`, `test`, `production`. |
| `RECOMMENDATION_PORT` | Entero entre 1 y 65535; 8000 por defecto. Es configuración validada; al ejecutar Uvicorn hay que indicar también `--port`. |
| `RECOMMENDATION_DATABASE_URL`, `RECOMMENDATION_RABBITMQ_URL` | Opcionales; URL validadas si se proporcionan. |
| `LLM_PROVIDER` | `disabled` por defecto; validado como texto. La selección del proveedor en la API depende de `llm_mode` de la solicitud. |
| `LLM_API_KEY` | Aparece en el ejemplo, pero no está declarada en `Settings` ni se evidencia su uso en el proveedor controlado. |

Consulta [`.env.example`](.env.example). Desde la raíz, instalar con `python -m pip install -e 'services/recommendation-service[dev]'` y ejecutar `python -m uvicorn recommendation_service.main:app --app-dir services/recommendation-service/src --reload --port 8000`.

## Calidad y mejoras

**Adecuación y seguridad:** hay reglas, explicaciones y sanitización probadas en el motor; esto no acredita seguridad integral ni un LLM real. **Fiabilidad:** recomendaciones y trazas se pierden al reiniciar. **Mantenibilidad:** las pruebas Python verifican motor, configuración y salud, no integración real con el gateway.

**Prioridad propuesta:** decidir un único motor propietario y conectar su contrato, persistir acciones y trazas, y probar el comportamiento ante fallos y datos sensibles. Ver la [auditoría](../../docs/auditoria-arquitectura.md).
