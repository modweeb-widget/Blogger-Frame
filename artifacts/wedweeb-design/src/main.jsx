// src/main.jsx
import { createRoot } from "react-dom/client";
import App from "./App";

// استيراد ملفات CSS بالترتيب الصحيح
import "./index.css";           // أولاً: العزل العام
import "./styles/variables.css"; // ثانياً: المتغيرات
import "./styles/globals.css";   // ثالثاً: الستايلات العامة
import "./styles/layout.css";    // رابعاً: تنسيق الهيكل
import "./styles/auth.css";      // خامساً: تنسيق المصادقة

const rootElement = document.getElementById("root");

if (rootElement) {
  // أضف كلاس فريد للتطبيق
  rootElement.classList.add('modweeb-root');
  
  createRoot(rootElement).render(<App />);
}
