import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import API from "../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function MonthlyChart() {
  const [dataPoints, setDataPoints] = useState([0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const res = await API.get("/study/monthly");

        if (res.data?.hours && Array.isArray(res.data.hours)) {
          setDataPoints(res.data.hours);
        }
      } catch (error) {
        console.error("Monthly Chart Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthly();
  }, []);

  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Monthly Study Hours",
        data: dataPoints,
        backgroundColor: "#6366f1",
        borderRadius: 10
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
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8"
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          color: "#94a3b8"
        },
        grid: {
          color: "rgba(255,255,255,0.05)"
        }
      }
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={{ marginBottom: "20px" }}>
        📅 Monthly Performance
      </h3>

      {loading ? (
        <p style={{ color: "#94a3b8" }}>Loading chart...</p>
      ) : (
        <div style={styles.chartWrapper}>
          <Bar data={data} options={options} />
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
    width: "100%"
  },
  chartWrapper: {
    height: "300px"
  }
};