import axios from "axios";

// 🔥 Render Production Backend
const BASE_URL = "https://neet-pro-backend.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 30 sec safe for Render cold start
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================
// 🔐 Attach JWT Automatically
// ==========================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// 🌍 Global Error Handling
// ==========================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If Render is sleeping (cold start)
    if (!error.response) {
      console.warn("Server might be waking up...");
      alert("Server is starting. Please wait 30 seconds and try again.");
      return Promise.reject(error);
    }

    // If token expired
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;