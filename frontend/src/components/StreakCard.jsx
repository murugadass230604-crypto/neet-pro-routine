import { motion } from "framer-motion";

export default function StreakCard({ streak = 0 }) {
  const safeStreak = Number(streak) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={styles.card}
    >
      <h3 style={styles.title}>🔥 Current Streak</h3>

      <motion.h1
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={styles.streakNumber}
      >
        {safeStreak} {safeStreak === 1 ? "Day" : "Days"}
      </motion.h1>

      <p style={styles.subtitle}>
        {safeStreak > 0
          ? "Keep the fire alive 💪"
          : "Start your streak today 🚀"}
      </p>
    </motion.div>
  );
}

// ==========================
// Styles
// ==========================
const styles = {
  card: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "18px",
    marginTop: "20px",
    textAlign: "center",
    boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
    width: "100%",
    maxWidth: "500px"
  },

  title: {
    marginBottom: "15px",
    color: "white"
  },

  streakNumber: {
    color: "#f59e0b",
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "10px"
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: "14px"
  }
};