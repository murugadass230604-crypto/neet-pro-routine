export default function StreakCard({ streak }) {
  return (
    <div style={{
      background: "#1e293b",
      padding: "20px",
      borderRadius: "15px",
      marginTop: "20px",
      textAlign: "center"
    }}>
      <h3>🔥 Current Streak</h3>
      <h1 style={{ color: "#f59e0b" }}>{streak} Days</h1>
      <p>Keep the fire alive 💪</p>
    </div>
  );
}