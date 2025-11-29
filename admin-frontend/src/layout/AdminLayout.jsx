import React from "react";
import { Layout, Menu, Typography, Flex, Button, Space } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  EnvironmentOutlined,
  WalletOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  MessageOutlined,
  CommentOutlined,
  SettingOutlined,
  PieChartOutlined
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function AdminLayout({ children }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">{t("menu.dashboard")}</Link> },
    { key: "/users", icon: <UserOutlined />, label: <Link to="/users">{t("menu.users")}</Link> },
    { key: "/plots", icon: <EnvironmentOutlined />, label: <Link to="/plots">{t("menu.plots")}</Link> },
    { key: "/payments", icon: <WalletOutlined />, label: <Link to="/payments">{t("menu.payments")}</Link> },
    { key: "/news", icon: <FileTextOutlined />, label: <Link to="/news">{t("menu.news")}</Link> },
    { key: "/docs", icon: <FileDoneOutlined />, label: <Link to="/docs">{t("menu.docs")}</Link> },
    { key: "/voting", icon: <PieChartOutlined />, label: <Link to="/voting">{t("menu.voting")}</Link> },
    { key: "/forum", icon: <MessageOutlined />, label: <Link to="/forum">{t("menu.forum")}</Link> },
    { key: "/chat", icon: <CommentOutlined />, label: <Link to="/chat">{t("menu.chat")}</Link> },
    { key: "/settings", icon: <SettingOutlined />, label: <Link to="/settings">{t("menu.settings")}</Link> }
  ];

  const onChangeLang = (lng) => {
    i18n.changeLanguage(lng);
  };

  const selectedKey =
    menuItems.find((item) => location.pathname.startsWith(item.key))?.key ||
    "/dashboard";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="60"
        style={{ background: "#0f5c2e" }}
      >
        <div style={{ padding: 16 }}>
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            СПК Х-1
          </Title>
          <div style={{ color: "#c6f6d5", fontSize: 12 }}>Admin</div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ background: "#0f5c2e" }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#ffffff",
            padding: "0 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
          }}
        >
          <Flex align="center" justify="space-between">
            <Title level={4} style={{ margin: 0 }}>
              {t("appTitle")}
            </Title>
            <Space>
              <Button size="small" onClick={() => onChangeLang("ru")}>
                {t("langRu")}
              </Button>
              <Button size="small" onClick={() => onChangeLang("en")}>
                {t("langEn")}
              </Button>
            </Space>
          </Flex>
        </Header>
        <Content style={{ padding: 24, background: "#f5f5fb" }}>
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              background: "#fff",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 6px 18px rgba(0,0,0,0.04)"
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
