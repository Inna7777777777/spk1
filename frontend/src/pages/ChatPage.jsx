import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  function loadMessages() {
    setLoading(true);
    api.get("/chat")
      .then(res => setMessages(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadMessages();
    const timer = setInterval(loadMessages, 15000);
    return () => clearInterval(timer);
  }, []);

  function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    api.post("/chat", { body: text })
      .then(() => {
        setText("");
        loadMessages();
      })
      .catch(() => alert("Нужно войти в систему для отправки сообщений."));
  }

  return (
    <section className="section">
      <div className="container">
        <h2>Чат СПК</h2>
        <p>Краткие сообщения участников кооператива.</p>
        {loading && <p>Загрузка...</p>}
        <div
          style={{
            maxHeight: 320,
            overflowY: "auto",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            padding: 8,
            marginBottom: 10,
            background: "#ffffff"
          }}
        >
          {messages.map(m => (
            <div
              key={m.id}
              style={{
                borderBottom: "1px dashed #edf2f7",
                padding: "4px 0"
              }}
            >
              <div style={{ fontSize: "0.9rem" }}>{m.body}</div>
              <div style={{ fontSize: "0.75rem", color: "#718096" }}>
                {new Date(m.created_at).toLocaleString("ru-RU")}
              </div>
            </div>
          ))}
          {messages.length === 0 && !loading && (
            <p style={{ fontSize: "0.9rem", color: "#718096" }}>
              Сообщений пока нет.
            </p>
          )}
        </div>

        <form className="feedback-form" onSubmit={send}>
          <label>
            Сообщение
            <textarea
              rows={3}
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ width: "100%", marginTop: 4 }}
            />
          </label>
          <button className="btn btn-primary" style={{ marginTop: 6 }}>
            Отправить
          </button>
        </form>
      </div>
    </section>
  );
}
