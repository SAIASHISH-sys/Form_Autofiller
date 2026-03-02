from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app import models, schemas
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.api.deps import get_current_user
from google.oauth2 import id_token
from google.auth.transport import requests

router = APIRouter()


# 1. Register — create a new user with email + password
@router.post("/register", response_model=schemas.UserRead)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = get_password_hash(user_data.password)
    user = models.User(email=user_data.email, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# 2. Standard Email/Password Login
@router.post("/login/token")
def login_for_access_token(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


# 3. Google OAuth Login
@router.post("/login/google")
def google_auth(token_data: schemas.GoogleToken, db: Session = Depends(get_db)):
    try:
        # Verify the token sent from Next.js (frontend)
        idinfo = id_token.verify_oauth2_token(
            token_data.id_token,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
        email = idinfo["email"]
        google_id = idinfo["sub"]

        # Check if user exists
        user = db.query(models.User).filter(models.User.email == email).first()

        if not user:
            # Create a new user if they don't exist
            user = models.User(email=email, google_id=google_id)
            db.add(user)
            db.commit()
            db.refresh(user)

        access_token = create_access_token(data={"sub": str(user.id)})
        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google Token")


# 4. Get current user info
@router.get("/me", response_model=schemas.UserRead)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user