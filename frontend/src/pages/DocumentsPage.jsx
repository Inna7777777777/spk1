import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/documents")
      .then(res => setDocs(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h2>Документы</h2>
        <p>Устав, протоколы, решения и другие официальные документы СПК.</p>
        {loading && <p>Загрузка...</p>}
        {!loading && docs.length === 0 && <p>Документы пока не выложены.</p>}
        <div className="cards-grid">
          {docs.map(doc => (
            <article className="card" key={doc.id}>
              <h3>{doc.title}</h3>
              {doc.category && <p><b>Категория:</b> {doc.category}</p>}
              <p><b>Дата:</b> {new Date(doc.created_at).toLocaleDateString("ru-RU")}</p>
              <a
                href={doc.file_url}
                className="btn btn-outline"
                target="_blank"
                rel="noreferrer"
              >
                Открыть
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
