import pytest
from pydantic import ValidationError

from recommendation_service.config import Settings


def test_settings_reject_invalid_port(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("RECOMMENDATION_PORT", "70000")

    with pytest.raises(ValidationError):
        Settings()


def test_settings_disable_llm_by_default(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("LLM_PROVIDER", raising=False)

    assert Settings().llm_provider == "disabled"
