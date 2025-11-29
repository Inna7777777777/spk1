import React, { useEffect, useState } from "react";
import { Table, Button, Drawer, List, Popconfirm, message } from "antd";
import api from "../api.js";

export default function ForumAdminPage() {
  const [topics, setTopics] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [posts, setPosts] = useState([]);

  function loadTopics() {
    api
      .get("/forum/topics")
      .then((res) => setTopics(res.data))
      .catch(() => message.error("Не удалось загрузить темы"));
  }

  useEffect(() => {
    loadTopics();
  }, []);

  function openTopic(t) {
    setSelectedTopic(t);
    api
      .get(`/forum/topics/${t.id}`)
      .then((res) => setPosts(res.data.posts || []))
      .catch(() => message.error("Ошибка при загрузке сообщений"));
    setOpenDrawer(true);
  }

  function deletePost(id) {
    api
      .delete(`/forum/posts/${id}`)
      .then(() => {
        message.success("Сообщение удалено");
        if (selectedTopic) openTopic(selectedTopic);
      })
      .catch(() => message.error("Ошибка при удалении сообщения"));
  }

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Тема", dataIndex: "title" },
    {
      title: "Дата",
      dataIndex: "created_at",
      width: 160,
      render: (v) => new Date(v).toLocaleString("ru-RU"),
    },
    {
      title: "Действия",
      width: 120,
      render: (_, record) => (
        <Button size="small" onClick={() => openTopic(record)}>
          Открыть
        </Button>
      ),
    },
  ];

  return (
    <>
      <h2>Форум</h2>
      <p>Модерация тем и сообщений.</p>
      <Table rowKey="id" dataSource={topics} columns={columns} />

      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title={selectedTopic ? selectedTopic.title : "Тема"}
        width={520}
      >
        <List
          dataSource={posts}
          bordered
          renderItem={(item) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Удалить сообщение?"
                  onConfirm={() => deletePost(item.id)}
                  key="delete"
                >
                  <Button danger size="small">
                    Удалить
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={new Date(item.created_at).toLocaleString("ru-RU")}
                description={item.body}
              />
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
}
