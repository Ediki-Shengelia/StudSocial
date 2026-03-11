import { createContext, useEffect, useState } from "react";
import { api } from "../lib/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- NEW: Appearance States ---
  const [fontSize, setFontSize] = useState(localStorage.getItem("user-font-size") || "100%");
  const [bgColor, setBgColor] = useState(localStorage.getItem("user-bg-color") || "#09090b");
  const [textColor, setTextColor] = useState(localStorage.getItem("user-text-color") || "#f4f4f5");

  // Sync appearance to localStorage and Root Document
  useEffect(() => {
    localStorage.setItem("user-font-size", fontSize);
    localStorage.setItem("user-bg-color", bgColor);
    localStorage.setItem("user-text-color", textColor);

    // Apply to the <html> tag so everything scales globally
    document.documentElement.style.fontSize = fontSize;
  }, [fontSize, bgColor, textColor]);

  useEffect(() => {
    let cancelled = false;
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const res = await api.get("/api/user");
        if (!cancelled) setUser(res.data);
      } catch (error) {
        localStorage.removeItem("token");
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadUser();
    return () => { cancelled = true; };
  }, []);

  async function register(payload) {
    setLoading(true);
    try {
      const res = await api.post("/api/register", payload);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } finally { setLoading(false); }
  }

  async function login(payload) {
    setLoading(true);
    try {
      const res = await api.post("/api/login", payload);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data.user;
    } finally { setLoading(false); }
  }

  async function logout() {
    setLoading(true);
    try { await api.post("/api/logout"); } catch (e) {} 
    finally {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, loading, fontSize, setFontSize, 
      bgColor, setBgColor, textColor, setTextColor, // Added these
      register, login, logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}