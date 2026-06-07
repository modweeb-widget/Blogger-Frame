import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import RobotsGenerator from "../pages/RobotsGenerator";
import SeoAnalyzer from "../pages/SeoAnalyzer";
import Login from "../pages/Login";
import Account from "../pages/Account";

export default function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/tools" replace />} />
        <Route path="/tools" element={<Home />} />
        <Route path="/tools/login" element={<Login />} />
        <Route path="/tools/account" element={<Account />} />
        <Route path="/tools/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/tools/robots-generator" element={<RobotsGenerator />} />
        <Route path="/tools/seo-analyzer" element={<SeoAnalyzer />} />
      </Routes>
    </Layout>
  );
}
