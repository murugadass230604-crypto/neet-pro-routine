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
    return <div className="admin-loading">Loading Admin Panel...</div>;
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h1>👑 NEET PRO ADMIN</h1>
        <button className="admin-logout" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Active Users" value={stats.activeUsers} />
        <StatCard title="Study Logs" value={stats.totalStudyLogs} />
      </div>

      {/* Users Table */}
      <h2 className="admin-subtitle">User Activity Monitor</h2>

      <div className="admin-table-wrapper">
        <table className="admin-table">
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
                    <span className="status-active">Active</span>
                  ) : (
                    <span className="status-blocked">Blocked</span>
                  )}
                </td>
                <td>
                  {user.role !== "admin" && (
                    <button
                      className="admin-delete"
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
    <div className="admin-card">
      <h3>{title}</h3>
      <p>{value || 0}</p>
    </div>
  );
}