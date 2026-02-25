require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

// ==========================
// 🔥 CONNECT DATABASE
// ==========================
connectDB();

// ==========================
// 🔐 SECURITY HEADERS
// ==========================
app.use(helmet());

// ==========================
// 🌍 CORS CONFIGURATION
// ==========================

app.use(
  cors({
    origin: "*", // 🔥 allow all for mobile testing
    credentials: true
  })
);

// ==========================
// 📦 BODY PARSER
// ==========================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ==========================
// 🚦 RATE LIMIT
// ==========================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Try again later."
  }
});

app.use("/api", limiter);

// ==========================
// 📂 STATIC FILES
// ==========================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// 📝 DEV LOGGER
// ==========================
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ==========================
// ❤️ HEALTH CHECK
// ==========================
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "NeetPro API is running 🚀"
  });
});

// ==========================
// 📌 ROUTES
// ==========================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/schedule", require("./routes/scheduleRoutes"));
app.use("/api/study", require("./routes/studyRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ==========================
// ❌ 404 HANDLER
// ==========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found"
  });
});

// ==========================
// 🔥 GLOBAL ERROR HANDLER
// ==========================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// ==========================
// 🚀 START SERVER (🔥 IMPORTANT FIX HERE)
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("=====================================");
  console.log(`🚀 Server Running on PORT ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=====================================");
});