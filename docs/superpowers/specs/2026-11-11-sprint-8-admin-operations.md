# Especificación Técnica — Sprint 8: Administración y Operación del Piloto (`ADMIN`)

## 1. Objetivo del Sprint
Implementar las capacidades operativas y de gobernanza del rol `ADMIN` en `@vivu/contracts`, `@vivu/api-gateway` (`/api/v1/admin/*`) y `@vivu/web` (`ADM-01..ADM-05`), garantizando:
1. **Mutaciones administrativas exclusivamente online (`ADR-005`):** Toda mutación administrativa rechaza solicitudes marcadas en modo `OFFLINE` (`409 ADMIN_OFFLINE_MUTATION_FORBIDDEN`).
2. **Configuración auditable de reglas y feature flags (`PB-025`):** Validación de suma unitaria (`1.00`) en los pesos del recomendador determinista, control de `llmContextualizationEnabled` y registro en bitácora de auditoría (`AdminAuditLogEntryDto`).
3. **Exportación de investigación seudonimizada sin PII (`PB-026` / `ADR-003`):** Generación de paquetes de datos longitudinales con `participantIdPseudonym` verificando ausencia total de `email`, `fullName`, `phone` o documento de identidad.

