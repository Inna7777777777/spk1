from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.deps import require_role

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats", response_model=schemas.AdminStats)
def get_stats(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin")),
):
    users_count = db.query(models.User).count()
    plots_count = db.query(models.Plot).count()
    payments_count = db.query(models.Payment).count()
    news_count = db.query(models.News).count()

    return schemas.AdminStats(
        users=users_count,
        plots=plots_count,
        payments=payments_count,
        news=news_count,
    )


@router.get("/users", response_model=List[schemas.UserBase])
def list_users(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin")),
):
    return db.query(models.User).order_by(models.User.id).all()


@router.patch("/users/{user_id}", response_model=schemas.UserBase)
def update_user(
    user_id: int,
    data: schemas.AdminUserUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin")),
):
    user = db.query(models.User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    if data.role is not None:
        user.role = data.role
    if data.name is not None:
        user.name = data.name
    if data.plot_number is not None:
        user.plot_number = data.plot_number
    if data.is_active is not None:
        user.is_active = data.is_active

    db.commit()
    db.refresh(user)
    return user


@router.get("/payments", response_model=List[schemas.PaymentBase])
def list_payments(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin", "accountant", "chairman")),
):
    return (
        db.query(models.Payment)
        .order_by(models.Payment.created_at.desc())
        .all()
    )


@router.patch("/payments/{payment_id}", response_model=schemas.PaymentBase)
def update_payment_status(
    payment_id: int,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin", "accountant", "chairman")),
):
    payment = db.query(models.Payment).get(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Платеж не найден")

    if status is not None:
        if status not in ("paid", "unpaid"):
            raise HTTPException(
                status_code=400,
                detail="Неверный статус (допустимо: paid, unpaid)",
            )
        payment.status = status

    db.commit()
    db.refresh(payment)
    return payment


@router.delete("/chat/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat_message(
    message_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin", "chairman")),
):
    msg = db.query(models.ChatMessage).get(message_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")
    db.delete(msg)
    db.commit()
    return
