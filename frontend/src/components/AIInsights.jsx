export default function AIInsights({ weeklyData }) {
  const total = weeklyData.reduce((a, b) => a + b, 0);

  let message = "You're building consistency!";
  if (total > 20) message = "Excellent performance this week!";
  if (total < 5) message = "You need stronger focus next week.";

  return (
    <div style={{
      background: "#111827",
      padding: "20px",
      borderRadius: "15px",
      marginTop: "20px"
    }}>
      <h3>🤖 Krishna AI Insight</h3>
      <p>{message}</p>
    </div>
  );
}