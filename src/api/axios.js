import axios from "axios";

const api = axios.create({
     // replace with your backend URL
    // baseURL: "http://localhost:9000/api/v1",
    baseURL: "https://fintech-backend-q0r8.onrender.com/api/v1",
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