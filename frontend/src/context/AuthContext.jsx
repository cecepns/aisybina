import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { get, post } from "../utils/request";
import { API_ENDPOINTS } from "../utils/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("aisybina_admin") || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!!localStorage.getItem("aisybina_token"));

  const logout = useCallback(() => {
    localStorage.removeItem("aisybina_token");
    localStorage.removeItem("aisybina_admin");
    setAdmin(null);
  }, []);

  const login = async (email, password) => {
    const res = await post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    localStorage.setItem("aisybina_token", res.data.token);
    localStorage.setItem("aisybina_admin", JSON.stringify(res.data.admin));
    setAdmin(res.data.admin);
    return res;
  };

  useEffect(() => {
    const token = localStorage.getItem("aisybina_token");
    if (!token) {
      setLoading(false);
      return;
    }
    get(API_ENDPOINTS.AUTH.ME)
      .then((res) => {
        setAdmin(res.data);
        localStorage.setItem("aisybina_admin", JSON.stringify(res.data));
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [logout]);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
