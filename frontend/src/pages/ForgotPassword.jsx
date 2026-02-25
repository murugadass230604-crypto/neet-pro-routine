import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    try {
      await API.post("/auth/forgot-password", {
        email: form.email
      });
      setStep(2);
      setMessage("OTP sent to email");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    }
  };

  const resetPassword = async () => {
    try {
      await API.post("/auth/reset-password", form);
      setMessage("Password updated successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Forgot Password</h2>

      {message && <p>{message}</p>}

      {step === 1 && (
        <>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            onChange={handleChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            onChange={handleChange}
          />
          <button onClick={resetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
}