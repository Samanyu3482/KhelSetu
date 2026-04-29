import os
from pydantic_settings import BaseSettings
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Database
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: str
    DB_NAME: str

    # Computed property
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    class Config:
        env_file = ".env"

# Create settings instance
@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()

