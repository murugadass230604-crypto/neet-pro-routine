const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User");
const StudyLog = require("../models/StudyLog");

// ==========================
// 📊 ADMIN DASHBOARD STATS
// ==========================
router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      const totalStudyLogs = await StudyLog.countDocuments();

      res.json({
        success: true,
        stats: {
          totalUsers,
          activeUsers,
          totalStudyLogs
        }
      });
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard stats"
      });
    }
  }
);

// ==========================
// 👥 GET ALL USERS
// ==========================
router.get(
  "/users",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");

      res.json({
        success: true,
        count: users.length,
        users
      });
    } catch (error) {
      console.error("Get Users Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users"
      });
    }
  }
);

// ==========================
// 🗑 DELETE USER
// ==========================
router.delete(
  "/user/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // Prevent deleting another admin
      if (user.role === "admin") {
        return res.status(403).json({
          success: false,
          message: "Cannot delete admin account"
        });
      }

      await user.deleteOne();

      res.json({
        success: true,
        message: "User deleted successfully"
      });

    } catch (error) {
      console.error("Delete User Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete user"
      });
    }
  }
);

module.exports = router;