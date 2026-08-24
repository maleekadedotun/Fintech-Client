import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:9000/api/v1", // replace with your backend URL
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