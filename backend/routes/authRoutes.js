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

const { protect } = require("../middleware/authMiddleware"); // ✅ FIXED

// ==========================
// PUBLIC ROUTES
// ==========================

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/send-reset-otp", sendResetOtp);
router.post("/reset-password", resetPassword);

// ==========================
// PROTECTED ROUTES
// ==========================

router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);

module.exports = router;