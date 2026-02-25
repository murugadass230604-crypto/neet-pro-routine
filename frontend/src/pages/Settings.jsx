import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: storedUser?.name || "",
    age: storedUser?.age || "",
    phone: storedUser?.phone || "",
    profilePhoto: storedUser?.profilePhoto || ""
  });

  const [preview, setPreview] = useState(formData.profilePhoto);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData({ ...formData, profilePhoto: reader.result });
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const res = await API.put("/auth/update-profile", formData);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Profile Updated Successfully 🚀");
    } catch (err) {
      toast.error("Update Failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2>⚙ Settings</h2>

      <div style={styles.card}>
        <h3>Profile</h3>

        <img
          src={
            preview ||
            "https://i.imgur.com/6VBx3io.png"
          }
          alt="preview"
          style={styles.avatar}
        />

        <input type="file" onChange={handlePhoto} />

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          style={styles.input}
        />

        <input
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          style={styles.input}
        />

        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          style={styles.input}
        />

        <button onClick={handleSave} style={styles.saveBtn}>
          Save Changes
        </button>
      </div>

      <div style={styles.card}>
        <h3>Theme</h3>

        <div style={styles.themeOptions}>
          {["royal", "dark", "light", "ultra"].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                ...styles.themeBtn,
                border: theme === t ? "2px solid #6366f1" : "none"
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px"
  },
  card: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "20px",
    marginTop: "20px"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none"
  },
  saveBtn: {
    marginTop: "15px",
    padding: "10px 20px",
    background: "#6366f1",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer"
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px"
  },
  themeOptions: {
    display: "flex",
    gap: "15px",
    marginTop: "10px"
  },
  themeBtn: {
    padding: "10px 15px",
    borderRadius: "10px",
    background: "#111827",
    color: "white",
    cursor: "pointer"
  }
};