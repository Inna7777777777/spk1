from pydantic import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "SPK Khoroshovo-1 API"
    DATABASE_URL: str = "sqlite:///./spk.db"
    JWT_SECRET: str = "change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    FRONTEND_ORIGINS: str = "http://localhost:5173,http://localhost:5174"

    class Config:
        env_file = ".env"


settings = Settings()
