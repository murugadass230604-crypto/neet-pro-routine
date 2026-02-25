import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import API from "../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function ProductivityChart() {
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const res = await API.get("/study/weekly");
        const hours = res.data.map((day) => day.hours);
        setWeeklyData(hours);
      } catch (err) {
        console.log("Weekly stats error:", err);
      }
    };

    fetchWeeklyStats();
  }, []);

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Study Hours",
        data: weeklyData,
        fill: true,
        tension: 0.4,
        borderColor: "#6366f1",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(99,102,241,0.6)");
          gradient.addColorStop(1, "rgba(99,102,241,0.05)");
          return gradient;
        },
        pointBackgroundColor: "#8b5cf6",
        pointRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        borderColor: "#6366f1",
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { display: false }
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "#1f2937" }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.card}
    >
      <h3 style={styles.title}>📊 Weekly Productivity</h3>
      <Line data={data} options={options} />
    </motion.div>
  );
}

const styles = {
  card: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    marginTop: "30px"
  },
  title: {
    marginBottom: "20px",
    color: "white"
  }
};