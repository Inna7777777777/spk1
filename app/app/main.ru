from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Создаём FastAPI-приложение
app = FastAPI(
    title="SPK Portal Backend (демо)",
    description="Минимальный backend для портала СПК «Хорошово-1», чтобы Render успешно запускался.",
    version="1.0.0",
)

# Разрешаем запросы с фронтенда (Render, локально и т.п.)
origins = [
    "*",  # ПОТОМ можно сузить до конкретных доменов фронтенда
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "status": "ok",
        "message": "SPK backend работает ✅",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
