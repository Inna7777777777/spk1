from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.deps import require_role

router = APIRouter(prefix="/map", tags=["Map"])


@router.get("/plots", response_model=List[schemas.PlotBase])
def list_plots(db: Session = Depends(get_db)):
    return db.query(models.Plot).order_by(models.Plot.number).all()


@router.post("/plots", response_model=schemas.PlotBase)
def create_plot(
    data: schemas.PlotCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin", "chairman")),
):
    exists = db.query(models.Plot).filter(models.Plot.number == data.number).first()
    if exists:
        raise HTTPException(status_code=400, detail="Участок с таким номером уже существует")
    plot = models.Plot(
        number=data.number,
        owner_name=data.owner_name,
        status=data.status,
        comment=data.comment,
    )
    db.add(plot)
    db.commit()
    db.refresh(plot)
    return plot


@router.patch("/plots/{plot_id}", response_model=schemas.PlotBase)
def update_plot(
    plot_id: int,
    data: schemas.PlotUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin", "chairman")),
):
    plot = db.query(models.Plot).get(plot_id)
    if not plot:
        raise HTTPException(status_code=404, detail="Участок не найден")

    if data.owner_name is not None:
        plot.owner_name = data.owner_name
    if data.status is not None:
        plot.status = data.status
    if data.comment is not None:
        plot.comment = data.comment

    db.commit()
    db.refresh(plot)
    return plot
