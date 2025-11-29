import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function MapPage() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/map/plots")
      .then(res => setPlots(res.data))
      .finally(() => setLoading(false));
  }, []);

  const statusLabel = {
    ok: "Оплачено",
    warn: "Есть задолженность",
    debt: "Просроченный долг"
  };

  return (
    <section className="section section-alt">
      <div className="container">
        <h2>Карта участков</h2>
        <p>Состояние участков по оплате взносов (условная визуализация).</p>
        {loading && <p>Загрузка...</p>}
        {!loading && (
          <>
            <div className="map-preview">
              <div className="map-grid">
                {plots.map(p => (
                  <div
                    key={p.id}
                    className={
                      "plot " +
                      (p.status === "ok"
                        ? "plot-ok"
                        : p.status === "warn"
                        ? "plot-warn"
                        : "plot-debt")
                    }
                  >
                    {p.number}
                  </div>
                ))}
              </div>
              <div className="map-legend">
                <p><span className="dot dot-green"></span> Оплачено</p>
                <p><span className="dot dot-yellow"></span> Есть задолженность</p>
                <p><span className="dot dot-red"></span> Просроченный долг</p>
              </div>
            </div>
            <h3>Список участков</h3>
            <div className="cards-grid">
              {plots.map(p => (
                <div className="card" key={p.id}>
                  <p><b>Участок №{p.number}</b></p>
                  {p.owner_name && <p>Владелец: {p.owner_name}</p>}
                  <p>Статус: {statusLabel[p.status] || p.status}</p>
                  {p.comment && <p>Комментарий: {p.comment}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
