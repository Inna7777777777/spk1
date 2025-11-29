import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import api from "../api.js";

export default function NewsAdminPage() {
  const [news, setNews] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  function loadNews() {
    api
      .get("/news")
      .then((res) => setNews(res.data))
      .catch(() => message.error("Не удалось загрузить новости"));
  }

  useEffect(() => {
    loadNews();
  }, []);

  function onSubmit(values) {
    api
      .post("/news", values)
      .then(() => {
        message.success("Новость создана");
        setOpenModal(false);
        form.resetFields();
        loadNews();
      })
      .catch(() => message.error("Ошибка при создании (нужна роль chairman/admin)"));
  }

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Заголовок", dataIndex: "title" },
    {
      title: "Дата",
      dataIndex: "created_at",
      render: (v) => new Date(v).toLocaleString("ru-RU"),
      width: 160,
    },
  ];

  return (
    <>
      <h2>Новости</h2>
      <p>Управление новостями на публичном сайте.</p>
      <Button type="primary" style={{ marginBottom: 8 }} onClick={() => setOpenModal(true)}>
        Добавить новость
      </Button>
      <Table rowKey="id" dataSource={news} columns={columns} />

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        title="Новая новость"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="title"
            label="Заголовок"
            rules={[{ required: true, message: "Укажите заголовок" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="body"
            label="Текст новости"
            rules={[{ required: true, message: "Введите текст" }]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
