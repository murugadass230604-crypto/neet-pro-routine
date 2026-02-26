const User = require("../models/User");
const Schedule = require("../models/Schedule");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
// 📧 MAIL TRANSPORTER
// ==========================
// ==========================
// 📧 MAIL TRANSPORTER (FIXED FOR RENDER)
// ==========================
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST || "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000, // 10 sec
  greetingTimeout: 10000,
  socketTimeout: 10000
});

console.log("BREVO_USER:", process.env.BREVO_USER);
console.log("BREVO_PASS exists:", !!process.env.BREVO_PASS);

// ==========================
// SMTP VERIFY (ONLY IN DEV)
// ==========================
if (process.env.NODE_ENV !== "production") {
  transporter.verify((error, success) => {
    if (error) {
      console.log("❌ SMTP Error:", error);
    } else {
      console.log("✅ SMTP Server is ready");
    }
  });
}

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

    try {
      await transporter.sendMail({
        from: `"NEET Pro" <${process.env.BREVO_USER}>`,
        to: email,
        subject: "NEET Pro Signup OTP",
        html: `<h2>Your OTP: ${otp}</h2><p>Valid for 5 minutes</p>`
      });
    } catch (mailError) {
      console.error("SMTP Error:", mailError);
      return res.status(500).json({
        success: false,
        message: "Email service error"
      });
    }

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("Signup OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  }
};

// ==========================
// 🔥 VERIFY OTP ONLY
// ==========================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select("+otp +otpExpiry");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.otp !== otp) {
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
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};

// ==========================
// 🔥 VERIFY OTP + REGISTER
// ==========================
const signup = async (req, res) => {
  try {
    const { name, age, email, phone, password, examType } = req.body;

  const user = await User.findOne({ email }).select("+otp +otpExpiry");

if (!user) {
  return res.status(400).json({
    success: false,
    message: "User not found. Request OTP first."
  });
}

if (!user.isVerified) {
  return res.status(400).json({
    success: false,
    message: "Please verify OTP first"
  });
}

    // ✅ Update user details
    user.name = name;
    user.age = age;
    user.phone = phone;
    user.password = password;
    user.examType = examType;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    // ✅ DEFAULT ROUTINE
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
    console.error("Login Error:", error);
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

    await transporter.sendMail({
      from: `"NEET Pro" <murugadass230604gmail.com>`,
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your Reset OTP: ${otp}</h2>`
    });

    res.json({
      success: true,
      message: "Reset OTP sent"
    });

  } catch (error) {
    console.error("Reset OTP Error:", error);
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
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "Reset failed"
    });
  }
};

// ==========================
// 👤 GET LOGGED-IN USER
// ==========================
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    });
  }
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
    console.error("Update Profile Error:", error);
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