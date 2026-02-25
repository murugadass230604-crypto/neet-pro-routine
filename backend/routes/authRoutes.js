const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  signup,
  login,
  sendResetOtp,
  resetPassword,
  getMe,
  updateProfile
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// ==========================
// 🌍 PUBLIC ROUTES
// ==========================

// 📧 Send Signup OTP
router.post("/send-otp", sendOtp);

// ✅ Verify OTP
router.post("/verify-otp", verifyOtp);

// 📝 Signup (Final Registration)
router.post("/signup", signup);

// 🔐 Login
router.post("/login", login);

// 🔁 Forgot Password OTP
router.post("/forgot-password", sendResetOtp);

// 🔄 Reset Password
router.post("/reset-password", resetPassword);

// ==========================
// 🔒 PROTECTED ROUTES
// ==========================

// 👤 Get Logged-in User
router.get("/me", protect, getMe);

// ✏ Update Profile
router.put("/update-profile", protect, updateProfile);

module.exports = router;