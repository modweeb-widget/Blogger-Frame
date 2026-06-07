import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../components/LogoIcon";

const CLIENT_ID =
  "36053852280-iqmfrcu1m2vd8ai6sc4e10r6afaiiln0.apps.googleusercontent.com";

export default function Login() {
  const navigate = useNavigate();
  const clientRef = useRef(null);
  const toastRef = useRef(null);

  const notify = (msg) => {
    if (!toastRef.current) return;
    toastRef.current.innerText = msg;
    toastRef.current.classList.add("lp-toast-active");
    setTimeout(() => toastRef.current?.classList.remove("lp-toast-active"), 3000);
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userPicture", userData.picture || userData.image || "");
    localStorage.setItem("userEmail", userData.email);
    if (!localStorage.getItem("userJoinDate")) {
      localStorage.setItem("userJoinDate", new Date().toISOString());
    }
    window.dispatchEvent(new StorageEvent("storage"));
    notify(`أهلاً بك، ${userData.name}!`);
    setTimeout(() => navigate("/tools/account"), 800);
  };

  const getUserInfo = async (token) => {
    try {
      notify("جارٍ تسجيل الدخول، يرجى الانتظار...");
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      handleLoginSuccess({ name: data.name, email: data.email, picture: data.picture });
    } catch {
      notify("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    }
  };

  const initGSI = () => {
    if (typeof google === "undefined" || !google.accounts) return;
    clientRef.current = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: "openid profile email",
      callback: (res) => {
        if (res && res.access_token) {
          getUserInfo(res.access_token);
        } else {
          notify("لم يتم العثور على رمز الوصول. يرجى المحاولة مرة أخرى.");
        }
      },
    });
  };

  useEffect(() => {
    if (localStorage.getItem("userLoggedIn") === "true") {
      navigate("/tools/account", { replace: true });
      return;
    }
    const existing = document.getElementById("gsi-script");
    if (existing) { initGSI(); return; }
    const script = document.createElement("script");
    script.id = "gsi-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGSI;
    document.head.appendChild(script);
  }, []);

  const handleGoogleClick = () => {
    if (clientRef.current) {
      clientRef.current.requestAccessToken();
    } else {
      notify("جارٍ التحميل، يرجى الانتظار لحظة...");
    }
  };

  return (
    <div className="lp-wrapper">
      <div className="lp-container">
        <div className="lp-inner">

          <div className="lp-brand">
            <div className="lp-logo-box">
              <LogoIcon style={{ transform: "scale(1.1)" }} />
            </div>
            <span className="lp-brand-text">ModweeB Design</span>
          </div>

          <div className="lp-card">
            <div className="lp-card-head">
              <b className="lp-card-title">مرحباً بعودتك</b>
              <p className="lp-card-sub">تسجيل الدخول باستخدام حسابك الاجتماعي</p>
            </div>
            <div className="lp-card-body">
              <button className="lp-google-btn" onClick={handleGoogleClick}>
                <svg className="lp-google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                تسجيل الدخول باستخدام Google
              </button>
            </div>
          </div>

          <p className="lp-terms">
            بالنقر على متابعة، فإنك توافق على{" "}
            <a href="/p/terms.html" className="lp-link">شروط الخدمة</a>
            {" "}و<br />
            <a href="/p/privacy-policy.html" className="lp-link">سياسة الخصوصية</a>.
          </p>
        </div>
      </div>
      <div className="lp-toast" ref={toastRef}></div>
    </div>
  );
}
