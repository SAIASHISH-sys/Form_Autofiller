from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv()
Gemin_API_KEY = os.getenv("GEMINI_API_KEY")
LLM_Model = "gemini-2.5-flash"
EMBEDDING_MODEL = "gemini-embedding-001"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 100


class Settings(BaseSettings):
    # --- Project Info ---
    PROJECT_NAME: str = "FormAutofiller AI"

    
    # --- Security ---
    # These will be overwritten by your .env file
    SECRET_KEY: str 
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # --- Database ---
    DATABASE_URL: str
    
    # --- External APIs ---
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    # This part "plumbs" the .env file into this class
    model_config = SettingsConfigDict(
        env_file=".env", 
        case_sensitive=True,
        extra="ignore"
    )

# Instantiate this so we can import 'settings' elsewhere
settings = Settings()