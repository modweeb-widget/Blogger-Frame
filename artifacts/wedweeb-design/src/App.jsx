// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
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

  if (initialRoute) {
    return (
      <div className="modweeb-app" data-modweeb="true">
        <MemoryRouter initialEntries={[initialRoute]}>
          <AppRouter />
        </MemoryRouter>
      </div>
    );
  }

  return (
    <div className="modweeb-app" data-modweeb="true">
      <BrowserRouter basename={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
        <AppRouter />
      </BrowserRouter>
    </div>
  );
}
