// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./Component/Common/ProtectedRoute.jsx";
import Login from "./Component/Auth/Login.jsx";
import { DashboardStats } from "./Component/Common/Dashboard.jsx";
import BlogAdmin from "./Component/Blog/BlogAdmin.jsx";
import ProjectsAdmin from "./Component/Projects/ProjectsAdmin.jsx";
import RevenueDashboard from "./Component/Revenue/RevenueDashboard.jsx";
import ChatDashboard from "./Component/Chat/index.jsx"; // your existing chat system

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardStats />} />
            <Route path="/blog" element={<BlogAdmin />} />
            <Route path="/projects" element={<ProjectsAdmin />} />
            <Route path="/revenue" element={<RevenueDashboard />} />
            <Route path="/chat" element={<ChatDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}