from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Literal, Protocol

from pydantic import BaseModel, Field

RecommendationSource = Literal["ONLINE_RULES", "ONLINE_AI", "OFFLINE_RULES"]
RecommendationReasonCode = Literal[
    "PRIORITY_ALIGNMENT",
    "TIME_FIT",
    "RECOVERY_LIGHT_LOAD",
    "VERIFIED_RESOURCE_MATCH",
    "CONTINUITY_REENGAGEMENT",
]
StudentActionType = Literal[
    "ACCEPT",
    "REJECT",
    "POSTPONE",
    "EDIT",
    "DISMISS_SIMILAR",
]
EffortLevel = Literal["LOW", "MEDIUM", "HIGH"]
ResourceStatus = Literal[
    "DRAFT",
    "PENDING_REVIEW",
    "NEEDS_REVIEW",
    "APPROVED",
    "PUBLISHED",
    "REJECTED",
    "EXPIRED",
    "ARCHIVED",
]

FORBIDDEN_STIGMATIZING_TERMS: tuple[str, ...] = (
    "desertor",
    "deserción inminente",
    "alto riesgo de abandono",
    "estudiante en riesgo",
    "fracaso académico",
    "incapaz",
    "diagnóstico depresivo",
    "trastorno clínico",
)


class MissionCandidate(BaseModel):
    mission_id: str
    title: str
    summary: str
    category: str
    effort: EffortLevel
    estimated_minutes: int = Field(ge=1)
    is_recovery_eligible: bool = False
    linked_resource_id: str | None = None


class ResourceCandidate(BaseModel):
    resource_id: str
    title: str
    category: str
    status: ResourceStatus
    schedule: str
    location: str


class StudentContextInput(BaseModel):
    student_id: str
    participant_id_pseudonym: str
    priority_categories: list[str] = Field(default_factory=list)
    available_minutes_per_day: int = Field(default=20, ge=5)
    preferred_tone: Literal["WARM", "DIRECT", "NEUTRAL"] = "WARM"
    perceived_load: Literal["LOW", "MEDIUM", "HIGH"] = "MEDIUM"
    recovery_mode_active: bool = False
    completed_mission_ids: list[str] = Field(default_factory=list)
    dismissed_mission_ids: list[str] = Field(default_factory=list)
    recent_active_categories: list[str] = Field(default_factory=list)


class ScoreBreakdown(BaseModel):
    need_fit: float
    time_fit: float
    difficulty_fit: float
    continuity_fit: float
    resource_fit: float
    diversity_fit: float


class RecommendationWeightConfig(BaseModel):
    version: str = "1.0.0"
    need_fit: float = 0.30
    time_fit: float = 0.20
    difficulty_fit: float = 0.15
    continuity_fit: float = 0.15
    resource_fit: float = 0.15
    diversity_fit: float = 0.05
    max_recommendations_per_run: int = 3


class RecommendationItem(BaseModel):
    recommendation_id: str
    student_id: str
    participant_id_pseudonym: str
    mission_id: str
    resource_id: str | None = None
    resource_title: str | None = None
    category: str
    effort: EffortLevel
    estimated_minutes: int
    title: str
    summary: str
    why_this_recommendation: str
    reason_code: RecommendationReasonCode
    score: float
    score_breakdown: ScoreBreakdown
    source: RecommendationSource
    rule_version: str
    prompt_version: str | None = None
    model_version: str | None = None
    fallback_used: bool = False
    student_action: StudentActionType | None = None
    edited_notes: str | None = None
    postponed_until: str | None = None
    shown_at: str
    acted_at: str | None = None


class RecommendationTraceRecord(BaseModel):
    recommendation_id: str
    participant_id_pseudonym: str
    resource_id: str | None = None
    mission_id: str | None = None
    reason_code: RecommendationReasonCode
    rule_version: str
    prompt_version: str | None = None
    model_version: str | None = None
    shown_at: str
    student_action: StudentActionType | None = None


class RecommendationActionInput(BaseModel):
    action: StudentActionType
    edited_notes: str | None = None
    postponed_until: str | None = None
    client_event_id: str | None = None


class GenerateRecommendationsRequest(BaseModel):
    context: StudentContextInput
    llm_mode: Literal["disabled", "contextual", "simulate_failure"] = "disabled"


class ExtractResourceRequest(BaseModel):
    raw_text: str
    source_name: str = "Correo institucional autorizado"


