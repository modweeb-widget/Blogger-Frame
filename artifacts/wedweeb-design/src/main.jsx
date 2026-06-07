// src/main.jsx
import { createRoot } from "react-dom/client";
import App from "./App";

// دالة لتحميل التطبيق داخل Shadow DOM (عزل تام)
function mountWithShadowDOM() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('❌ عنصر #root غير موجود');
    return;
  }

  // إخفاء المحتوى الأصلي مؤقتاً
  rootElement.style.cssText = 'display: block !important; margin: 0 !important; padding: 0 !important;';
  
  // إنشاء Shadow DOM للعزل التام
  const shadowRoot = rootElement.attachShadow({ mode: 'open' });
  
  // إنشاء حاوية داخل الظل
  const appContainer = document.createElement('div');
  appContainer.id = 'modweeb-app';
  shadowRoot.appendChild(appContainer);
  
  // إضافة جميع الـ CSS داخل الظل (بدون تداخل)
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  // استخدم الرابط الصحيح بعد build
  styleLink.href = import.meta.env.BASE_URL + 'assets/index.css';
  shadowRoot.appendChild(styleLink);
  
  // إضافة ستايلات إضافية داخل الظل
  const inlineStyle = document.createElement('style');
  inlineStyle.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    #modweeb-app {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: 999999;
      background: #111827;
      overflow-y: auto;
    }
    
    /* تخصيص شريط التمرير */
    #modweeb-app::-webkit-scrollbar {
      width: 8px;
    }
    
    #modweeb-app::-webkit-scrollbar-track {
      background: #1f2937;
    }
    
    #modweeb-app::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-radius: 4px;
    }
  `;
  shadowRoot.appendChild(inlineStyle);
  
  // إضافة زر إغلاق (اختياري)
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 1000000;
    background: #3b82f6;
    color: white;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.2s;
  `;
  closeBtn.onmouseenter = () => {
    closeBtn.style.transform = 'scale(1.05)';
  };
  closeBtn.onmouseleave = () => {
    closeBtn.style.transform = 'scale(1)';
  };
  closeBtn.onclick = () => {
    rootElement.style.display = 'none';
  };
  shadowRoot.appendChild(closeBtn);
  
  // تحميل وتشغيل React داخل الظل
  createRoot(appContainer).render(<App />);
  
  console.log('✅ تم تحميل التطبيق داخل Shadow DOM - معزول تماماً عن Blogger');
}

// تشغيل التطبيق
mountWithShadowDOM();
