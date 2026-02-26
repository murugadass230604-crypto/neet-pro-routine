import { useEffect, useState } from "react";
import { FaBell, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [time, setTime] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // ================= Live Clock =================
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ================= Theme Toggle =================
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.body.style.background = "#0f172a";
      document.body.style.color = "white";
    } else {
      document.body.style.background = "#f1f5f9";
      document.body.style.color = "#111";
    }
  };

  // ================= Logout =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
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

        {/* Level Badge */}
        <div style={styles.badge}>
          🔥 {user?.level || "Beginner"}
        </div>

        {/* Notification */}
        <FaBell style={styles.icon} />

        {/* Theme Toggle */}
        <button onClick={toggleTheme} style={styles.iconBtn}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* User Profile */}
        <div style={styles.profile}>
          <img
            src={
              user?.profilePhoto ||
              "https://i.imgur.com/6VBx3io.png"
            }
            alt="profile"
            style={styles.avatar}
          />
          <span style={styles.username}>
            {user?.name || "Student"}
          </span>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <FaSignOutAlt />
        </button>

      </div>
    </div>
  );
}

// ==========================
// Styles
// ==========================
const styles = {
  container: {
    height: "70px",
    width: "100%",
    background: "rgba(30, 41, 59, 0.85)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    color: "white",
    borderBottom: "1px solid #1f2937",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },

  clock: {
    fontSize: "13px",
    opacity: 0.8
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap"
  },

  badge: {
    background: "#6366f1",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
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
    gap: "8px"
  },

  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    objectFit: "cover"
  },

  username: {
    fontSize: "14px"
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