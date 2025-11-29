import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function NewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/news")
      .then(res => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h2>Новости</h2>
        {loading && <p>Загрузка...</p>}
        {!loading && items.length === 0 && <p>Новости пока не размещены.</p>}
        <div className="cards-grid">
          {items.map(n => (
            <article className="card" key={n.id}>
              <h3>{n.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "#718096" }}>
                {new Date(n.created_at).toLocaleString("ru-RU")}
              </p>
              <p>{n.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
