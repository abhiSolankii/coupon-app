import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "../hooks/useApiRequest";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const storedAdmin = localStorage.getItem("admin");
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  });
  const { apiRequest, loading } = useApiRequest();

  useEffect(() => {
    if (admin) {
      localStorage.setItem("admin", JSON.stringify(admin));
    } else {
      localStorage.removeItem("admin");
    }
  }, [admin]);

  const login = async (email, password) => {
    const data = await apiRequest("post", "/admin/auth", { email, password });
    setAdmin(data);
    return data;
  };

  const logout = async () => {
    try {
      // Send logout request to server to clear the JWT cookie
      await apiRequest("post", "/admin/logout");

      // Clear client-side data
      setAdmin(null);
      localStorage.clear(); // Clear all localStorage items
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear JWT cookie client-side

      // Navigate to login page
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local data and redirect even if server request fails
      setAdmin(null);
      localStorage.clear();
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  };

  const value = {
    admin,
    login,
    logout,
    isLoading: loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
