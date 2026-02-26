import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import API from "../utils/api";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SubjectPieChart() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await API.get("/study/subject-stats");

        if (Array.isArray(res.data)) {
          setSubjects(res.data);
        }
      } catch (error) {
        console.log("Subject stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const data = {
    labels: subjects.map((s) => s.subject),
    datasets: [
      {
        data: subjects.map((s) => s.hours),
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#14b8a6",
          "#e879f9"
        ],
        borderWidth: 1,
        borderColor: "#111827"
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
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📚 Subject Distribution</h3>

      {loading ? (
        <p style={{ color: "#94a3b8" }}>Loading chart...</p>
      ) : subjects.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>
          No study data available.
        </p>
      ) : (
        <div style={styles.chartWrapper}>
          <Pie data={data} options={options} />
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