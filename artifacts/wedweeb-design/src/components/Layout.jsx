import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Preloader from "./Preloader";

export default function Layout({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("standalone-theme") === "dark";
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("standalone-theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div
      className={`standalone-page-container${isDark ? " dark-mode" : ""}`}
      dir="rtl"
    >
      <Preloader />
      <Header isDark={isDark} onToggle={toggleTheme} />
      <div className="content-wrapper">
        {children}
      </div>
      <Footer />
    </div>
  );
}
