import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, message } from "antd";
import api from "../.api.js";

export default function VotingAdminPage() {
  const [votes, setVotes] = useState([]);
  const [results, setResults] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  function loadVotes() {
    api
      .get("/voting")
      .then((res) => setVotes(res.data))
      .catch(() => message.error("Не удалось загрузить голосования"));
  }

  useEffect(() => {
    loadVotes();
  }, []);

  function openResults(voteId) {
    api
      .get(`/voting/${voteId}/results`)
      .then((res) => setResults(res.data))
      .catch(() => message.error("Ошибка загрузки результатов"));
  }

  function onSubmit(values) {
    const options = values.options
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    api
      .post("/voting", {
        title: values.title,
        description: values.description || null,
        options,
      })
      .then(() => {
        message.success("Голосование создано");
        setOpenModal(false);
        form.resetFields();
        loadVotes();
      })
      .catch(() => message.error("Ошибка при создании (нужна роль chairman/admin)"));
  }

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Тема", dataIndex: "title" },
    {
      title: "Статус",
      dataIndex: "is_active",
      width: 90,
      render: (v) => (v ? "Активно" : "Завершено"),
    },
    {
      title: "Дата",
      dataIndex: "created_at",
      width: 160,
      render: (v) => new Date(v).toLocaleString("ru-RU"),
    },
    {
      title: "Действия",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openResults(record.id)}>
            Результаты
          </Button>
        </Space>
      ),
      width: 140,
    },
  ];

  return (
    <>
      <h2>Голосования</h2>
      <p>Создание и просмотр голосований кооператива.</p>
      <Button type="primary" style={{ marginBottom: 8 }} onClick={() => setOpenModal(true)}>
        Новое голосование
      </Button>
      <Table rowKey="id" dataSource={votes} columns={columns} />

      {results && (
        <div style={{ marginTop: 16 }}>
          <h3>Результаты: {results.title}</h3>
          <ul>
            {results.results.map((r) => (
              <li key={r.option_id}>
                {r.text}: <b>{r.votes}</b>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        title="Новое голосование"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="title"
            label="Тема голосования"
            rules={[{ required: true, message: "Укажите тему" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="options"
            label="Варианты (каждый с новой строки)"
            rules={[{ required: true, message: "Введите варианты" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
