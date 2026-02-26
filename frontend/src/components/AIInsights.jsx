import React from "react";

export default function AIInsights({ weeklyData = [] }) {

  // Safe fallback if no data
  const safeData = Array.isArray(weeklyData) ? weeklyData : [];

  const total = safeData.reduce((a, b) => a + b, 0);

  let message = "You're building consistency!";
  let color = "#10b981";

  if (total > 20) {
    message = "Excellent performance this week! 🔥 Keep dominating!";
    color = "#22c55e";
  } else if (total < 5) {
    message = "You need stronger focus next week. Discipline is power. 💪";
    color = "#ef4444";
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h3 style={styles.title}>🤖 Krishna AI Insight</h3>

        <p style={{ ...styles.message, color }}>
          {message}
        </p>

        <div style={styles.stats}>
          <span>Total Weekly Hours:</span>
          <strong>{total}</strong>
        </div>
      </div>
    </div>
  );
}

// ==========================
// Styles
// ==========================
const styles = {
  wrapper: {
    width: "100%",
    marginTop: "20px",
    padding: "0 10px"
  },
  card: {
    background: "#111827",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
    maxWidth: "700px",
    margin: "auto"
  },
  title: {
    marginBottom: "10px"
  },
  message: {
    fontSize: "15px",
    marginBottom: "15px"
  },
  stats: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    background: "#1f2937",
    padding: "10px",
    borderRadius: "10px"
  }
};