import { useState, useCallback } from "react";
import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api", // for local development
  baseURL: "https://coupon-app-5lw4.onrender.com/api", // for production
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiRequest = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        method,
        url,
      };

      if (["post", "put"].includes(method.toLowerCase()) && data) {
        config.data = data;
      }

      const response = await api(config);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { apiRequest, loading, error };
};
