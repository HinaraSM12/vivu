from fastapi.testclient import TestClient

from recommendation_service.main import app

client = TestClient(app)


def test_deterministic_recommendations_exclude_expired_resources_and_cap_at_three() -> None:
    response = client.post(
        "/recommendations/generate",
        json={
            "context": {
                "student_id": "usr-stu-001",
                "participant_id_pseudonym": "pseudo-stu-001",
                "priority_categories": ["ACADEMIC_PLANNING", "STUDY_HABITS"],
                "available_minutes_per_day": 25,
                "recovery_mode_active": False,
                "completed_mission_ids": [],
                "dismissed_mission_ids": [],
            },
            "llm_mode": "disabled",
        },
    )
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 3
    for item in items:
        assert item["source"] == "ONLINE_RULES"
        assert item["rule_version"] == "1.0.0"
        assert item["resource_id"] != "RES-ARCH-01"


def test_recovery_mode_filters_strictly_to_low_effort_recovery_eligible_missions() -> None:
    response = client.post(
        "/recommendations/generate",
        json={
            "context": {
                "student_id": "usr-stu-002",
                "participant_id_pseudonym": "pseudo-stu-002",
                "priority_categories": ["WELLBEING_HABITS"],
                "available_minutes_per_day": 15,
                "recovery_mode_active": True,
                "completed_mission_ids": [],
                "dismissed_mission_ids": [],
            },
            "llm_mode": "contextual",
        },
    )
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 3
    for item in items:
        assert item["effort"] == "LOW"
        assert item["reason_code"] == "RECOVERY_LIGHT_LOAD"
        assert item["source"] == "ONLINE_AI"
        assert item["prompt_version"] == "prompt-rec-v1.0.0"


def test_llm_failure_triggers_deterministic_fallback_without_error() -> None:
    response = client.post(
        "/recommendations/generate",
        json={
            "context": {
                "student_id": "usr-stu-003",
                "participant_id_pseudonym": "pseudo-stu-003",
                "priority_categories": ["INSTITUTIONAL_RESOURCES"],
                "available_minutes_per_day": 20,
                "recovery_mode_active": False,
            },
            "llm_mode": "simulate_failure",
        },
    )
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 3
    assert items[0]["fallback_used"] is True
    assert items[0]["source"] == "ONLINE_RULES"


def test_student_agency_actions_and_trace_records() -> None:
    list_res = client.get("/students/usr-stu-001/recommendations")
    assert list_res.status_code == 200
    first_id = list_res.json()[0]["recommendation_id"]

    act_res = client.post(
        f"/recommendations/{first_id}/action",
        json={
            "action": "EDIT",
            "edited_notes": "Haré primero 2 entregas hoy y 1 mañana.",
            "client_event_id": "evt-rec-edit-001",
        },
    )
    assert act_res.status_code == 200
    updated = act_res.json()
    assert updated["student_action"] == "EDIT"
    assert updated["edited_notes"] == "Haré primero 2 entregas hoy y 1 mañana."

    traces_res = client.get("/recommendations/traces")
    assert traces_res.status_code == 200
    traces = traces_res.json()
    matching = [t for t in traces if t["recommendation_id"] == first_id]
    assert matching and matching[-1]["student_action"] == "EDIT"


def test_extract_resource_sanitizes_pii_and_enforces_pending_review() -> None:
    res = client.post(
        "/extract-resource",
        json={
            "raw_text": (
                "Hola estudiante@unal.edu.co, inscríbete al taller con CC 1020304050 "
                "o al 300 123 4567."
            ),
            "source_name": "Boletín Bienestar Minas",
        },
    )
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "PENDING_REVIEW"
    assert "[EMAIL_REDACTED]" in body["sanitized_input"]
    assert "[ID_REDACTED]" in body["sanitized_input"]
    assert "[PHONE_REDACTED]" in body["sanitized_input"]
