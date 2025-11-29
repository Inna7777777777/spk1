from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.deps import require_role

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("/", response_model=List[schemas.DocumentBase])
def list_documents(db: Session = Depends(get_db)):
    return db.query(models.Document).order_by(models.Document.created_at.desc()).all()


@router.post("/", response_model=schemas.DocumentBase)
def create_document(
    data: schemas.DocumentCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin", "chairman")),
):
    doc = models.Document(
        title=data.title,
        category=data.category,
        file_url=data.file_url,
        is_public=data.is_public,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


@router.delete("/{doc_id}", status_code=204)
def delete_document(
    doc_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_role("admin", "chairman")),
):
    doc = db.query(models.Document).get(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Документ не найден")
    db.delete(doc)
    db.commit()
    return
