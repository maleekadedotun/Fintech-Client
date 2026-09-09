import axios from "axios";

// Automatically target localhost when running locally, or Render in production
const isLocal =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

const baseURL = isLocal
    ? "http://localhost:9000/api/v1"
    : "https://fintech-backend-q0r8.onrender.com/api/v1";

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;