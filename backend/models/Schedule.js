const mongoose = require("mongoose");

// ==========================
// TASK SCHEMA
// ==========================
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: [
        "Study",
        "Exercise",
        "Meditation",
        "Break",
        "Meal",
        "Sleep",
        "Other"
      ],
      default: "Study"
    },

    icon: {
      type: String,
      default: "📌"
    },

    completed: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);

// ==========================
// SCHEDULE SCHEMA
// ==========================
const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    date: {
      type: Date,
      required: true
    },

    tasks: [taskSchema]
  },
  {
    timestamps: true
  }
);

// 🔥 Faster search index
scheduleSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("Schedule", scheduleSchema);