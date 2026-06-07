import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LogoIcon from "./LogoIcon";

function getUserState() {
  return {
    isLoggedIn: localStorage.getItem("userLoggedIn") === "true",
    name: localStorage.getItem("userName") || "",
    picture: localStorage.getItem("userPicture") || "",
  };
}

export default function Header({ isDark, onToggle }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUserState);

  useEffect(() => {
    const onStorage = () => setUser(getUserState());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <header className="custom-header">
      <div className="header-container">
        <a href="https://modweeb.com" className="header-brand" aria-label="ModweeB Design">
          <div className="logo-box">
            <LogoIcon style={{ transform: "scale(1.1)" }} />
          </div>
          <span className="header-title-text">ModweeB Design</span>
        </a>

        <div className="header-actions">
          <ThemeToggle isDark={isDark} onToggle={onToggle} />

          {user.isLoggedIn ? (
            <button
              className="header-avatar-btn"
              onClick={() => navigate("/tools/account")}
              aria-label="الحساب"
              title={user.name}
            >
              <img
                src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="header-avatar-img"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;
                }}
              />
            </button>
          ) : (
            <button
              className="header-login-btn"
              onClick={() => navigate("/tools/login")}
              aria-label="تسجيل الدخول"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
