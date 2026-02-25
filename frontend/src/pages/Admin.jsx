import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Admin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    navigate("/", { replace: true });
    return;
  }

  speakWelcome();
  loadData();
}, [navigate]);

  const speakWelcome = () => {
    const msg = new SpeechSynthesisUtterance(
      "Welcome back Super Admin. All systems are running."
    );
    msg.rate = 1;
    msg.pitch = 1;
    msg.lang = "en-US";
    window.speechSynthesis.speak(msg);
  };

const loadData = async () => {
  try {
    const dash = await API.get("/admin/dashboard");
    const userRes = await API.get("/admin/users");

    setStats(dash.data?.stats || {});
    setUsers(userRes.data?.users || []);
  } catch (err) {
    console.error("Admin Load Error:", err);
  } finally {
    setLoading(false);
  }
};

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    await API.delete(`/admin/user/${id}`);
    loadData();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return <div style={styles.loading}>Loading Admin Panel...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>👑 NEET PRO ADMIN</h1>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Active Users" value={stats.activeUsers} />
        <StatCard title="Study Logs" value={stats.totalStudyLogs} />
      </div>

      {/* Users Table */}
      <h2 style={{ marginTop: "40px" }}>User Activity Monitor</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>XP</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.xp}</td>
                <td>{user.role}</td>
                <td>
                  {user.isActive ? (
                    <span style={{ color: "#22c55e" }}>Active</span>
                  ) : (
                    <span style={{ color: "#ef4444" }}>Blocked</span>
                  )}
                </td>
                <td>
                  {user.role !== "admin" && (
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{value || 0}</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0f172a,#020617)",
    color: "white",
    padding: "30px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer"
  },
  statsContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginTop: "30px"
  },
  card: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "15px",
    width: "220px",
    textAlign: "center"
  },
  tableWrapper: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#1e293b"
  },
  deleteBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    color: "white",
    cursor: "pointer"
  },
  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white"
  }
};