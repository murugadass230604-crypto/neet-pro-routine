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

const { protect } = require("../middlewares/authMiddleware");

// ==========================
// PUBLIC ROUTES
// ==========================

// Send OTP
router.post("/send-otp", sendOtp);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Complete Signup (after OTP)
router.post("/signup", signup);

// Login
router.post("/login", login);

// Send Reset OTP
router.post("/send-reset-otp", sendResetOtp);

// Reset Password
router.post("/reset-password", resetPassword);


// ==========================
// PROTECTED ROUTES
// ==========================

// Get logged-in user
router.get("/me", protect, getMe);

// Update profile
router.put("/update-profile", protect, updateProfile);

module.exports = router;