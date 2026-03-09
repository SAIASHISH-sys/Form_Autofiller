from uuid import UUID
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.session import get_db
# from app import models, schemas 
from app.models import ResumeEmbedding, Resume
from app.services.parser import extract_text
from app.services.chunker import chunk_text
from app.services.embedder import get_embeddings
from app.services.retriever import retrieve_relevant_chunks
from app.services.llm import generate_answer

router = APIRouter(prefix="/resume", tags=["resume"])

class QueryRequest(BaseModel):
    question: str
    resume_id: str | None = None

@router.post("/upload/{profile_id}")
def upload_resume(
    profile_id: UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    
    file_bytes = file.file.read()

    raw_text = extract_text(file_bytes)
    if not raw_text:
        raise HTTPException(400, "Could not extract text from file")
    resume_id = uuid.uuid4()
    db.add(Resume(user_id = profile_id,
                              resume_id = resume_id,
                              file_name = file.filename,
                                raw_text = raw_text))  

    db.commit()

    chunks = chunk_text(raw_text)
    embeddings = get_embeddings(chunks)

    for content, embedding in zip(chunks,embeddings):
        db.add(ResumeEmbedding(
            user_id = profile_id,
            resume_id = resume_id,
            content = content,
            embedding = embedding
        ))
    db.commit()

    return{
        "resume_id": str(resume_id),
        "filename": file.filename,
        "chunks_stored": len(chunks),
    }

@router.post("/query/{profile_id}")
def query_resume(
    profile_id: UUID,
    body: QueryRequest,
    db: Session = Depends(get_db),
):
    relevant_chunks = retrieve_relevant_chunks(
        db, body.question, profile_id, resume_id=body.resume_id
    )

    if not relevant_chunks:
        raise HTTPException(404, "No resume data found")
    
    answer = generate_answer(body.question, relevant_chunks)

    return{
        "answer": answer,
        "sources": relevant_chunks,
    }

@router.delete("/{resume_id}")
def delete_resume(resume_id: UUID, db: Session= Depends(get_db)):
    deleted = (
        db.query(ResumeEmbedding)
        .filter(ResumeEmbedding.resume_id == resume_id)
        .delete(),
        db.query(Resume)
        .filter(Resume.id == resume_id)
        .delete()
    )
    if not deleted:
        raise HTTPException(404, " Resume Embeddings Not Found")
    
    db.commit()
    return{ "deleted": True, "resume_removed": resume_id}

@router.get("/profile/{profile_id}")
def list_resumes(profile_id: UUID, db: Session = Depends(get_db)):
    rows = (
        db.query(ResumeEmbedding.resume_id)
        .filter(ResumeEmbedding.user_id == profile_id)
        .distinct()
        .all()
    )
    return [{"resume_id": str(r[0]) }for r in rows]