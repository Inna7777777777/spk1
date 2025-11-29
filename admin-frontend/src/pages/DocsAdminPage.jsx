import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Switch, Space, Popconfirm, message } from "antd";
import api from "../api.js";

export default function DocsAdminPage() {
  const [docs, setDocs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  function loadDocs() {
    api
      .get("/documents")
      .then((res) => setDocs(res.data))
      .catch(() => message.error("Не удалось загрузить документы"));
  }

  useEffect(() => {
    loadDocs();
  }, []);

  function onSubmit(values) {
    api
      .post("/documents", values)
      .then(() => {
        message.success("Документ добавлен");
        setOpenModal(false);
        form.resetFields();
        loadDocs();
      })
      .catch(() => message.error("Ошибка при добавлении документа"));
  }

  function onDelete(id) {
    api
      .delete(`/documents/${id}`)
      .then(() => {
        message.success("Документ удалён");
        loadDocs();
      })
      .catch(() => message.error("Ошибка при удалении"));
  }

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Название", dataIndex: "title" },
    { title: "Категория", dataIndex: "category", width: 120 },
    {
      title: "Публичный",
      dataIndex: "is_public",
      width: 90,
      render: (v) => (v ? "Да" : "Нет"),
    },
    {
      title: "Дата",
      dataIndex: "created_at",
      render: (v) => new Date(v).toLocaleDateString("ru-RU"),
      width: 130,
    },
    {
      title: "Действия",
      render: (_, record) => (
        <Space>
          <a href={record.file_url} target="_blank" rel="noreferrer">
            Открыть
          </a>
          <Popconfirm
            title="Удалить документ?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button size="small" danger>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 160,
    },
  ];

  return (
    <>
      <h2>Документы</h2>
      <p>Управление документами: устав, протоколы, решения, сметы.</p>
      <Button type="primary" style={{ marginBottom: 8 }} onClick={() => setOpenModal(true)}>
        Добавить документ
      </Button>
      <Table rowKey="id" dataSource={docs} columns={columns} />

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        title="Новый документ"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="title"
            label="Название документа"
            rules={[{ required: true, message: "Введите название" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Категория">
            <Select
              allowClear
              options={[
                { value: "Устав", label: "Устав" },
                { value: "Протокол", label: "Протокол" },
                { value: "Решение", label: "Решение" },
                { value: "Смета", label: "Смета" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="file_url"
            label="Ссылка на файл (URL или путь)"
            rules={[{ required: true, message: "Укажите путь или URL файла" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="is_public"
            label="Публичный документ"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
