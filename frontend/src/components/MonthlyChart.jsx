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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MonthlyChart() {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const fetchMonthly = async () => {
      const res = await API.get("/study/monthly");
      setDataPoints(res.data.hours);
    };
    fetchMonthly();
  }, []);

  const data = {
    labels: ["Week1", "Week2", "Week3", "Week4"],
    datasets: [
      {
        label: "Monthly Study Hours",
        data: dataPoints,
        backgroundColor: "#6366f1",
        borderRadius: 10
      }
    ]
  };

  return (
    <div style={cardStyle}>
      <h3>📅 Monthly Performance</h3>
      <Bar data={data} />
    </div>
  );
}

const cardStyle = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "20px",
  marginTop: "30px"
};