import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AddStudy from "./pages/AddStudy";
import FocusMode from "./pages/FocusMode";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";   // 🔥 ADD THIS

import KrishnaAssistant from "./components/KrishnaAssistant";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= ADMIN ROUTE ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-study" element={<AddStudy />} />
          <Route path="focus" element={<FocusMode />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>

      <KrishnaAssistant />
      <Toaster position="top-right" />

    </BrowserRouter>
  );
}

export default App;