const User = require("../models/User");
const Schedule = require("../models/Schedule");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// ==========================
// 🔐 Generate JWT
// ==========================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

// ==========================
// 📧 SEND SIGNUP OTP
// ==========================
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    let user = await User.findOne({ email }).select("+otp +otpExpiry");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (!user) {
      user = new User({
        name: "TempUser",
        email,
        password: "Temp@123456",
        isVerified: false
      });
    }

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "NEET Pro",
          email: "murugadass230604@gmail.com"
        },
        to: [{ email }],
        subject: "NEET Pro Signup OTP",
        htmlContent: `<h2>Your OTP: ${otp}</h2><p>Valid for 5 minutes</p>`
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("BREVO ERROR:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  }
};

// ==========================
// 🔥 VERIFY OTP
// ==========================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select("+otp +otpExpiry");

    if (!user || user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired"
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};

// ==========================
// 🔥 SIGNUP
// ==========================
const signup = async (req, res) => {
  try {
    const { name, age, email, phone, password, examType } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Verify OTP first"
      });
    }

    // ✅ Update user details
    user.name = name;
    user.age = age;
    user.phone = phone;
    user.password = password;
    user.examType = examType;

await user.save();

// ✅ Check if schedule already exists
const existingSchedule = await Schedule.findOne({
  userId: user._id
});

if (!existingSchedule) {
  await Schedule.create({
    userId: user._id,
    date: new Date(),
    tasks: [
      { title: "Wake Up", startTime: "05:00", endTime: "05:15", category: "Other", icon: "🌅" },
      { title: "Exercise", startTime: "05:15", endTime: "05:45", category: "Exercise", icon: "🏃" },
      { title: "Meditation", startTime: "05:45", endTime: "06:00", category: "Meditation", icon: "🧘" },
      { title: "Breakfast", startTime: "08:00", endTime: "08:30", category: "Meal", icon: "🍳" },
      { title: "Study Session 1", startTime: "09:00", endTime: "12:00", category: "Study", icon: "📚" },
      { title: "Lunch", startTime: "12:30", endTime: "13:00", category: "Meal", icon: "🍛" },
      { title: "Power Nap", startTime: "13:00", endTime: "13:30", category: "Sleep", icon: "😴" },
      { title: "Workout", startTime: "17:00", endTime: "18:00", category: "Exercise", icon: "💪" },
      { title: "Study Session 2", startTime: "19:00", endTime: "21:00", category: "Study", icon: "📖" },
      { title: "Dinner", startTime: "21:00", endTime: "21:30", category: "Meal", icon: "🍽" },
      { title: "Bed Time", startTime: "22:00", endTime: "05:00", category: "Sleep", icon: "🌙" }
    ]
  });
}

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      token,
      user
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({
      success: false,
      message: "Signup failed"
    });
  }
};

// ==========================
// 🔥 LOGIN
// ==========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Verify your email first"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

// ==========================
// 📧 SEND RESET OTP
// ==========================
const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "NEET Pro",
          email: "murugadass230604@gmail.com"
        },
        to: [{ email }],
        subject: "Password Reset OTP",
        htmlContent: `<h2>Your Reset OTP: ${otp}</h2>`
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      message: "Reset OTP sent"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send reset OTP"
    });
  }
};

// ==========================
// 🔥 RESET PASSWORD
// ==========================
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email }).select("+resetOtp +resetOtpExpiry");

    if (!user || user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired"
      });
    }

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Reset failed"
    });
  }
};

// ==========================
// 👤 GET PROFILE
// ==========================
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// ==========================
// ✏ UPDATE PROFILE
// ==========================
const updateProfile = async (req, res) => {
  try {
    const user = req.user;

    user.name = req.body.name ?? user.name;
    user.age = req.body.age ?? user.age;
    user.phone = req.body.phone ?? user.phone;
    user.theme = req.body.theme ?? user.theme;
    user.profilePhoto = req.body.profilePhoto ?? user.profilePhoto;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  signup,
  login,
  sendResetOtp,
  resetPassword,
  getMe,
  updateProfile
};