// src/App.jsx
import { useEffect } from "react";
import { HashRouter, MemoryRouter } from "react-router-dom";
import AppRouter from "./routes/Router";

export default function App() {
  useEffect(() => {
    // أضف كلاس التطبيق على العنصر الجذر
    const root = document.getElementById('root');
    if (root && !root.querySelector('.modweeb-app')) {
      // سيتم إضافة الكلاس عند التصيير
    }
  }, []);

  const initialRoute = window.__INITIAL_ROUTE__;

  // للتضمين في Blogger مع مسار مخصص
  if (initialRoute) {
    return (
      <div className="modweeb-app" data-modweeb="true">
        <MemoryRouter initialEntries={[initialRoute]}>
          <AppRouter />
        </MemoryRouter>
      </div>
    );
  }

  // لـ GitHub Pages - استخدم HashRouter (يعمل بدون خادم)
  return (
    <div className="modweeb-app" data-modweeb="true">
      <HashRouter>
        <AppRouter />
      </HashRouter>
    </div>
  );
}
