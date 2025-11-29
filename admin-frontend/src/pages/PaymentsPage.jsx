import React, { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import api from "../api.js";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);

  function loadPayments() {
    api
      .get("/admin/payments")
      .then((res) => setPayments(res.data))
      .catch(() => message.error("Не удалось загрузить платежи"));
  }

  useEffect(() => {
    loadPayments();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Пользователь ID", dataIndex: "user_id", width: 90 },
    { title: "Тип", dataIndex: "kind" },
    { title: "Сумма", dataIndex: "amount" },
    {
      title: "Статус",
      dataIndex: "status",
      render: (s) => {
        let color = s === "paid" ? "green" : "red";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "Создан",
      dataIndex: "created_at",
      render: (v) => new Date(v).toLocaleString("ru-RU"),
    },
    {
      title: "Оплачен",
      dataIndex: "paid_at",
      render: (v) => (v ? new Date(v).toLocaleString("ru-RU") : "-"),
    },
  ];

  return (
    <>
      <h2>Платежи</h2>
      <p>Журнал всех начислений и оплат.</p>
      <Table rowKey="id" dataSource={payments} columns={columns} />
    </>
  );
}
