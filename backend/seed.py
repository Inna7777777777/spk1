from app.db import SessionLocal, Base, engine
from app import models
from app.security import hash_password
from datetime import datetime, timedelta
import random


def create_admin(db):
    admin = db.query(models.User).filter(models.User.email == "admin@spk.ru").first()
    if admin:
        print("Админ уже существует")
        return

    admin = models.User(
        email="admin@spk.ru",
        hashed_password=hash_password("admin123"),
        name="Администратор",
        role="admin",
        plot_number=None,
    )
    db.add(admin)
    db.commit()
    print("Создан админ: admin@spk.ru / пароль: admin123")


def create_users(db):
    base_names = [
        ("Иван Иванов", "1"),
        ("Мария Петрова", "2"),
        ("Сергей Смирнов", "3"),
        ("Ольга Кузнецова", "4"),
        ("Елена Попова", "5"),
    ]

    for idx, (name, plot) in enumerate(base_names):
        email = f"user{idx+1}@mail.ru"
        exists = db.query(models.User).filter(models.User.email == email).first()
        if exists:
            continue

        user = models.User(
            email=email,
            hashed_password=hash_password("12345"),
            name=name,
            role="gardener",
            plot_number=plot,
        )
        db.add(user)

    db.commit()
    print("Созданы тестовые пользователи")


def create_plots(db):
    for i in range(1, 11):
        num = str(i)
        exists = db.query(models.Plot).filter(models.Plot.number == num).first()
        if exists:
            continue

        status = random.choice(["ok", "warn", "debt"])
        plot = models.Plot(
            number=num,
            owner_name=f"Садовод №{i}",
            status=status,
            comment="",
        )
        db.add(plot)

    db.commit()
    print("Созданы тестовые участки")


def create_news(db):
    examples = [
        ("Покос территории", "Завершён покос территории общего пользования."),
        ("Установка ворот", "На въезде в кооператив установлены новые ворота."),
        ("Отключение света", "Свет отключат 18.05 с 10:00 до 13:00.")
    ]

    for title, body in examples:
        exists = db.query(models.News).filter(models.News.title == title).first()
        if exists:
            continue
        n = models.News(title=title, body=body)
        db.add(n)

    db.commit()
    print("Созданы новости")


def create_documents(db):
    data = [
        ("Устав СПК", "Устав", "/docs/ustav.pdf"),
        ("Протокол №1", "Протокол", "/docs/protokol1.pdf"),
        ("Смета расходов 2025", "Смета", "/docs/smeta2025.pdf"),
    ]

    for title, cat, url in data:
        exists = db.query(models.Document).filter(models.Document.title == title).first()
        if exists:
            continue

        doc = models.Document(
            title=title,
            category=cat,
            file_url=url,
            is_public=True,
        )
        db.add(doc)

    db.commit()
    print("Созданы документы")


def create_voting(db):
    title = "Утверждение сметы на 2025 год"

    exists = db.query(models.Vote).filter(models.Vote.title == title).first()
    if exists:
        print("Голосование уже есть")
        return

    vote = models.Vote(
        title=title,
        description="Голосование по смете расходов на 2025",
        is_active=True,
    )
    db.add(vote)
    db.flush()

    options = ["За", "Против", "Воздержался"]
    for opt in options:
        db.add(models.VoteOption(vote_id=vote.id, text=opt))

    db.commit()
    print("Создано голосование")


def create_forum(db):
    topic = models.ForumTopic(
        title="Благоустройство территории",
        created_by_id=1,
    )
    db.add(topic)
    db.flush()

    posts = [
        "Предлагаю поставить детскую площадку",
        "Нужно решить вопрос с дорогой у 3 участка",
        "Кто за озеленение центральной зоны?"
    ]

    for text in posts:
        db.add(models.ForumPost(
            topic_id=topic.id,
            author_id=1,
            body=text
        ))

    db.commit()
    print("Создан форум")


def create_chat(db):
    msgs = [
        "Добрый день!",
        "Когда будет покос?",
        "У кого трактор?",
        "Кто идёт на собрание?"
    ]

    for m in msgs:
        db.add(models.ChatMessage(
            author_id=1,
            body=m,
        ))

    db.commit()
    print("Создан чат")


def create_payments(db):
    users = db.query(models.User).filter(models.User.role == "gardener").all()

    for u in users:
        for i in range(5):
            payment = models.Payment(
                user_id=u.id,
                kind="Членский взнос",
                amount=1500,
                status=random.choice(["paid", "unpaid"]),
                created_at=datetime.utcnow() - timedelta(days=random.randint(1, 300)),
                paid_at=datetime.utcnow() if random.choice([True, False]) else None
            )
            db.add(payment)

    db.commit()
    print("Добавлены платежи")


def run():
    print("Инициализация БД...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    create_admin(db)
    create_users(db)
    create_plots(db)
    create_news(db)
    create_documents(db)
    create_voting(db)
    create_forum(db)
    create_chat(db)
    create_payments(db)

    db.close()
    print("Готово! База данных инициализирована.")


if __name__ == "__main__":
    run()
