import { useEffect, useState } from "react";
import { FaBell, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [time, setTime] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // Live Clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Theme Toggle
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.style.background = darkMode ? "#f1f5f9" : "#0f172a";
    document.body.style.color = darkMode ? "#111" : "white";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      
      {/* Left Section */}
      <div style={styles.left}>
        <h3 style={{ margin: 0 }}>🚀 NEET Pro</h3>
        <span style={styles.clock}>{time}</span>
      </div>

      {/* Right Section */}
      <div style={styles.right}>

        {/* XP + Level */}
        <div style={styles.badge}>
          🔥 {user?.level || "Beginner"}
        </div>

        {/* Notification */}
        <FaBell style={styles.icon} />

        {/* Theme Toggle */}
        <button onClick={toggleTheme} style={styles.iconBtn}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* User Avatar */}
        <div style={styles.profile}>
          <img
            src={
              user?.profilePhoto ||
              "https://i.imgur.com/6VBx3io.png"
            }
            alt="profile"
            style={styles.avatar}
          />
          <span>{user?.name || "Student"}</span>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <FaSignOutAlt />
        </button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "70px",
    width: "100%",
    background: "rgba(30, 41, 59, 0.8)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 25px",
    color: "white",
    borderBottom: "1px solid #1f2937",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  clock: {
    fontSize: "14px",
    opacity: 0.8
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  badge: {
    background: "#6366f1",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold"
  },
  icon: {
    cursor: "pointer",
    fontSize: "18px"
  },
  iconBtn: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "18px"
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    objectFit: "cover"
  },
  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white"
  }
};