class ExtractedResourceResponse(BaseModel):
    sanitized_input: str
    extracted: dict[str, str]
    status: Literal["PENDING_REVIEW"] = "PENDING_REVIEW"


class LLMExplanationOutput(BaseModel):
    why_this_recommendation: str
    model_version: str
    prompt_version: str


class LLMProvider(Protocol):
    def explain_recommendation(
        self,
        mission: MissionCandidate,
        resource: ResourceCandidate | None,
        context: StudentContextInput,
        reason_code: RecommendationReasonCode,
    ) -> LLMExplanationOutput | None: ...


class DisabledLLMProvider:
    def explain_recommendation(
        self,
        mission: MissionCandidate,
        resource: ResourceCandidate | None,
        context: StudentContextInput,
        reason_code: RecommendationReasonCode,
    ) -> LLMExplanationOutput | None:
        return None


class ControlledContextualLLMProvider:
    model_version: str = "gemini-2.5-flash-controlled"
    prompt_version: str = "prompt-rec-v1.0.0"

    def explain_recommendation(
        self,
        mission: MissionCandidate,
        resource: ResourceCandidate | None,
        context: StudentContextInput,
        reason_code: RecommendationReasonCode,
    ) -> LLMExplanationOutput | None:
        resource_clause = (
            f" Incluye el recurso institucional verificado «{resource.title}»."
            if resource is not None
            else ""
        )
        if context.recovery_mode_active:
            rationale = (
                f"Seleccionamos «{mission.title}» porque activaste el modo recuperación "
                f"y requiere solo {mission.estimated_minutes} minutos de esfuerzo ligero."
                f"{resource_clause}"
            )
        else:
            rationale = (
                f"Te proponemos «{mission.title}» ({mission.estimated_minutes} min) "
                f"porque se alinea con tus prioridades actuales sin sobrecargar tu semana."
                f"{resource_clause}"
            )
        return LLMExplanationOutput(
            why_this_recommendation=rationale,
            model_version=self.model_version,
            prompt_version=self.prompt_version,
        )


class FailingOrHallucinatingLLMProvider:
    def explain_recommendation(
        self,
        mission: MissionCandidate,
        resource: ResourceCandidate | None,
        context: StudentContextInput,
        reason_code: RecommendationReasonCode,
    ) -> LLMExplanationOutput | None:
        raise RuntimeError("Simulated LLM timeout or ungrounded output")


def can_recommend_resource(resource: ResourceCandidate | None) -> bool:
    if resource is None or not resource.resource_id.strip():
        return False
    return resource.status == "PUBLISHED"


def is_non_stigmatizing_rationale(text: str) -> bool:
    lowered = text.lower()
    return all(term not in lowered for term in FORBIDDEN_STIGMATIZING_TERMS)


def sanitize_email_content_before_llm(raw_text: str) -> str:
    redacted = re.sub(
        r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
        "[EMAIL_REDACTED]",
        raw_text,
    )
    redacted = re.sub(
        r"\b(?:\+?57\s?)?(?:3\d{2}[\s-]?\d{3}[\s-]?\d{4})\b",
        "[PHONE_REDACTED]",
        redacted,
    )
    redacted = re.sub(
        r"\b(?:CC|TI|CE|Doc(?:umento)?)\s*[:#.]?\s*\d{6,12}\b",
        "[ID_REDACTED]",
        redacted,
        flags=re.IGNORECASE,
    )
    return redacted.strip()


def compute_score(
    breakdown: ScoreBreakdown,
    weights: RecommendationWeightConfig,
) -> float:
    raw = (
        weights.need_fit * breakdown.need_fit
        + weights.time_fit * breakdown.time_fit
        + weights.difficulty_fit * breakdown.difficulty_fit
        + weights.continuity_fit * breakdown.continuity_fit
        + weights.resource_fit * breakdown.resource_fit
        + weights.diversity_fit * breakdown.diversity_fit
    )
    return round(raw, 3)


