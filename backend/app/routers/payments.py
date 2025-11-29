from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.deps import get_current_user, require_role

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.get("/my", response_model=List[schemas.PaymentBase])
def my_payments(
    current: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(models.Payment).filter(models.Payment.user_id == current.id).all()


@router.post("/", response_model=schemas.PaymentBase)
def create_payment(
    data: schemas.PaymentCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin", "accountant", "chairman")),
):
    payment = models.Payment(user_id=data.user_id, kind=data.kind, amount=data.amount)
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment
