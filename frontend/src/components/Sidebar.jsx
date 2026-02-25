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

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "Add Study", path: "/add-study", icon: <FaPlus /> },
    { name: "Focus Mode", path: "/focus", icon: <FaClock /> },
    { name: "Settings", path: "/settings", icon: <FaCog /> }
  ];

  return (
    <div
      style={{
        width: collapsed ? "80px" : "240px",
        height: "100vh",
        background: "#111827",
        color: "white",
        transition: "0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 10px"
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
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer"
            }}
          >
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Menu */}
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "12px 15px",
              borderRadius: "10px",
              marginBottom: "10px",
              textDecoration: "none",
              color: "white",
              background: isActive ? "#6366f1" : "transparent",
              transition: "0.2s"
            })}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>

      {/* Bottom Section (XP Badge) */}
      <div
        style={{
          background: "#1f2937",
          padding: "12px",
          borderRadius: "10px",
          textAlign: "center",
          fontSize: "14px"
        }}
      >
        {!collapsed && (
          <>
            <p style={{ margin: "0 0 5px 0" }}>🔥 Level</p>
            <strong>Disciplined</strong>
          </>
        )}
      </div>
    </div>
  );
}