import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import API from "../utils/api";

export default function XPChart() {
  const [xpData, setXpData] = useState([]);

  useEffect(() => {
    const fetchXP = async () => {
      const res = await API.get("/study/xp-growth");
      setXpData(res.data);
    };
    fetchXP();
  }, []);

  const data = {
    labels: xpData.map(d => d.date),
    datasets: [
      {
        label: "XP Growth",
        data: xpData.map(d => d.xp),
        borderColor: "#8b5cf6",
        tension: 0.4
      }
    ]
  };

  return (
    <div style={cardStyle}>
      <h3>🔥 XP Growth</h3>
      <Line data={data} />
    </div>
  );
}