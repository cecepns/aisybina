import axios from "axios";

export const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  baseURL:"https://api.kingcreativestudio.my.id/aisybina",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aisybina_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith("/admin");
      if (isAdminRoute && !window.location.pathname.includes("/login")) {
        localStorage.removeItem("aisybina_token");
        localStorage.removeItem("aisybina_admin");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);
