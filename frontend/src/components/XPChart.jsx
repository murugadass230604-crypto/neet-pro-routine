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

export default function XPChart() {
  const [xpData, setXpData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXP = async () => {
      try {
        const res = await API.get("/study/xp-growth");

        if (Array.isArray(res.data)) {
          setXpData(res.data);
        }
      } catch (error) {
        console.log("XP chart error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchXP();
  }, []);

  const data = {
    labels: xpData.map((d) => d.date),
    datasets: [
      {
        label: "XP Growth",
        data: xpData.map((d) => d.xp),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139,92,246,0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#6366f1",
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff"
        }
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#ffffff",
        bodyColor: "#ffffff"
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
    <div style={styles.card}>
      <h3 style={styles.title}>🔥 XP Growth</h3>

      {loading ? (
        <p style={{ color: "#94a3b8" }}>Loading chart...</p>
      ) : xpData.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>
          No XP data available.
        </p>
      ) : (
        <div style={styles.chartWrapper}>
          <Line data={data} options={options} />
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "20px",
    marginTop: "30px",
    width: "100%",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)"
  },
  title: {
    marginBottom: "20px",
    color: "white"
  },
  chartWrapper: {
    height: "300px"
  }
};