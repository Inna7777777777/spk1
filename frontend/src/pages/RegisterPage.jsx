import React, { useState } from "react";
import api from "../api.js";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [plot, setPlot] = useState("");

  function submit(e) {
    e.preventDefault();
    api.post("/auth/register", { email, password, name, plot_number: plot })
      .then(() => {
        alert("Регистрация прошла успешно. Теперь войдите.");
      })
      .catch(err => alert(err.response?.data?.detail || "Ошибка регистрации"));
  }

  return (
    <section className="section">
      <div className="container">
        <h2>Регистрация</h2>
        <form className="feedback-form" onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            ФИО
            <input
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            Номер участка
            <input
              value={plot}
              onChange={e => setPlot(e.target.value)}
            />
          </label>
          <button className="btn btn-primary" style={{ marginTop: 6 }}>
            Зарегистрироваться
          </button>
        </form>
      </div>
    </section>
  );
}
