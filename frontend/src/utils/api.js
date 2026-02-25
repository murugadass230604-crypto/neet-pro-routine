import axios from "axios";

/*
  🔥 IMPORTANT:
  - Development → Laptop IPv4
  - Production (Android Build) → Also Laptop IPv4 (for now)
  - Later deploy pannina production URL change pannalaam
*/

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://semisecretly-semilyric-junita.ngrok-free.dev/api"   // ✅ Your Laptop IPv4
    : "https://semisecretly-semilyric-junita.ngrok-free.dev/api";  // ✅ Same for Android build testing

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // optional safety timeout
});

// 🔐 Attach JWT Automatically
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

// 🌍 Global Error Handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error - Backend not reachable");
      alert("Cannot connect to server. Check WiFi & Backend.");
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;