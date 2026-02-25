const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // Unique badge identifier (for system logic)
    slug: {
      type: String,
      required: true,
      trim: true
    },

    badge: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    icon: {
      type: String,
      default: "🏆"
    },

    category: {
      type: String,
      enum: ["Study", "Streak", "XP", "Consistency", "Special"],
      default: "Study"
    },

    rarity: {
      type: String,
      enum: ["Common", "Rare", "Epic", "Legendary"],
      default: "Common"
    },

    xpReward: {
      type: Number,
      default: 0
    },

    progress: {
      type: Number,
      default: 100
    },

    isSecret: {
      type: Boolean,
      default: false
    },

    dateEarned: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent duplicate same badge per user
achievementSchema.index(
  { userId: 1, slug: 1 },
  { unique: true }
);

// Performance index for leaderboard queries
achievementSchema.index({ category: 1 });
achievementSchema.index({ rarity: 1 });

module.exports = mongoose.model("Achievement", achievementSchema);