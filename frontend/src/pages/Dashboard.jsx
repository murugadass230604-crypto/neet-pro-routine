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
        // Fetch summary
        const summaryRes = await API.get("/analytics/summary");
        setSummary(summaryRes.data.summary);

        // Fetch today schedule
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

  const studyTasks = tasks.filter((t) => t.category === "Study");

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
    <div className="dashboard-container">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-title"
      >
        Welcome back 👋
      </motion.h2>

      <p className="dashboard-sub">
        Level: {summary?.level} | XP: {xp}
      </p>

      {/* XP Circle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="xp-card"
      >
        <XPCircle percentage={xpProgress} />
      </motion.div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div
              className="stat-icon"
              style={{ color: stat.color }}
            >
              {stat.icon}
            </div>
            <h4>{stat.title}</h4>
            <p className="stat-value">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tasks */}
      <div className="task-section">
        <h3>Today's Schedule</h3>

        {tasks.length === 0 && (
          <p className="no-task">No tasks scheduled for today.</p>
        )}

        {tasks.map((task, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="task-card"
          >
            <span>
              {task.icon} {task.title}
            </span>
            <span className="task-time">
              {task.startTime} - {task.endTime}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}