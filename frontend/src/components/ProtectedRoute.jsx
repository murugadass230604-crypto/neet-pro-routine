import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔒 No token → Redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 👑 Role based protection (Optional)
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}