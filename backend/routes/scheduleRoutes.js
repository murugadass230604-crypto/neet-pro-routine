const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const scheduleController = require("../controllers/scheduleController");

// ==========================================
// 📅 CREATE DAILY SCHEDULE
// ==========================================
router.post("/", protect, scheduleController.createSchedule);

// ==========================================
// 📥 GET ALL USER SCHEDULES
// ==========================================
router.get("/", protect, scheduleController.getSchedules);

// ==========================================
// 📌 GET TODAY SCHEDULE
// ==========================================
router.get("/today", protect, scheduleController.getTodaySchedule);

// ==========================================
// ✏ UPDATE FULL SCHEDULE
// ==========================================
router.put("/:id", protect, scheduleController.updateSchedule);

// ==========================================
// ❌ DELETE SCHEDULE
// ==========================================
router.delete("/:id", protect, scheduleController.deleteSchedule);

// ==========================================
// ➕ ADD NEW TASK TO SCHEDULE
// ==========================================
router.post("/:scheduleId/task", protect, scheduleController.addTask);

// ==========================================
// 🗑 DELETE SINGLE TASK
// ==========================================
router.delete("/:scheduleId/task/:taskId", protect, scheduleController.deleteTask);

// ==========================================
// ✅ TOGGLE TASK COMPLETION
// ==========================================
router.put("/:scheduleId/task/:taskId", protect, scheduleController.toggleTaskCompletion);

// ==========================================
// ✏ EDIT SINGLE TASK
// ==========================================
router.put("/:scheduleId/task/:taskId/edit", protect, scheduleController.editTask);

module.exports = router;