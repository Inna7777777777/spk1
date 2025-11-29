from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(
    title="СПК «Хорошово-1» — портал",
    version="1.0.0",
    description="Минимальный рабочий backend для портала СПК «Хорошово-1»."
)

# CORS — чтобы фронтенд с другого домена мог обращаться
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # потом можно ограничить доменом портала
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Модели для примера ----------

class NewsItem(BaseModel):
    id: int
    title: str
    text: str
    created_at: datetime


# ---------- Базовые эндпоинты ----------

@app.get("/health")
def health_check():
    """
    Простой health-check для Render/Timeweb.
    """
    return {"status": "ok", "time": datetime.now().isoformat()}


@app.get("/api/status")
def api_status():
    """
    Краткая информация о состоянии API.
    """
    return {
        "app": "СПК «Хорошово-1»",
        "version": "1.0.0",
        "backend": "FastAPI",
        "message": "Backend запущен и работает.",
    }


# ---------- Пример раздела «Новости» ----------

FAKE_NEWS = [
    NewsItem(
        id=1,
        title="Портал СПК «Хорошово-1» запущен",
        text="Тестовая новость: портал для садоводов успешно запущен в работу.",
        created_at=datetime(2025, 11, 29, 12, 0),
    ),
    NewsItem(
        id=2,
        title="Проверка работы backend-а",
        text="Эта новость приходит из FastAPI и показывает, что API работает.",
        created_at=datetime(2025, 11, 29, 13, 30),
    ),
]


@app.get("/api/news", response_model=list[NewsItem])
def list_news():
    """
    Временный список новостей.
    Потом подключим базу и сделаем полноценный CRUD.
    """
    return FAKE_NEWS
