import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic } from "antd";
import api from "../api.js";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    plots: 0,
    payments: 0,
    news: 0
  });

  useEffect(() => {
    api.get("/admin/stats")
      .then(res => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <h2>Панель администратора</h2>
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title="Пользователей" value={stats.users} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title="Участков" value={stats.plots} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title="Платежей" value={stats.payments} />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic title="Новостей" value={stats.news} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
