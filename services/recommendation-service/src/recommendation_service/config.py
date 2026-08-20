from functools import lru_cache
from typing import Literal

from pydantic import AnyUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuración validada del proceso."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    environment: Literal["development", "test", "production"] = Field(
        default="development",
        validation_alias="RECOMMENDATION_ENV",
    )
    port: int = Field(default=8000, ge=1, le=65535, validation_alias="RECOMMENDATION_PORT")
    database_url: AnyUrl | None = Field(
        default=None,
        validation_alias="RECOMMENDATION_DATABASE_URL",
    )
    rabbitmq_url: AnyUrl | None = Field(
        default=None,
        validation_alias="RECOMMENDATION_RABBITMQ_URL",
    )
    llm_provider: str = Field(default="disabled", validation_alias="LLM_PROVIDER")


@lru_cache
def get_settings() -> Settings:
    return Settings()
