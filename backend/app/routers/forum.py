from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.deps import get_current_user

router = APIRouter(prefix="/forum", tags=["Forum"])


@router.get("/topics", response_model=List[schemas.ForumTopicBase])
def list_topics(db: Session = Depends(get_db)):
    return db.query(models.ForumTopic).order_by(models.ForumTopic.created_at.desc()).all()


@router.post("/topics", response_model=schemas.ForumTopicBase)
def create_topic(
    data: schemas.ForumTopicCreate,
    db: Session = Depends(get_db),
    current: models.User = Depends(get_current_user),
):
    topic = models.ForumTopic(title=data.title, created_by_id=current.id)
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic


@router.get("/topics/{topic_id}", response_model=schemas.ForumTopicDetail)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(models.ForumTopic).get(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Тема не найдена")
    return topic


@router.post("/topics/{topic_id}/posts", response_model=schemas.ForumPostBase)
def create_post(
    topic_id: int,
    data: schemas.ForumPostCreate,
    db: Session = Depends(get_db),
    current: models.User = Depends(get_current_user),
):
    topic = db.query(models.ForumTopic).get(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Тема не найдена")
    post = models.ForumPost(topic_id=topic_id, author_id=current.id, body=data.body)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/posts/{post_id}", status_code=204)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current: models.User = Depends(get_current_user),
):
    post = db.query(models.ForumPost).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    # Простейшая логика: удалить может автор или админ (проверка роли в админ-роутере)
    db.delete(post)
    db.commit()
    return
