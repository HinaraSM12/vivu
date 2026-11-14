from fastapi import FastAPI, HTTPException

from recommendation_service.config import get_settings
from recommendation_service.engine import (
    ControlledContextualLLMProvider,
    DisabledLLMProvider,
    ExtractedResourceResponse,
    ExtractResourceRequest,
    FailingOrHallucinatingLLMProvider,
    GenerateRecommendationsRequest,
    LLMProvider,
    RecommendationActionInput,
    RecommendationEngine,
    RecommendationItem,
    RecommendationTraceRecord,
    sanitize_email_content_before_llm,
)

get_settings()

app = FastAPI(
    title="Vivu Recommendation Service",
    description="Servicio híbrido determinista + LLM instrumental de recomendaciones de Vivu.",
    version="1.0.0",
)

engine = RecommendationEngine()


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": "recommendation-service"}


@app.get("/ready", tags=["health"])
def ready() -> dict[str, str]:
    return {"status": "ready", "service": "recommendation-service"}


@app.post(
    "/recommendations/generate",
    response_model=list[RecommendationItem],
    tags=["recommendations"],
)
def generate_recommendations(
    payload: GenerateRecommendationsRequest,
) -> list[RecommendationItem]:
    provider: LLMProvider
    if payload.llm_mode == "contextual":
        provider = ControlledContextualLLMProvider()
    elif payload.llm_mode == "simulate_failure":
        provider = FailingOrHallucinatingLLMProvider()
    else:
        provider = DisabledLLMProvider()
    return engine.generate_for_student(payload.context, provider)


@app.get(
    "/students/{student_id}/recommendations",
    response_model=list[RecommendationItem],
    tags=["recommendations"],
)
def get_student_recommendations(student_id: str) -> list[RecommendationItem]:
    return engine.list_for_student(student_id)


@app.post(
    "/recommendations/{recommendation_id}/action",
    response_model=RecommendationItem,
    tags=["recommendations"],
)
def record_recommendation_action(
    recommendation_id: str,
    payload: RecommendationActionInput,
) -> RecommendationItem:
    try:
        return engine.record_action(recommendation_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get(
    "/recommendations/traces",
    response_model=list[RecommendationTraceRecord],
    tags=["recommendations"],
)
def list_recommendation_traces() -> list[RecommendationTraceRecord]:
    return engine.list_traces()


@app.post(
    "/extract-resource",
    response_model=ExtractedResourceResponse,
    tags=["resources"],
)
def extract_resource_from_text(
    payload: ExtractResourceRequest,
) -> ExtractedResourceResponse:
    sanitized = sanitize_email_content_before_llm(payload.raw_text)
    return ExtractedResourceResponse(
        sanitized_input=sanitized,
        extracted={
            "title": "Recurso institucional extraído para revisión",
            "category": "INSTITUTIONAL_RESOURCES",
            "target_population": "Estudiantes de pregrado Facultad de Minas",
            "eligibility": "Matrícula activa",
            "start_date": "",
            "end_date": "",
            "schedule": "Por verificar en moderación humana",
            "location": "Facultad de Minas — UNAL Medellín",
            "contact": "[EMAIL_REDACTED]",
            "registration_url": "",
            "institution": "Universidad Nacional de Colombia - Sede Medellín",
            "source": payload.source_name,
        },
        status="PENDING_REVIEW",
    )
