import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";
import DocumentsPage from "./pages/DocumentsPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import ForumPage from "./pages/ForumPage.jsx";
import VotingPage from "./pages/VotingPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CabinetPage from "./pages/CabinetPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <div className="container header-inner">
          <div className="logo-block">
            <div className="logo-circle">Х1</div>
            <div>
              <div className="logo-title">СПК «Хорошово-1»</div>
              <div className="logo-subtitle">Портал садоводов</div>
            </div>
          </div>
          <nav className="main-nav">
            <Link to="/">Главная</Link>
            <Link to="/news">Новости</Link>
            <Link to="/payments">Взносы</Link>
            <Link to="/documents">Документы</Link>
            <Link to="/map">Карта</Link>
            <Link to="/forum">Форум</Link>
            <Link to="/voting">Голосование</Link>
            <Link to="/chat">Чат</Link>
          </nav>
          <div className="header-actions">
            <Link to="/login" className="btn btn-outline">Вход</Link>
            <Link to="/cabinet" className="btn btn-primary">Кабинет</Link>
          </div>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/voting" element={<VotingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span>© 2025 СПК «Хорошово-1»</span>
          <span>Портал садоводов</span>
        </div>
      </footer>
    </BrowserRouter>
  );
}
