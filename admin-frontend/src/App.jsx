import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import PlotsPage from "./pages/PlotsPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";
import NewsAdminPage from "./pages/NewsAdminPage.jsx";
import DocsAdminPage from "./pages/DocsAdminPage.jsx";
import VotingAdminPage from "./pages/VotingAdminPage.jsx";
import ForumAdminPage from "./pages/ForumAdminPage.jsx";
import ChatAdminPage from "./pages/ChatAdminPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

export default function App() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/plots" element={<PlotsPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/news" element={<NewsAdminPage />} />
        <Route path="/docs" element={<DocsAdminPage />} />
        <Route path="/voting" element={<VotingAdminPage />} />
        <Route path="/forum" element={<ForumAdminPage />} />
        <Route path="/chat" element={<ChatAdminPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AdminLayout>
  );
}