def build_deterministic_rationale(
    mission: MissionCandidate,
    resource: ResourceCandidate | None,
    context: StudentContextInput,
    reason_code: RecommendationReasonCode,
) -> str:
    resource_note = (
        f" Vinculada al recurso verificado «{resource.title}» ({resource.schedule})."
        if resource is not None
        else ""
    )
    if reason_code == "RECOVERY_LIGHT_LOAD":
        return (
            f"Priorizada por regla determinista de modo recuperación: acción breve "
            f"de {mission.estimated_minutes} min y esfuerzo bajo sin penalización.{resource_note}"
        )
    if reason_code == "VERIFIED_RESOURCE_MATCH":
        return (
            f"Recomendada porque conecta tu meta en {mission.category} con un apoyo "
            f"institucional publicado y verificado.{resource_note}"
        )
    return (
        f"Sugerida por coincidencia con tu prioridad en {mission.category} y tu "
        f"disponibilidad diaria de {context.available_minutes_per_day} minutos.{resource_note}"
    )


DEFAULT_MISSION_CATALOG: tuple[MissionCandidate, ...] = (
    MissionCandidate(
        mission_id="MIS-PLAN-01",
        title="Mapa semanal de 3 entregas clave",
        summary="Identifica tus tres entregas o parciales más cercanos y asígnales un bloque.",
        category="ACADEMIC_PLANNING",
        effort="LOW",
        estimated_minutes=10,
        is_recovery_eligible=True,
        linked_resource_id="RES-ACAD-01",
    ),
    MissionCandidate(
        mission_id="MIS-HAB-01",
        title="Bloque de enfoque de 25 minutos sin distracciones",
        summary="Realiza una sesión breve de estudio concentrado en una sola asignatura.",
        category="STUDY_HABITS",
        effort="LOW",
        estimated_minutes=25,
        is_recovery_eligible=True,
        linked_resource_id="RES-ACAD-02",
    ),
    MissionCandidate(
        mission_id="MIS-RES-01",
        title="Explorar una monitoría o taller académico verificado",
        summary="Revisa los horarios de acompañamiento académico publicados en la Facultad.",
        category="INSTITUTIONAL_RESOURCES",
        effort="LOW",
        estimated_minutes=10,
        is_recovery_eligible=True,
        linked_resource_id="RES-ACA-03",
    ),
    MissionCandidate(
        mission_id="MIS-WEL-01",
        title="Pausa de descarga y chequeo de carga semanal",
        summary="Registra tu nivel de carga percibida y realiza una pausa consciente de 10 min.",
        category="WELLBEING_HABITS",
        effort="LOW",
        estimated_minutes=10,
        is_recovery_eligible=True,
        linked_resource_id="RES-WEL-01",
    ),
    MissionCandidate(
        mission_id="MIS-REC-01",
        title="Retomar con un micro-paso de 10 minutos",
        summary="Elige una sola tarea pequeña pendiente y avanza durante 10 minutos sin presión.",
        category="RECOVERY_REENGAGEMENT",
        effort="LOW",
        estimated_minutes=10,
        is_recovery_eligible=True,
        linked_resource_id="RES-WEL-01",
    ),
    MissionCandidate(
        mission_id="MIS-PLAN-02",
        title="Desglose de proyecto de curso en 4 subtareas",
        summary="Divide un proyecto o laboratorio complejo en pasos semanales manejables.",
        category="ACADEMIC_PLANNING",
        effort="MEDIUM",
        estimated_minutes=25,
        is_recovery_eligible=False,
        linked_resource_id="RES-ACAD-01",
    ),
    MissionCandidate(
        mission_id="MIS-HAB-02",
        title="Autoevaluación de comprensión con 3 preguntas",
        summary="Formula y responde tres preguntas clave sobre el tema visto en clase.",
        category="STUDY_HABITS",
        effort="MEDIUM",
        estimated_minutes=20,
        is_recovery_eligible=False,
        linked_resource_id="RES-ARCH-01",
    ),
)

