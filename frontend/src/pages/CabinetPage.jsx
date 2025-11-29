import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function CabinetPage() {
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/users/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));

    api.get("/payments/my")
      .then(res => setPayments(res.data))
      .catch(() => setPayments([]));
  }, []);

  if (!user) {
    return (
      <section className="section">
        <div className="container">
          <h2>Личный кабинет</h2>
          <p>Для просмотра личного кабинета войдите в систему.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h2>Личный кабинет</h2>
        <div className="card">
          <p><b>ФИО:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Участок:</b> {user.plot_number || "—"}</p>
          <p><b>Роль:</b> {user.role}</p>
        </div>
        <h3 style={{ marginTop: 20 }}>Ваши платежи</h3>
        <div className="cards-grid">
          {payments.map(p => (
            <div className="card" key={p.id}>
              <p><b>{p.kind}</b></p>
              <p>Сумма: {p.amount} ₽</p>
              <p>Статус: {p.status === "paid" ? "Оплачен" : "Не оплачен"}</p>
              <p>
                Создан:{" "}
                {new Date(p.created_at).toLocaleDateString("ru-RU")}
              </p>
            </div>
          ))}
          {payments.length === 0 && (
            <p>Платежей пока нет.</p>
          )}
        </div>
      </div>
    </section>
  );
}
