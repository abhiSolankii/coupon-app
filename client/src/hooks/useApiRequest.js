import { useState, useCallback } from "react";
import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api", //for local development
  baseURL: "https://coupon-app-gky9.onrender.com/api", //for production
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiRequest = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    try {
      // Only include data for POST and PUT requests
      const config = {
        method,
        url,
      };

      // Add data only for POST and PUT methods
      if (["post", "put"].includes(method.toLowerCase()) && data) {
        config.data = data;
      }

      const response = await api(config);
      return response.data;
    } catch (err) {
      // Store the error for potential use and rethrow it
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { apiRequest, loading, error };
};
