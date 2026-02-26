import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaClock,
  FaCog,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { useState } from "react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "Add Study", path: "/add-study", icon: <FaPlus /> },
    { name: "Focus Mode", path: "/focus", icon: <FaClock /> },
    { name: "Settings", path: "/settings", icon: <FaCog /> }
  ];

  const isMobile = window.innerWidth < 768;

  return (
    <>
      {/* Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={styles.overlay}
        />
      )}

      <div
        style={{
          ...styles.sidebar,
          width: collapsed ? "80px" : "240px",
          left: isMobile
            ? sidebarOpen
              ? "0"
              : "-260px"
            : "0"
        }}
      >
        {/* Top Section */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: collapsed ? "center" : "space-between",
              alignItems: "center",
              marginBottom: "30px"
            }}
          >
            {!collapsed && <h2 style={{ margin: 0 }}>NeetPro</h2>}

            <button
              onClick={() => setCollapsed(!collapsed)}
              style={styles.toggleBtn}
            >
              {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => isMobile && setSidebarOpen(false)}
              style={({ isActive }) => ({
                ...styles.link,
                background: isActive ? "#6366f1" : "transparent"
              })}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </div>

        {/* Bottom Section */}
        <div style={styles.bottomCard}>
          {!collapsed && (
            <>
              <p style={{ margin: "0 0 5px 0" }}>🔥 Level</p>
              <strong>Disciplined</strong>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  sidebar: {
    height: "100vh",
    background: "#111827",
    color: "white",
    transition: "0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "20px 10px",
    position: "fixed",
    top: 0,
    zIndex: 1001
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "12px 15px",
    borderRadius: "10px",
    marginBottom: "10px",
    textDecoration: "none",
    color: "white",
    transition: "0.2s"
  },

  toggleBtn: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer"
  },

  bottomCard: {
    background: "#1f2937",
    padding: "12px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "14px"
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    zIndex: 1000
  }
};