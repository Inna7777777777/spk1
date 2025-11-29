import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ru: {
    translation: {
      appTitle: "Админ-панель СПК «Хорошово-1»",
      menu: {
        dashboard: "Панель",
        users: "Пользователи",
        plots: "Участки",
        payments: "Платежи",
        news: "Новости",
        docs: "Документы",
        voting: "Голосования",
        forum: "Форум",
        chat: "Чат",
        settings: "Настройки"
      },
      langRu: "Русский",
      langEn: "English"
    }
  },
  en: {
    translation: {
      appTitle: "SPK «Khoroshovo-1» Admin Panel",
      menu: {
        dashboard: "Dashboard",
        users: "Users",
        plots: "Plots",
        payments: "Payments",
        news: "News",
        docs: "Documents",
        voting: "Voting",
        forum: "Forum",
        chat: "Chat",
        settings: "Settings"
      },
      langRu: "Русский",
      langEn: "English"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
