const mongoose = require("mongoose");

const studySchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
      index: true
    },

    subject: { 
      type: String,
      required: true,
      trim: true
    },

    hours: { 
      type: Number,
      required: true,
      min: 0.5
    },

    examType: { 
      type: String,
      enum: ["Banking", "TNPSC", "SSLC"],
      default: "Banking"
    },

    date: { 
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// Compound index for performance
studySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("StudyLog", studySchema);