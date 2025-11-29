from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db import Base, engine
from app.config import settings
from app.routers import (
    auth,
    users,
    news,
    payments,
    documents,
    forum,
    voting,
    mapdata,
    chat,
    admin,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

origins = [o.strip() for o in settings.FRONTEND_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(news.router)
app.include_router(payments.router)
app.include_router(documents.router)
app.include_router(forum.router)
app.include_router(voting.router)
app.include_router(mapdata.router)
app.include_router(chat.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "API СПК «Хорошово-1» работает"}
