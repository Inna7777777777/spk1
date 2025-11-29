from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.deps import get_current_user, require_role

router = APIRouter(prefix="/voting", tags=["Voting"])


@router.get("/", response_model=List[schemas.VoteBase])
def list_votes(db: Session = Depends(get_db)):
    return db.query(models.Vote).order_by(models.Vote.created_at.desc()).all()


@router.get("/{vote_id}", response_model=schemas.VoteDetail)
def get_vote(vote_id: int, db: Session = Depends(get_db)):
    vote = db.query(models.Vote).get(vote_id)
    if not vote:
        raise HTTPException(status_code=404, detail="Голосование не найдено")
    return vote


@router.get("/{vote_id}/results", response_model=schemas.VoteResults)
def get_results(vote_id: int, db: Session = Depends(get_db)):
    vote = db.query(models.Vote).get(vote_id)
    if not vote:
        raise HTTPException(status_code=404, detail="Голосование не найдено")

    options = db.query(models.VoteOption).filter(models.VoteOption.vote_id == vote_id).all()
    results = []
    for opt in options:
        count = db.query(models.VoteAnswer).filter(
            models.VoteAnswer.vote_id == vote_id,
            models.VoteAnswer.option_id == opt.id,
        ).count()
        results.append(schemas.VoteResultItem(option_id=opt.id, text=opt.text, votes=count))

    return schemas.VoteResults(vote_id=vote.id, title=vote.title, results=results)


@router.post("/", response_model=schemas.VoteBase)
def create_vote(
    data: schemas.VoteCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin", "chairman")),
):
    vote = models.Vote(title=data.title, description=data.description)
    db.add(vote)
    db.commit()
    db.refresh(vote)
    for text in data.options:
        opt = models.VoteOption(vote_id=vote.id, text=text)
        db.add(opt)
    db.commit()
    return vote


@router.post("/answer")
def answer(
    data: schemas.VoteAnswerCreate,
    db: Session = Depends(get_db),
    current: models.User = Depends(get_current_user),
):
    vote = db.query(models.Vote).get(data.vote_id)
    if not vote:
        raise HTTPException(status_code=404, detail="Голосование не найдено")
    if not vote.is_active:
        raise HTTPException(status_code=400, detail="Голосование завершено")

    existing = db.query(models.VoteAnswer).filter(
        models.VoteAnswer.vote_id == data.vote_id,
        models.VoteAnswer.user_id == current.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Вы уже голосовали")

    ans = models.VoteAnswer(
        vote_id=data.vote_id,
        option_id=data.option_id,
        user_id=current.id,
    )
    db.add(ans)
    db.commit()
    return {"status": "ok"}
