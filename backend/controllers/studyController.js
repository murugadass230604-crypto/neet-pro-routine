const StudyLog = require("../models/StudyLog");
const User = require("../models/User");
const Achievement = require("../models/Achievement");

// ==========================
// 🔥 LEVEL ENGINE
// ==========================
const calculateLevel = (xp) => {
  if (xp >= 2000) return "Legend";
  if (xp >= 1000) return "Champion";
  if (xp >= 600) return "Achiever";
  if (xp >= 300) return "Warrior";
  if (xp >= 100) return "Disciplined";
  return "Beginner";
};

// ==========================
// 🔥 STREAK ENGINE
// ==========================
const updateStreak = (user, studyDate) => {
  const today = new Date(studyDate).toDateString();

  if (!user.lastStudyDate) {
    user.streak = 1;
  } else {
    const last = new Date(user.lastStudyDate);
    const diff =
      (new Date(today) - new Date(last.toDateString())) /
      (1000 * 60 * 60 * 24);

    if (diff === 1) {
      user.streak += 1;
    } else if (diff > 1) {
      user.streak = 1;
    }
  }

  user.lastStudyDate = studyDate;
};

// ==========================
// 🔥 ADD STUDY LOG
// ==========================
exports.addStudyLog = async (req, res) => {
  try {
    const { subject, hours, examType, date } = req.body;

    if (!subject || !hours || !date) {
      return res.status(400).json({
        success: false,
        message: "Subject, hours and date required"
      });
    }

    const log = await StudyLog.create({
      userId: req.user._id,
      subject,
      hours,
      examType,
      date
    });

    const user = await User.findById(req.user._id);

    // 🔥 XP CALCULATION
    const earnedXP = hours * 10;
    user.xp += earnedXP;

    const previousLevel = user.level;
    user.level = calculateLevel(user.xp);

    const levelUp = previousLevel !== user.level;

    // 🔥 STREAK UPDATE
    updateStreak(user, date);

    await user.save();

    // 🔥 ACHIEVEMENT CHECK
    await checkAchievements(user._id);

    res.json({
      success: true,
      log,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      levelUp
    });

  } catch (error) {
    console.error("Add Study Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add study log"
    });
  }
};

// ==========================
// 🔥 ACHIEVEMENT SYSTEM
// ==========================
const checkAchievements = async (userId) => {
  const logs = await StudyLog.find({ userId });

  const totalHours = logs.reduce((sum, l) => sum + l.hours, 0);

  const achievements = [
    { badge: "10 Hours Starter", hours: 10 },
    { badge: "50 Hours Master", hours: 50 },
    { badge: "100 Hours Champion", hours: 100 }
  ];

  for (let a of achievements) {
    if (totalHours >= a.hours) {
      const exists = await Achievement.findOne({
        userId,
        badge: a.badge
      });

      if (!exists) {
        await Achievement.create({
          userId,
          badge: a.badge
        });
      }
    }
  }
};

// ==========================
// 🔥 MONTHLY STATS
// ==========================
exports.getMonthlyStats = async (req, res) => {
  try {
    const logs = await StudyLog.find({
      userId: req.user._id
    });

    const monthly = {};

    logs.forEach((log) => {
      const month = new Date(log.date).toLocaleString("default", {
        month: "short"
      });

      monthly[month] = (monthly[month] || 0) + log.hours;
    });

    res.json({
      success: true,
      monthly
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly stats"
    });
  }
};

// ==========================
// 🔥 WEEKLY STATS
// ==========================
exports.getWeeklyStats = async (req, res) => {
  try {
    const logs = await StudyLog.find({
      userId: req.user._id
    });

    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    const weeklyData = days.map((day) => {
      const total = logs
        .filter((l) => {
          const logDay = new Date(l.date).toLocaleString("default", {
            weekday: "short"
          });
          return logDay === day;
        })
        .reduce((sum, l) => sum + l.hours, 0);

      return { day, hours: total };
    });

    res.json({
      success: true,
      weeklyData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch weekly stats"
    });
  }
};

// ==========================
// 🔥 SUBJECT DISTRIBUTION
// ==========================
exports.getSubjectStats = async (req, res) => {
  try {
    const logs = await StudyLog.find({
      userId: req.user._id
    });

    const subjectStats = {};

    logs.forEach((log) => {
      subjectStats[log.subject] =
        (subjectStats[log.subject] || 0) + log.hours;
    });

    const result = Object.keys(subjectStats).map((key) => ({
      subject: key,
      hours: subjectStats[key]
    }));

    res.json({
      success: true,
      subjects: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch subject stats"
    });
  }
};

// ==========================
// 🔥 XP GROWTH ANALYTICS
// ==========================
exports.getXPGrowth = async (req, res) => {
  try {
    const logs = await StudyLog.find({
      userId: req.user._id
    }).sort({ date: 1 });

    let cumulativeXP = 0;

    const xpGrowth = logs.map((log) => {
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
      message: "Failed to fetch XP growth"
    });
  }
};