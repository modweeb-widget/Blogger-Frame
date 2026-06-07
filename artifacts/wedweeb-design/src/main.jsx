// src/main.jsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";  // أضف هذا السطر أولاً
import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/auth.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  // أضف كلاس فريد قبل تحميل التطبيق
  rootElement.classList.add('modweeb-root');
  
  createRoot(rootElement).render(<App />);
}
