import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Form, Input, Select, message } from "antd";
import api from "../api.js";

export default function PlotsPage() {
  const [plots, setPlots] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  function loadPlots() {
    api
      .get("/map/plots")
      .then((res) => setPlots(res.data))
      .catch(() => message.error("Не удалось загрузить участки"));
  }

  useEffect(() => {
    loadPlots();
  }, []);

  function onNew() {
    setEditing(null);
    form.resetFields();
    setOpenModal(true);
  }

  function onEdit(record) {
    setEditing(record);
    form.setFieldsValue({
      number: record.number,
      owner_name: record.owner_name,
      status: record.status,
      comment: record.comment,
    });
    setOpenModal(true);
  }

  function onSubmit(values) {
    if (editing) {
      api
        .patch(`/map/plots/${editing.id}`, values)
        .then(() => {
          message.success("Участок обновлён");
          setOpenModal(false);
          loadPlots();
        })
        .catch(() => message.error("Ошибка при обновлении"));
    } else {
      api
        .post("/map/plots", values)
        .then(() => {
          message.success("Участок создан");
          setOpenModal(false);
          loadPlots();
        })
        .catch(() => message.error("Ошибка при создании"));
    }
  }

  const columns = [
    { title: "№", dataIndex: "number", width: 80 },
    { title: "Владелец", dataIndex: "owner_name" },
    {
      title: "Статус",
      dataIndex: "status",
      render: (s) => {
        let color = "default";
        let text = s;
        if (s === "ok") {
          color = "green";
          text = "Оплачено";
        } else if (s === "warn") {
          color = "gold";
          text = "Есть задолженность";
        } else if (s === "debt") {
          color = "red";
          text = "Просрочено";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    { title: "Комментарий", dataIndex: "comment" },
    {
      title: "Действия",
      render: (_, record) => (
        <Button size="small" onClick={() => onEdit(record)}>
          Редактировать
        </Button>
      ),
      width: 120,
    },
  ];

  return (
    <>
      <h2>Участки</h2>
      <p>Карточки участков и их статус по оплате.</p>
      <Button type="primary" style={{ marginBottom: 8 }} onClick={onNew}>
        Добавить участок
      </Button>
      <Table rowKey="id" dataSource={plots} columns={columns} />

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        title={editing ? "Редактирование участка" : "Новый участок"}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item
            name="number"
            label="Номер участка"
            rules={[{ required: true, message: "Укажите номер участка" }]}
          >
            <Input disabled={!!editing} />
          </Form.Item>
          <Form.Item name="owner_name" label="Владелец">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Статус">
            <Select
              options={[
                { value: "ok", label: "Оплачено" },
                { value: "warn", label: "Есть задолженность" },
                { value: "debt", label: "Просрочено" },
              ]}
            />
          </Form.Item>
          <Form.Item name="comment" label="Комментарий">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
