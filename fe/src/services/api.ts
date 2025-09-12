// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4001/dashboard", // giữ /dashboard
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => { console.log("API Request:", config.url); return config; },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: any) => { console.log("API Response:", response.data); return response; }, // hoặc response.data nếu muốn
  (error) => { console.error("API Error:", error); return Promise.reject(error); }
);

export default api;
