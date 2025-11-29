import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function ForumPage() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newPostText, setNewPostText] = useState("");
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  function loadTopics() {
    setLoadingTopics(true);
    api.get("/forum/topics")
      .then(res => setTopics(res.data))
      .finally(() => setLoadingTopics(false));
  }

  function openTopic(topic) {
    setSelectedTopic(topic);
    setLoadingPosts(true);
    api.get(`/forum/topics/${topic.id}`)
      .then(res => {
        setPosts(res.data.posts || []);
      })
      .finally(() => setLoadingPosts(false));
  }

  function createTopic(e) {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    api.post("/forum/topics", { title: newTopicTitle })
      .then(() => {
        setNewTopicTitle("");
        loadTopics();
      })
      .catch(() => alert("Ошибка при создании темы (нужен вход в систему)."));
  }

  function sendPost(e) {
    e.preventDefault();
    if (!selectedTopic || !newPostText.trim()) return;
    api.post(`/forum/topics/${selectedTopic.id}/posts`, { body: newPostText })
      .then(() => {
        setNewPostText("");
        openTopic(selectedTopic);
      })
      .catch(() => alert("Ошибка при отправке сообщения (нужен вход)."));
  }

  return (
    <section className="section">
      <div className="container">
        <h2>Форум садоводов</h2>
        <p>Обсуждения по вопросам кооператива.</p>
        <div className="cards-grid" style={{ alignItems: "flex-start" }}>
          <div className="card">
            <h3>Темы</h3>
            {loadingTopics && <p>Загрузка тем...</p>}
            {!loadingTopics && topics.length === 0 && <p>Тем пока нет.</p>}
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              {topics.map(t => (
                <li
                  key={t.id}
                  style={{
                    padding: "6px 0",
                    borderBottom: "1px dashed #e2e8f0",
                    cursor: "pointer"
                  }}
                  onClick={() => openTopic(t)}
                >
                  <b>{t.title}</b><br />
                  <span style={{ fontSize: "0.8rem", color: "#718096" }}>
                    {new Date(t.created_at).toLocaleString("ru-RU")}
                  </span>
                </li>
              ))}
            </ul>

            <form onSubmit={createTopic} style={{ marginTop: 12 }}>
              <label>
                Новая тема:
                <input
                  value={newTopicTitle}
                  onChange={e => setNewTopicTitle(e.target.value)}
                  style={{ width: "100%", marginTop: 4 }}
                />
              </label>
              <button className="btn btn-primary" style={{ marginTop: 6 }}>
                Создать тему
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Сообщения</h3>
            {!selectedTopic && <p>Выберите тему слева.</p>}
            {selectedTopic && (
              <>
                <p><b>Тема:</b> {selectedTopic.title}</p>
                {loadingPosts && <p>Загрузка сообщений...</p>}
                {!loadingPosts && posts.length === 0 && (
                  <p>Сообщений пока нет. Будьте первым!</p>
                )}
                <div
                  style={{
                    maxHeight: 260,
                    overflowY: "auto",
                    border: "1px solid #edf2f7",
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 8
                  }}
                >
                  {posts.map(p => (
                    <div
                      key={p.id}
                      style={{
                        borderBottom: "1px solid #edf2f7",
                        padding: "4px 0"
                      }}
                    >
                      <div style={{ fontSize: "0.9rem" }}>{p.body}</div>
                      <div style={{ fontSize: "0.75rem", color: "#718096" }}>
                        {new Date(p.created_at).toLocaleString("ru-RU")}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendPost}>
                  <label>
                    Ваше сообщение:
                    <textarea
                      rows={3}
                      value={newPostText}
                      onChange={e => setNewPostText(e.target.value)}
                      style={{ width: "100%", marginTop: 4 }}
                    />
                  </label>
                  <button className="btn btn-primary" style={{ marginTop: 6 }}>
                    Отправить
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
