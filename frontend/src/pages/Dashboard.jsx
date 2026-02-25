import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFire, FaBookOpen, FaClock, FaTrophy } from "react-icons/fa";
import XPCircle from "../components/XPCircle";
import API from "../utils/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        // Fetch dashboard summary
        const summaryRes = await API.get("/analytics/summary");
        setSummary(summaryRes.data.summary);

        // Fetch today's schedule
        const scheduleRes = await API.get("/schedule/today");
        if (scheduleRes.data.schedule) {
          setTasks(scheduleRes.data.schedule.tasks);
        }

      } catch (error) {
        console.log("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading Dashboard...</div>;
  }

  const studyTasks = tasks.filter(t => t.category === "Study");

  // XP Progress Calculation
  const xp = summary?.xp || 0;
  const xpProgress = xp % 100;

  const stats = [
    {
      title: "Study Tasks Today",
      value: studyTasks.length,
      icon: <FaClock />,
      color: "#6366f1",
    },
    {
      title: "Total Study Hours",
      value: summary?.totalHours || 0,
      icon: <FaBookOpen />,
      color: "#10b981",
    },
    {
      title: "Current Streak",
      value: summary?.streak || 0,
      icon: <FaFire />,
      color: "#f59e0b",
    },
    {
      title: "Achievements",
      value: summary?.totalAchievements || 0,
      icon: <FaTrophy />,
      color: "#8b5cf6",
    },
  ];

  return (
    <div style={{ padding: "25px" }}>
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "5px" }}
      >
        Welcome back 👋
      </motion.h2>

      <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
        Level: {summary?.level} | XP: {xp}
      </p>

      {/* XP Circle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <XPCircle percentage={xpProgress} />
      </motion.div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "14px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                marginBottom: "10px",
                color: stat.color,
              }}
            >
              {stat.icon}
            </div>
            <h4>{stat.title}</h4>
            <p style={{ fontSize: "20px", fontWeight: "bold" }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Task List */}
      <div style={{ marginTop: "50px" }}>
        <h3>Today's Schedule</h3>

        {tasks.length === 0 && (
          <p style={{ color: "#94a3b8" }}>No tasks scheduled for today.</p>
        )}

        {tasks.map((task, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            style={{
              background: "#0f172a",
              padding: "12px",
              marginTop: "10px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {task.icon} {task.title}
            </span>
            <span>
              {task.startTime} - {task.endTime}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}