# ADR-001: Microservicios por dominio desde V1

**Estado:** Aceptado  
**Fecha:** 2026-08-19

## Contexto

El proyecto requiere separar identidad, ludificación, recomendaciones/IA, recursos, acompañamiento y analítica. El marco arquitectónico de origen ya distingue presentación, motor lúdico, IA, eventos y persistencia. El usuario decidió explícitamente utilizar microservicios.

## Decisión

Construir V1 como microservicios por dominio detrás de un API Gateway. No crear un microservicio por pantalla ni dividir responsabilidades sin necesidad clara.

## Consecuencias positivas

- límites explícitos y ownership de datos;
- IA puede usar Python sin contaminar servicios Node;
- fallos/escala de IA y analítica se desacoplan;
- preparación para evolución institucional.

## Consecuencias negativas

- mayor complejidad local, despliegue y testing;
- contratos y observabilidad son obligatorios;
- transacciones distribuidas requieren diseño cuidadoso.

## Mitigaciones

Docker Compose, monorepo, estándares compartidos, OpenAPI, eventos versionados y evitar servicios adicionales sin ADR.
