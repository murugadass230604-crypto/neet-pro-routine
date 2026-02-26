import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={styles.wrapper}>

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div style={styles.mainArea}>

        {/* Top Navbar */}
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Routed Page Content */}
        <div style={styles.pageContent}>
          <Outlet />
        </div>

      </div>

    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f172a",
    color: "white"
  },

  mainArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  },

  pageContent: {
    flex: 1,
    padding: "25px",
    overflowY: "auto",
    background: "#0f172a"
  }
};