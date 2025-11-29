import React, { useEffect, useState } from "react";
import { List, Button, Popconfirm, message } from "antd";
import api from "../api.js";

export default function ChatAdminPage() {
  const [messages, setMessages] = useState([]);

  function loadMessages() {
    api
      .get("/chat")
      .then((res) => setMessages(res.data))
      .catch(() => message.error("Не удалось загрузить сообщения"));
  }

  useEffect(() => {
    loadMessages();
  }, []);

  function deleteMsg(id) {
    api
      .delete(`/admin/chat/${id}`)
      .then(() => {
        message.success("Сообщение удалено");
        loadMessages();
      })
      .catch(() => message.error("Ошибка при удалении"));
  }

  return (
    <>
      <h2>Чат</h2>
      <p>Модерация сообщений в общем чате.</p>
      <List
        bordered
        dataSource={messages}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Popconfirm
                title="Удалить сообщение?"
                onConfirm={() => deleteMsg(item.id)}
                key="del"
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
    </>
  );
}
