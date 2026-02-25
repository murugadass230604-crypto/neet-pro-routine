import { useState } from "react";
import { motion } from "framer-motion";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function AddStudy() {
  const [formData, setFormData] = useState({
    subject: "",
    hours: "",
    examType: "Banking",
    date: new Date().toISOString().split("T")[0]
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.hours) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await API.post("/study", {
        subject: formData.subject,
        hours: Number(formData.hours),
        examType: formData.examType,
        date: formData.date
      });

      toast.success("Study session added 🚀");

      setFormData({
        subject: "",
        hours: "",
        examType: "Banking",
        date: new Date().toISOString().split("T")[0]
      });

    } catch (error) {
      toast.error("Failed to add study session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={styles.container}
    >
      <h2 style={styles.title}>📚 Add Study Session</h2>

      <form onSubmit={handleSubmit} style={styles.card}>

        <input
          type="text"
          name="subject"
          placeholder="Enter Subject (e.g., Quantitative Aptitude)"
          value={formData.subject}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="number"
          name="hours"
          placeholder="Study Hours"
          value={formData.hours}
          onChange={handleChange}
          style={styles.input}
          min="0.5"
          step="0.5"
        />

        <select
          name="examType"
          value={formData.examType}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Banking">Banking</option>
          <option value="TNPSC">TNPSC</option>
          <option value="SSLC">SSLC</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Saving..." : "Add Study"}
        </button>
      </form>
    </motion.div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px"
  },
  title: {
    marginBottom: "20px"
  },
  card: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    fontSize: "14px"
  },
  button: {
    padding: "12px",
    background: "#6366f1",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  }
};