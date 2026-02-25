import { createContext, useEffect, useState } from "react";
import { api } from "../lib/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // ✅ start as null
  const [loading, setLoading] = useState(true); // ✅ app starts "checking"

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      const token = localStorage.getItem("token");

      // no token => not logged in
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/user"); // must be protected: auth:sanctum
        if (!cancelled) setUser(res.data);
      } catch (error) {
        // token invalid/expired
        localStorage.removeItem("token");
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  async function register(payload) {
    setLoading(true);
    try {
      const res = await api.post("/api/register", payload);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  }

  async function login(payload) {
    setLoading(true);
    try {
      const res = await api.post("/api/login", payload);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      // if backend fails, we still clear local state
      await api.post("/api/logout");
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}