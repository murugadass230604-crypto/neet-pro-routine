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

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await API.get("/study/subject-stats");
      setSubjects(res.data);
    };
    fetchSubjects();
  }, []);

  const data = {
    labels: subjects.map(s => s.subject),
    datasets: [
      {
        data: subjects.map(s => s.hours),
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#10b981",
          "#f59e0b",
          "#ef4444"
        ]
      }
    ]
  };

  return (
    <div style={cardStyle}>
      <h3>📚 Subject Distribution</h3>
      <Pie data={data} />
    </div>
  );
}