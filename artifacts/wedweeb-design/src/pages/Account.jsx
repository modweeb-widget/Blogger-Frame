import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../components/LogoIcon";

function getOS() {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "ويندوز";
  if (ua.includes("Mac")) return "ماك";
  if (ua.includes("Linux")) return "لينكس";
  if (ua.includes("Android")) return "أندرويد";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "آيفون/آيباد";
  return "غير معروف";
}

async function getIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "غير معروف";
  }
}

function getCurrentTime() {
  return new Date().toLocaleString("en-US", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function formatDate(d) {
  if (!d || d === "undefined" || d === "null") return "غير محدد";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "غير محدد";
    return dt.toLocaleDateString("en-US", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return "غير محدد"; }
}

function getSessions() {
  try { return JSON.parse(localStorage.getItem("userSessions") || "[]"); }
  catch { return []; }
}
function saveSessions(ss) { localStorage.setItem("userSessions", JSON.stringify(ss)); }

export default function Account() {
  const navigate = useNavigate();
  const toastRef = useRef(null);
  const settingsPanelRef = useRef(null);
  const settingsBtnRef = useRef(null);

  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPicUrl, setEditPicUrl] = useState("");

  const notify = (msg) => {
    if (!toastRef.current) return;
    toastRef.current.innerText = msg;
    toastRef.current.classList.add("lp-toast-active");
    setTimeout(() => toastRef.current?.classList.remove("lp-toast-active"), 3000);
  };

  const loadUser = () => {
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    const name = localStorage.getItem("userName");
    if (!isLoggedIn || !name) { setUser(null); return; }
    setUser({
      name,
      picture: localStorage.getItem("userPicture"),
      email: localStorage.getItem("userEmail"),
      joinDate: localStorage.getItem("userJoinDate"),
    });
    setEditName(name);
    setSessions(getSessions());
  };

  const addCurrentSession = async () => {
    const cs = { id: Date.now(), time: getCurrentTime(), os: getOS(), ip: "جاري التحميل...", isCurrent: true };
    const ss = getSessions().filter((s) => !s.isCurrent);
    ss.push(cs);
    saveSessions(ss);
    setSessions([...ss]);
    const ip = await getIP();
    const updated = getSessions().map((s) => (s.isCurrent ? { ...s, ip } : s));
    saveSessions(updated);
    setSessions([...updated]);
  };

  const removeSession = (id) => {
    const ss = getSessions().filter((s) => s.id !== id);
    saveSessions(ss);
    setSessions([...ss]);
    notify("تم إزالة الجلسة بنجاح");
  };

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPicture");
    localStorage.removeItem("userJoinDate");
    localStorage.removeItem("userSessions");
    window.dispatchEvent(new StorageEvent("storage"));
    notify("تم تسجيل الخروج!");
    setTimeout(() => navigate("/tools/login"), 600);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const name = editName.trim();
    if (!name) { notify("الاسم مطلوب."); return; }
    localStorage.setItem("userName", name);
    if (editPicUrl.trim()) localStorage.setItem("userPicture", editPicUrl.trim());
    window.dispatchEvent(new StorageEvent("storage"));
    loadUser();
    setShowSettings(false);
    notify("تم حفظ التعديلات بنجاح!");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditPicUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (localStorage.getItem("userLoggedIn") !== "true") {
      navigate("/tools/login", { replace: true });
      return;
    }
    loadUser();
    if (!getSessions().some((s) => s.isCurrent)) addCurrentSession();
    const onStorage = () => loadUser();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        showSettings &&
        settingsPanelRef.current &&
        settingsBtnRef.current &&
        !settingsPanelRef.current.contains(e.target) &&
        !settingsBtnRef.current.contains(e.target)
      ) setShowSettings(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showSettings]);

  if (!user) return null;

  const sortedSessions = [...sessions].sort((a, b) => b.id - a.id);

  return (
    <div className="ac-wrapper">
      <div className="ac-card">

        <div className="ac-card-header">
          <div className="ac-brand">
            <div className="ac-logo-box">
              <LogoIcon style={{ transform: "scale(1.1)" }} />
            </div>
            <span className="ac-brand-text">ModweeB Design</span>
          </div>
          <div className="ac-header-actions" style={{ position: "relative" }}>
            <button
              ref={settingsBtnRef}
              className="ac-settings-btn"
              title="الإعدادات"
              onClick={(e) => { e.stopPropagation(); setShowSettings((p) => !p); }}
              aria-label="الإعدادات"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" strokeMiterlimit="10" />
                <path d="M2 12.88V11.12C2 10.08 2.85 9.22 3.9 9.22C5.71 9.22 6.45 7.94 5.54 6.37C5.02 5.4 5.36 4.17 6.34 3.65L8.08 2.69C8.93 2.22 10.01 2.52 10.48 3.37L10.59 3.57C11.49 5.14 12.97 5.14 13.88 3.57L13.99 3.37C14.46 2.52 15.54 2.22 16.39 2.69L18.13 3.65C19.11 4.17 19.45 5.4 18.93 6.37C18.02 7.94 18.76 9.22 20.57 9.22C21.61 9.22 22.47 10.07 22.47 11.12V12.88C22.47 13.92 21.62 14.78 20.57 14.78C18.76 14.78 18.02 16.06 18.93 17.63C19.45 18.61 19.11 19.83 18.13 20.35L16.39 21.31C15.54 21.78 14.46 21.48 13.99 20.63L13.88 20.43C12.98 18.86 11.5 18.86 10.59 20.43L10.48 20.63C10.01 21.48 8.93 21.78 8.08 21.31L6.34 20.35C5.36 19.83 5.02 18.6 5.54 17.63C6.45 16.06 5.71 14.78 3.9 14.78C2.85 14.78 2 13.92 2 12.88Z" strokeMiterlimit="10" />
              </svg>
            </button>

            {showSettings && (
              <div className="ac-settings-panel" ref={settingsPanelRef} onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSaveProfile}>
                  <label className="ac-label">
                    الاسم:
                    <input type="text" className="ac-input" value={editName}
                      onChange={(e) => setEditName(e.target.value)} maxLength={32} required />
                  </label>
                  <div className="ac-divider" />
                  <div className="ac-label-title">تغيير الصورة:</div>
                  <label className="ac-label">
                    (برفع صورة من جهازك)
                    <input type="file" className="ac-input-file" accept="image/*" onChange={handleFileChange} />
                  </label>
                  <div className="ac-divider" />
                  <label className="ac-label">
                    (أو برابط مباشر للصورة)
                    <input type="url" className="ac-input" placeholder="https://example.com/avatar.jpg"
                      value={editPicUrl} onChange={(e) => setEditPicUrl(e.target.value)} />
                  </label>
                  <button type="submit" className="ac-save-btn">حفظ التعديلات</button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="ac-card-content">
          <div className="ac-user-row">
            <img
              src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
              className="ac-avatar"
              alt={user.name}
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`; }}
            />
            <div className="ac-user-info">
              <div className="ac-user-name">{user.name}</div>
              <div className="ac-user-email">{user.email}</div>
              <div className="ac-user-join">تاريخ الانضمام: {formatDate(user.joinDate)}</div>
            </div>
          </div>

          <div className="ac-actions-row">
            <button className="ac-btn-outline" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                <path d="M17 7L15.59 8.41 18.17 11H8v2h10.17l-2.59 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              تسجيل الخروج
            </button>
          </div>

          <div className="ac-section-title">جلسات تسجيل الدخول</div>
          <div className="ac-sessions">
            {sortedSessions.map((s) => (
              <div key={s.id} className="ac-session-item">
                <div className="ac-session-info">
                  <div className="ac-session-row">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.75 13.25C20.75 18.08 16.83 22 12 22C7.17 22 3.25 18.08 3.25 13.25C3.25 8.42 7.17 4.5 12 4.5C16.83 4.5 20.75 8.42 20.75 13.25Z" />
                      <path d="M12 8V13" /><path d="M9 2H15" strokeMiterlimit="10" />
                    </svg>
                    <span>الوقت: {s.time}</span>
                  </div>
                  <div className="ac-session-row">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 16.95H6.21C2.84 16.95 2 16.11 2 12.74V6.74C2 3.37 2.84 2.53 6.21 2.53H16.74C20.11 2.53 20.95 3.37 20.95 6.74" />
                      <path d="M10 21.47V16.95" /><path d="M2 12.95H10" /><path d="M6.74 21.47H10" />
                      <path d="M22 12.8V18.51C22 20.88 21.41 21.47 19.04 21.47H15.49C13.12 21.47 12.53 20.88 12.53 18.51V12.8C12.53 10.43 13.12 9.84 15.49 9.84H19.04C21.41 9.84 22 10.43 22 12.8Z" />
                      <path d="M17.24 18.25H17.25" />
                    </svg>
                    <span>النظام: {s.os}</span>
                  </div>
                  <div className="ac-session-row">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" />
                    </svg>
                    <span>IP: {s.ip}</span>
                  </div>
                  {s.isCurrent && <span className="ac-current-badge">الجلسة الحالية</span>}
                </div>
                {!s.isCurrent && (
                  <button className="ac-remove-btn" onClick={() => removeSession(s.id)}>إزالة</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lp-toast" ref={toastRef}></div>
    </div>
  );
}
