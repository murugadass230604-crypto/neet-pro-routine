const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ==========================
    // BASIC INFO
    // ==========================
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true
    },

    phone: {
      type: String,
      trim: true,
      index: true
    },

    age: {
      type: Number,
      min: 10,
      max: 80
    },

    purpose: {
      type: String,
      trim: true,
      maxlength: 200
    },

    examType: {
      type: String,
      enum: ["Banking", "TNPSC", "SSLC"],
      default: "Banking"
    },

    // ==========================
    // AUTH
    // ==========================
    password: {
      type: String,
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // ==========================
    // SIGNUP OTP
    // ==========================
    otp: {
      type: String,
      select: false
    },

    otpExpiry: {
      type: Date
    },

    // ==========================
    // RESET OTP
    // ==========================
    resetOtp: {
      type: String,
      select: false
    },

    resetOtpExpiry: {
      type: Date
    },

    // ==========================
    // PROFILE
    // ==========================
    profilePhoto: {
      type: String,
      default: ""
    },

    theme: {
      type: String,
      enum: ["royal", "dark", "light", "ultra"],
      default: "royal"
    },

    // ==========================
    // GAMIFICATION
    // ==========================
    xp: {
      type: Number,
      default: 0,
      min: 0
    },

    level: {
      type: String,
      default: "Beginner"
    },

    streak: {
      type: Number,
      default: 0,
      min: 0
    },

    lastStudyDate: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.otp;
        delete ret.resetOtp;
        delete ret.__v;
        return ret;
      }
    }
  }
);


// ==========================
// HASH PASSWORD (FIXED VERSION)
// ==========================
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});


// ==========================
// PASSWORD COMPARE
// ==========================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", userSchema);