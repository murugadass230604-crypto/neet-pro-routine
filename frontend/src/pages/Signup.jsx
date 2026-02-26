import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    password: "",
    otp: ""
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    if (!formData.email) {
      return setMessage("Enter email first");
    }

    try {
      setLoading(true);
      setMessage("");

      await API.post("/auth/send-otp", {
        email: formData.email
      });

      setOtpSent(true);
      setMessage("OTP Sent to Email 📩");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      // STEP 1: VERIFY OTP
      await API.post("/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp
      });

      // STEP 2: COMPLETE SIGNUP
      await API.post("/auth/signup", {
        name: formData.name,
        age: formData.age,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        examType: "Banking"
      });

      alert("Signup Successful 🎉");
      navigate("/login");

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: "20px" }}>🔥 NEET Pro Signup</h2>

        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSignup}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            required
            value={formData.age}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Valid Email"
            required
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              style={styles.secondaryBtn}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                required
                value={formData.otp}
                onChange={handleChange}
                style={styles.input}
              />

              <button
                type="submit"
                disabled={loading}
                style={styles.button}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </>
          )}
        </form>

        <p style={{ marginTop: "20px" }}>
          Already have account?{" "}
          <Link to="/login" style={styles.link}>
            Sign In
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
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
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
    border: "none",
    background: "#334155",
    color: "white"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  secondaryBtn: {
    width: "100%",
    padding: "12px",
    background: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  message: {
    color: "#facc15",
    marginBottom: "10px",
    fontSize: "14px"
  },
  link: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: "bold"
  }
};