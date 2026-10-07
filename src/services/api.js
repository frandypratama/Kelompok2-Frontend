import axios from "axios";

export const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Dijalankan sebelum SETIAP request dikirim
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dijalankan setelah SETIAP response diterima
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
