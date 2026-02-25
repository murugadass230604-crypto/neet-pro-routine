const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  addStudyLog,
  getWeeklyStats,
  getMonthlyStats,
  getSubjectStats,
  getXPGrowth
} = require("../controllers/studyController");

// ==========================
// 📚 STUDY LOG ROUTES
// ==========================

// Add Study Session
router.post("/", protect, addStudyLog);

// ==========================
// 📊 ANALYTICS ROUTES
// ==========================

// Weekly Stats
router.get("/weekly", protect, getWeeklyStats);

// Monthly Stats
router.get("/monthly", protect, getMonthlyStats);

// Subject Distribution
router.get("/subjects", protect, getSubjectStats);

// XP Growth
router.get("/xp-growth", protect, getXPGrowth);

// ==========================
// 🔥 FOCUS MODE XP (Optional)
// ==========================

router.post("/add-xp", protect, async (req, res) => {
  try {
    const User = require("../models/User");

    const { xp } = req.body;

    if (!xp) {
      return res.status(400).json({
        success: false,
        message: "XP value required"
      });
    }

    const user = await User.findById(req.user._id);

    user.xp += xp;

    await user.save();

    res.json({
      success: true,
      xp: user.xp,
      level: user.level
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add XP"
    });
  }
});

module.exports = router;