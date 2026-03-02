from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.config import settings
from app import models

# This looks for "Authorization: Bearer <TOKEN>" in the request headers
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
    db: Session = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
) -> models.User:
    """
    Decodes the JWT and returns the User object from the database.
    If anything is wrong, it raises a 401 Unauthorized error.
    """
    auth_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired session. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # 1. Decode the token using the secret from config.py
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub") # 'sub' is the standard field for IDs
        
        if user_id is None:
            raise auth_exception
            
    except JWTError:
        raise auth_exception

    # 2. Fetch the actual user from your SQL Table
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if user is None:
        raise auth_exception
        
    return user