DEFAULT_RESOURCE_CATALOG: dict[str, ResourceCandidate] = {
    "RES-ACAD-01": ResourceCandidate(
        resource_id="RES-ACAD-01",
        title="Taller de Planificación Académica y Gestión del Tiempo",
        category="ACADEMIC_PLANNING",
        status="PUBLISHED",
        schedule="Martes y jueves 10:00 a. m. - 12:00 m.",
        location="Bloque M3, Aula 204 — Facultad de Minas",
    ),
    "RES-ACAD-02": ResourceCandidate(
        resource_id="RES-ACAD-02",
        title="Monitorías Académicas de Ciencias Básicas e Ingeniería",
        category="STUDY_HABITS",
        status="PUBLISHED",
        schedule="Lunes a viernes 8:00 a. m. - 5:00 p. m.",
        location="Bloque M5, Sala de Estudio acompañada",
    ),
    "RES-ACA-03": ResourceCandidate(
        resource_id="RES-ACA-03",
        title="Asesoría de Estrategias de Aprendizaje y Preparación de Parciales",
        category="INSTITUTIONAL_RESOURCES",
        status="PUBLISHED",
        schedule="Miércoles 2:00 p. m. - 4:00 p. m.",
        location="Oficina de Acompañamiento Estudiantil — Facultad de Minas",
    ),
    "RES-WEL-01": ResourceCandidate(
        resource_id="RES-WEL-01",
        title="Escucha Activa y Regulación de Carga Académica — Bienestar Minas",
        category="WELLBEING_HABITS",
        status="PUBLISHED",
        schedule="Lunes a viernes 9:00 a. m. - 4:00 p. m.",
        location="Bienestar Universitario — Sede Facultad de Minas",
    ),
    "RES-ARCH-01": ResourceCandidate(
        resource_id="RES-ARCH-01",
        title="Convocatoria Histórica Expirada 2025-1",
        category="STUDY_HABITS",
        status="EXPIRED",
        schedule="Finalizada",
        location="Archivo",
    ),
}


