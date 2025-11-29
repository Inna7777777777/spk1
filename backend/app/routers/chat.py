from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.deps import get_current_user

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.get("/", response_model=List[schemas.ChatMessageBase])
def list_messages(db: Session = Depends(get_db)):
    return (
        db.query(models.ChatMessage)
        .order_by(models.ChatMessage.created_at.desc())
        .limit(100)
        .all()
    )


@router.post("/", response_model=schemas.ChatMessageBase)
def send_message(
    data: schemas.ChatMessageCreate,
    db: Session = Depends(get_db),
    current: models.User = Depends(get_current_user),
):
    msg = models.ChatMessage(author_id=current.id, body=data.body)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
