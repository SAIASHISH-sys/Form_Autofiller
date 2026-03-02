from pydantic import BaseModel, EmailStr, ConfigDict, Field
from uuid import UUID
from datetime import datetime, date
from typing import List, Optional

# --- USER SCHEMAS ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserLogin(UserBase):
    password: str

class GoogleToken(BaseModel):
    id_token: str

class UserRead(UserBase):
    id: UUID
    created_at: datetime
    
    # Modern Pydantic v2 Config
    model_config = ConfigDict(from_attributes=True)

# --- PROFILE SCHEMAS ---
class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    roll_no: Optional[str] = None
    college: Optional[str] = None
    dob: Optional[date] = None
    mobile_no: Optional[str] = None
    # JSONB from Postgres maps perfectly to a Python List
    interests: List[str] = []

class ProfileUpdate(ProfileBase):
    pass

class ProfileRead(ProfileBase):
    id: UUID
    user_id: UUID
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

# --- RESUME SCHEMAS (For RAG) ---
class ResumeBase(BaseModel):
    file_name: str
    raw_text: str

class ResumeRead(ResumeBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ResumeEmbeddingRead(BaseModel):
    id: UUID
    content: str
    # Note: We usually don't send the 1536-dim vector to the frontend
    # because it's huge and useless for display.
    
    model_config = ConfigDict(from_attributes=True)