const express = require("express");
const PDFDocument = require("pdfkit");
const StudyLog = require("../models/StudyLog");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================
// 📄 WEEKLY PDF REPORT
// ==========================
router.get("/weekly", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const logs = await StudyLog.find({ userId }).sort({ date: -1 });

    const user = await User.findById(userId);

    const totalHours = logs.reduce((sum, l) => sum + l.hours, 0);

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=weekly-report.pdf"
    );

    doc.pipe(res);

    // Header
    doc
      .fontSize(22)
      .fillColor("#1e293b")
      .text("NEET PRO - Weekly Study Report", { align: "center" });

    doc.moveDown();

    doc
      .fontSize(14)
      .fillColor("black")
      .text(`Name: ${user.name}`)
      .text(`Email: ${user.email}`)
      .text(`Level: ${user.level}`)
      .text(`XP: ${user.xp}`)
      .text(`Current Streak: ${user.streak} days`);

    doc.moveDown();

    doc.fontSize(16).text("Study Logs:", { underline: true });
    doc.moveDown(0.5);

    logs.forEach((log) => {
      doc
        .fontSize(12)
        .text(
          `${new Date(log.date).toDateString()} | ${log.subject} | ${log.hours} hrs`
        );
    });

    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Total Study Hours: ${totalHours} hrs`, {
        align: "right",
      });

    doc.end();

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate weekly report"
    });
  }
});

// ==========================
// 📄 MONTHLY PDF REPORT
// ==========================
router.get("/monthly", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const logs = await StudyLog.find({ userId }).sort({ date: -1 });

    const user = await User.findById(userId);

    const monthlyStats = {};

    logs.forEach((log) => {
      const month = new Date(log.date).toLocaleString("default", {
        month: "long",
      });
      monthlyStats[month] =
        (monthlyStats[month] || 0) + log.hours;
    });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=monthly-report.pdf"
    );

    doc.pipe(res);

    doc
      .fontSize(22)
      .fillColor("#1e293b")
      .text("NEET PRO - Monthly Study Report", { align: "center" });

    doc.moveDown();

    doc
      .fontSize(14)
      .fillColor("black")
      .text(`Name: ${user.name}`)
      .text(`Level: ${user.level}`)
      .text(`XP: ${user.xp}`);

    doc.moveDown();

    doc.fontSize(16).text("Monthly Breakdown:", { underline: true });
    doc.moveDown(0.5);

    Object.keys(monthlyStats).forEach((month) => {
      doc.text(`${month} : ${monthlyStats[month]} hrs`);
    });

    doc.end();

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate monthly report"
    });
  }
});

module.exports = router;