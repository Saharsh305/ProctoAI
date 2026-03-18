from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = Field(default="MyProctor FastAPI", alias="APP_NAME")
    env: str = Field(default="dev", alias="ENV")

    database_url: str = Field(
        default="postgresql+psycopg://postgres:postgres@localhost:5432/quizapp",
        alias="DATABASE_URL",
    )

    cors_origins: str = Field(default="", alias="CORS_ORIGINS")

    secret_key: str = Field(default="change_me", alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(default=60, alias="ACCESS_TOKEN_EXPIRE_MINUTES")

    def cors_origins_list(self) -> List[str]:
        if not self.cors_origins:
            return []
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
