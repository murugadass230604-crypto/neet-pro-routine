const mongoose = require("mongoose");
const StudyLog = require("../models/StudyLog");
const User = require("../models/User");
const Achievement = require("../models/Achievement");

// ==========================
// 🧠 DASHBOARD SUMMARY
// ==========================
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const user = await User.findById(userId);

    const totalLogs = await StudyLog.countDocuments({ userId });
    const totalAchievements = await Achievement.countDocuments({ userId });

    const totalHoursAgg = await StudyLog.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$hours" } } }
    ]);

    const totalHours = totalHoursAgg[0]?.total || 0;

    res.json({
      success: true,
      summary: {
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        totalLogs,
        totalAchievements,
        totalHours
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Dashboard summary failed"
    });
  }
};

// ==========================
// 📊 WEEKLY ANALYTICS (Last 7 Days)
// ==========================
exports.getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const logs = await StudyLog.find({
      userId,
      date: { $gte: sevenDaysAgo }
    });

    const weeklyMap = {};

    logs.forEach(log => {
      const day = new Date(log.date).toLocaleDateString("en-US", {
        weekday: "short"
      });

      weeklyMap[day] = (weeklyMap[day] || 0) + log.hours;
    });

    res.json({
      success: true,
      weekly: weeklyMap
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Weekly analytics failed"
    });
  }
};

// ==========================
// 📅 MONTHLY ANALYTICS
// ==========================
exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const logs = await StudyLog.find({ userId });

    const monthlyMap = {};

    logs.forEach(log => {
      const month = new Date(log.date).toLocaleDateString("en-US", {
        month: "short"
      });

      monthlyMap[month] =
        (monthlyMap[month] || 0) + log.hours;
    });

    res.json({
      success: true,
      monthly: monthlyMap
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Monthly analytics failed"
    });
  }
};

// ==========================
// 📚 SUBJECT DISTRIBUTION
// ==========================
exports.getSubjectDistribution = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const data = await StudyLog.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$subject",
          totalHours: { $sum: "$hours" }
        }
      },
      { $sort: { totalHours: -1 } }
    ]);

    const formatted = data.map(item => ({
      subject: item._id,
      hours: item.totalHours
    }));

    res.json({
      success: true,
      subjects: formatted
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Subject analytics failed"
    });
  }
};

// ==========================
// 🔥 XP GROWTH (CUMULATIVE)
// ==========================
exports.getXpGrowth = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const logs = await StudyLog.find({ userId }).sort({ date: 1 });

    let cumulativeXP = 0;

    const xpGrowth = logs.map(log => {
      cumulativeXP += log.hours * 10;

      return {
        date: log.date,
        xp: cumulativeXP
      };
    });

    res.json({
      success: true,
      xpGrowth
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "XP growth failed"
    });
  }
};