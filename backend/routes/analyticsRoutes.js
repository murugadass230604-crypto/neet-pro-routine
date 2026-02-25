const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getDashboardSummary,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getSubjectDistribution,
  getXpGrowth
} = require("../controllers/analyticsController");

// Dashboard Summary
router.get("/summary", protect, getDashboardSummary);

// Weekly Analytics
router.get("/weekly", protect, getWeeklyAnalytics);

// Monthly Analytics
router.get("/monthly", protect, getMonthlyAnalytics);

// Subject Distribution
router.get("/subjects", protect, getSubjectDistribution);

// XP Growth
router.get("/xp-growth", protect, getXpGrowth);

module.exports = router;