@dataclass
class RecommendationEngine:
    weights: RecommendationWeightConfig = field(default_factory=RecommendationWeightConfig)
    missions: list[MissionCandidate] = field(default_factory=lambda: list(DEFAULT_MISSION_CATALOG))
    resources: dict[str, ResourceCandidate] = field(
        default_factory=lambda: dict(DEFAULT_RESOURCE_CATALOG)
    )
    _by_id: dict[str, RecommendationItem] = field(default_factory=dict)
    _by_student: dict[str, list[str]] = field(default_factory=dict)
    _traces: list[RecommendationTraceRecord] = field(default_factory=list)

    def generate_for_student(
        self,
        context: StudentContextInput,
        llm_provider: LLMProvider | None = None,
    ) -> list[RecommendationItem]:
        provider = llm_provider or DisabledLLMProvider()
        excluded = set(context.completed_mission_ids) | set(context.dismissed_mission_ids)

        eligible_missions: list[MissionCandidate] = []
        for mission in self.missions:
            if mission.mission_id in excluded:
                continue
            if context.recovery_mode_active and (
                not mission.is_recovery_eligible or mission.effort != "LOW"
            ):
                continue
            eligible_missions.append(mission)

        scored_candidates: list[
            tuple[
                float,
                MissionCandidate,
                ResourceCandidate | None,
                ScoreBreakdown,
                RecommendationReasonCode,
            ]
        ] = []

        for mission in eligible_missions:
            raw_resource = (
                self.resources.get(mission.linked_resource_id)
                if mission.linked_resource_id
                else None
            )
            verified_resource = raw_resource if can_recommend_resource(raw_resource) else None

            need_fit = (
                1.0
                if (
                    mission.category in context.priority_categories
                    or (
                        context.recovery_mode_active and mission.category == "RECOVERY_REENGAGEMENT"
                    )
                )
                else 0.65
            )
            time_fit = (
                1.0 if mission.estimated_minutes <= context.available_minutes_per_day else 0.55
            )
            if context.recovery_mode_active or context.perceived_load == "HIGH":
                difficulty_fit = 1.0 if mission.effort == "LOW" else 0.4
            else:
                difficulty_fit = 0.9 if mission.effort in ("LOW", "MEDIUM") else 0.7

            continuity_fit = 1.0 if context.recovery_mode_active else 0.85
            resource_fit = 1.0 if verified_resource is not None else 0.5
            diversity_fit = 0.6 if mission.category in context.recent_active_categories else 1.0

            breakdown = ScoreBreakdown(
                need_fit=need_fit,
                time_fit=time_fit,
                difficulty_fit=difficulty_fit,
                continuity_fit=continuity_fit,
                resource_fit=resource_fit,
                diversity_fit=diversity_fit,
            )
            score = compute_score(breakdown, self.weights)

            if context.recovery_mode_active:
                reason_code: RecommendationReasonCode = "RECOVERY_LIGHT_LOAD"
            elif verified_resource is not None and mission.category == "INSTITUTIONAL_RESOURCES":
                reason_code = "VERIFIED_RESOURCE_MATCH"
            elif mission.category in context.priority_categories:
                reason_code = "PRIORITY_ALIGNMENT"
            else:
                reason_code = "TIME_FIT"

            scored_candidates.append((score, mission, verified_resource, breakdown, reason_code))

        scored_candidates.sort(key=lambda item: (-item[0], item[1].mission_id))
        top_candidates = scored_candidates[: self.weights.max_recommendations_per_run]

        now_iso = datetime.now(UTC).isoformat()
        results: list[RecommendationItem] = []

        for idx, (
            score,
            mission,
            verified_resource,
            breakdown,
            reason_code,
        ) in enumerate(top_candidates, start=1):
            fallback_used = False
            source: RecommendationSource = "ONLINE_RULES"
            prompt_version: str | None = None
            model_version: str | None = None
            rationale = build_deterministic_rationale(
                mission, verified_resource, context, reason_code
            )

            try:
                llm_out = provider.explain_recommendation(
                    mission, verified_resource, context, reason_code
                )
                if llm_out is not None:
                    if is_non_stigmatizing_rationale(llm_out.why_this_recommendation):
                        rationale = llm_out.why_this_recommendation
                        source = "ONLINE_AI"
                        prompt_version = llm_out.prompt_version
                        model_version = llm_out.model_version
                    else:
                        fallback_used = True
            except Exception:
                fallback_used = True
                source = "ONLINE_RULES"

            rec_id = f"rec-{context.student_id}-{mission.mission_id.lower()}-{idx}"
            rec_item = RecommendationItem(
                recommendation_id=rec_id,
                student_id=context.student_id,
                participant_id_pseudonym=context.participant_id_pseudonym,
                mission_id=mission.mission_id,
                resource_id=(
                    verified_resource.resource_id if verified_resource is not None else None
                ),
                resource_title=(verified_resource.title if verified_resource is not None else None),
                category=mission.category,
                effort=mission.effort,
                estimated_minutes=mission.estimated_minutes,
                title=mission.title,
                summary=mission.summary,
                why_this_recommendation=rationale,
                reason_code=reason_code,
                score=score,
                score_breakdown=breakdown,
                source=source,
                rule_version=self.weights.version,
                prompt_version=prompt_version,
                model_version=model_version,
                fallback_used=fallback_used,
                shown_at=now_iso,
            )
            self._by_id[rec_id] = rec_item
            self._traces.append(
                RecommendationTraceRecord(
                    recommendation_id=rec_id,
                    participant_id_pseudonym=context.participant_id_pseudonym,
                    resource_id=rec_item.resource_id,
                    mission_id=rec_item.mission_id,
                    reason_code=reason_code,
                    rule_version=self.weights.version,
                    prompt_version=prompt_version,
                    model_version=model_version,
                    shown_at=now_iso,
                    student_action=None,
                )
            )
            results.append(rec_item)

        self._by_student[context.student_id] = [r.recommendation_id for r in results]
        return results

    def list_for_student(self, student_id: str) -> list[RecommendationItem]:
        ids = self._by_student.get(student_id)
        if not ids:
            default_ctx = StudentContextInput(
                student_id=student_id,
                participant_id_pseudonym=f"pseudo-{student_id[-6:]}",
                priority_categories=["ACADEMIC_PLANNING", "STUDY_HABITS"],
                available_minutes_per_day=20,
                recovery_mode_active=(
                    student_id in ("usr-stu-002", "00000000-0000-4000-8000-000000000005")
                ),
            )
            return self.generate_for_student(default_ctx)
        return [self._by_id[rid] for rid in ids if rid in self._by_id]

    def record_action(
        self,
        recommendation_id: str,
        action_input: RecommendationActionInput,
    ) -> RecommendationItem:
        if recommendation_id not in self._by_id:
            raise KeyError(f"Recommendation {recommendation_id} not found")
        current = self._by_id[recommendation_id]
        updated = current.model_copy(
            update={
                "student_action": action_input.action,
                "edited_notes": action_input.edited_notes,
                "postponed_until": action_input.postponed_until,
                "acted_at": datetime.now(UTC).isoformat(),
            }
        )
        self._by_id[recommendation_id] = updated
        for idx, trace in enumerate(self._traces):
            if trace.recommendation_id == recommendation_id:
                self._traces[idx] = trace.model_copy(update={"student_action": action_input.action})
        return updated

    def list_traces(self) -> list[RecommendationTraceRecord]:
        return list(self._traces)
