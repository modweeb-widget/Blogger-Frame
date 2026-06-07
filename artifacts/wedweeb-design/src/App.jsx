import { BrowserRouter, MemoryRouter } from "react-router-dom";
import AppRouter from "./routes/Router";

export default function App() {
  const initialRoute = window.__INITIAL_ROUTE__;

  if (initialRoute) {
    return (
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRouter />
      </MemoryRouter>
    );
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <AppRouter />
    </BrowserRouter>
  );
}
