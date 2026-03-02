from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.db.session import engine, Base, get_db
from app import models, schemas
from app.api.auth import router as auth_router
from uuid import UUID
from typing import List
import uvicorn

app = FastAPI()

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
Base.metadata.create_all(bind=engine)

# Mount auth router
app.include_router(auth_router, prefix="/auth", tags=["auth"])

@app.get("/profile/{user_id}", response_model=schemas.ProfileRead)
def get_profile(user_id: UUID, db: Session = Depends(get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.put("/profile/{user_id}", response_model=schemas.ProfileRead)
def update_profile(user_id: UUID, profile_data: schemas.ProfileBase, db: Session = Depends(get_db)):
    db_profile = db.query(models.Profile).filter(models.Profile.user_id == user_id).first()
    if not db_profile:
        # Create if it doesn't exist
        db_profile = models.Profile(user_id=user_id, **profile_data.dict())
        db.add(db_profile)
    else:
        # Update existing
        for key, value in profile_data.dict().items():
            setattr(db_profile, key, value)
            
    db.commit()
    db.refresh(db_profile)
    return db_profile

@app.get("/resumes/{user_id}", response_model=List[schemas.ResumeRead])
def get_user_resumes(user_id: UUID, db: Session = Depends(get_db)):
    return db.query(models.Resume).filter(models.Resume.user_id == user_id).all()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)