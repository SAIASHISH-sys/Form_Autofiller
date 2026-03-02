from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Date, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
import uuid
from .db.session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=True)
    google_id = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    profile = relationship("Profile", back_populates="user", uselist=False)
    resumes = relationship("Resume", back_populates="user")

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    full_name = Column(String)
    roll_no = Column(String)
    college = Column(String)
    dob = Column(Date)
    mobile_no = Column(String)
    interests = Column(JSONB, default=[])
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    file_name = Column(String)
    raw_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="resumes")

class ResumeEmbedding(Base):
    __tablename__ = "resume_embeddings"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    resume_id = Column(UUID(as_uuid=True), ForeignKey("resumes.id", ondelete="CASCADE"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    content = Column(Text)
    # This matches your SQL: VECTOR(1536)
    embedding = Column(Vector(1536))