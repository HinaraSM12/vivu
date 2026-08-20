from fastapi import FastAPI

from recommendation_service.config import get_settings

get_settings()

app = FastAPI(
    title="Vivu Recommendation Service",
    description="Contrato inicial del servicio de recomendaciones de Vivu.",
    version="0.1.0",
)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": "recommendation-service"}


@app.get("/ready", tags=["health"])
def ready() -> dict[str, str]:
    return {"status": "ready", "service": "recommendation-service"}
