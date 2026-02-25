import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // Handle Input Change
  // ==========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ==========================
  // Handle Login
  // ==========================
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", formData);

      // 🔥 Backend should return:
      // { token, user }

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      // ✅ Save token & role
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      setLoading(false);

      // ✅ Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      setLoading(false);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🚀 NEET Pro Login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.toggle}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: "20px" }}>
          <span style={{ fontSize: "13px", color: "#94a3b8" }}>
            👑 Admin access available
          </span>
        </div>

        <p style={{ marginTop: "10px" }}>
          <Link to="/forgot-password" style={styles.link}>
            Forgot Password?
          </Link>
        </p>

        <p style={{ marginTop: "15px" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// ==========================
// Styles
// ==========================
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
    padding: "20px"
  },
  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "none"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  error: {
    color: "#ef4444",
    marginBottom: "10px"
  },
  link: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: "bold"
  },
  toggle: {
    position: "absolute",
    right: "10px",
    top: "12px",
    cursor: "pointer",
    fontSize: "12px",
    color: "#94a3b8"
  }
};