import React, { useState } from "react";
import api from "../api.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();
    api.post("/auth/login", { email, password })
      .then(res => {
        localStorage.setItem("token", res.data.access_token);
        alert("Успешный вход");
      })
      .catch(() => alert("Неверный логин или пароль"));
  }

  return (
    <section className="section">
      <div className="container">
        <h2>Вход</h2>
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
          <button className="btn btn-primary" style={{ marginTop: 6 }}>
            Войти
          </button>
        </form>
      </div>
    </section>
  );
}
