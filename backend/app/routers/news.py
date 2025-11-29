from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.deps import require_role

router = APIRouter(prefix="/news", tags=["News"])


@router.get("/", response_model=List[schemas.NewsBase])
def list_news(db: Session = Depends(get_db)):
    return db.query(models.News).order_by(models.News.created_at.desc()).all()


@router.post("/", response_model=schemas.NewsBase)
def create_news(
    data: schemas.NewsCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin", "chairman")),
):
    news = models.News(title=data.title, body=data.body)
    db.add(news)
    db.commit()
    db.refresh(news)
    return news
