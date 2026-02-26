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

      await API.post("/study", {
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
      className="addstudy-container"
    >
      <h2 className="addstudy-title">📚 Add Study Session</h2>

      <form onSubmit={handleSubmit} className="addstudy-card">

        <input
          type="text"
          name="subject"
          placeholder="Enter Subject"
          value={formData.subject}
          onChange={handleChange}
          className="addstudy-input"
        />

        <input
          type="number"
          name="hours"
          placeholder="Study Hours"
          value={formData.hours}
          onChange={handleChange}
          min="0.5"
          step="0.5"
          className="addstudy-input"
        />

        <select
          name="examType"
          value={formData.examType}
          onChange={handleChange}
          className="addstudy-input"
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
          className="addstudy-input"
        />

        <button type="submit" disabled={loading} className="addstudy-button">
          {loading ? "Saving..." : "Add Study"}
        </button>
      </form>
    </motion.div>
  );
}