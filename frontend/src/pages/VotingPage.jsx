import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function VotingPage() {
  const [votes, setVotes] = useState([]);
  const [selectedVote, setSelectedVote] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [results, setResults] = useState(null);
  const [loadingVotes, setLoadingVotes] = useState(true);
  const [loadingVote, setLoadingVote] = useState(false);

  useEffect(() => {
    loadVotes();
  }, []);

  function loadVotes() {
    setLoadingVotes(true);
    api.get("/voting")
      .then(res => setVotes(res.data))
      .finally(() => setLoadingVotes(false));
  }

  function openVote(v) {
    setLoadingVote(true);
    setSelectedVote(null);
    setSelectedOptionId(null);
    setResults(null);
    api.get(`/voting/${v.id}`)
      .then(res => setSelectedVote(res.data))
      .finally(() => setLoadingVote(false));

    api.get(`/voting/${v.id}/results`)
      .then(res => setResults(res.data))
      .catch(() => {});
  }

  function sendAnswer(e) {
    e.preventDefault();
    if (!selectedVote || !selectedOptionId) return;

    api.post("/voting/answer", {
      vote_id: selectedVote.id,
      option_id: selectedOptionId
    })
      .then(() => api.get(`/voting/${selectedVote.id}/results`))
      .then(res => setResults(res.data))
      .catch(err => {
        alert(err.response?.data?.detail || "Ошибка при голосовании");
      });
  }

  return (
    <section className="section section-alt">
      <div className="container">
        <h2>Онлайн-голосования</h2>
        <p>Участие в собраниях и опросах кооператива в электронном виде.</p>
        <div className="cards-grid" style={{ alignItems: "flex-start" }}>
          <div className="card">
            <h3>Голосования</h3>
            {loadingVotes && <p>Загрузка...</p>}
            {!loadingVotes && votes.length === 0 && <p>Пока нет голосований.</p>}
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              {votes.map(v => (
                <li
                  key={v.id}
                  style={{
                    padding: "6px 0",
                    borderBottom: "1px dashed #e2e8f0",
                    cursor: "pointer"
                  }}
                  onClick={() => openVote(v)}
                >
                  <b>{v.title}</b>
                  <br />
                  <span style={{ fontSize: "0.8rem", color: "#718096" }}>
                    {new Date(v.created_at).toLocaleString("ru-RU")} •{" "}
                    {v.is_active ? "Активно" : "Завершено"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Детали</h3>
            {loadingVote && <p>Загрузка...</p>}
            {!loadingVote && !selectedVote && <p>Выберите голосование слева.</p>}
            {selectedVote && (
              <>
                <p><b>{selectedVote.title}</b></p>
                {selectedVote.description && <p>{selectedVote.description}</p>}
                {selectedVote.is_active ? (
                  <form onSubmit={sendAnswer}>
                    <p><b>Ваш голос:</b></p>
                    {selectedVote.options?.map(opt => (
                      <label key={opt.id} style={{ display: "block", marginBottom: 4 }}>
                        <input
                          type="radio"
                          name="voteOption"
                          value={opt.id}
                          checked={selectedOptionId === opt.id}
                          onChange={() => setSelectedOptionId(opt.id)}
                        />{" "}
                        {opt.text}
                      </label>
                    ))}
                    <button className="btn btn-primary" style={{ marginTop: 6 }}>
                      Проголосовать
                    </button>
                  </form>
                ) : (
                  <p>Голосование завершено.</p>
                )}

                {results && (
                  <>
                    <h4 style={{ marginTop: 16 }}>Результаты</h4>
                    <ul style={{ paddingLeft: 16 }}>
                      {results.results.map(r => (
                        <li key={r.option_id}>
                          {r.text}: <b>{r.votes}</b>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
