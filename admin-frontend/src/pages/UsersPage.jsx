import React, { useEffect, useState } from "react";
import { Table, Tag, Select, message, Space } from "antd";
import api from "../api.js";

const roleColors = {
  admin: "red",
  chairman: "green",
  accountant: "gold",
  board: "blue",
  audit: "purple",
  gardener: "default",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  function loadUsers() {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => message.error("Не удалось загрузить пользователей"));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function changeRole(id, role) {
    api
      .patch(`/admin/users/${id}`, { role })
      .then(() => {
        message.success("Роль обновлена");
        loadUsers();
      })
      .catch(() => message.error("Ошибка при изменении роли"));
  }

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Email", dataIndex: "email" },
    { title: "ФИО", dataIndex: "name" },
    { title: "Участок", dataIndex: "plot_number", width: 100 },
    {
      title: "Роль",
      dataIndex: "role",
      render: (role, record) => (
        <Space>
          <Tag color={roleColors[role] || "default"}>{role}</Tag>
          <Select
            size="small"
            value={role}
            style={{ width: 130 }}
            onChange={(val) => changeRole(record.id, val)}
            options={[
              { value: "admin", label: "admin" },
              { value: "chairman", label: "chairman" },
              { value: "accountant", label: "accountant" },
              { value: "board", label: "board" },
              { value: "audit", label: "audit" },
              { value: "gardener", label: "gardener" },
            ]}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Пользователи</h2>
      <p>Полный список пользователей кооператива.</p>
      <Table rowKey="id" dataSource={users} columns={columns} />
    </>
  );
}
