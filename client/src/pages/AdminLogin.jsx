import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";
import { errorHandler } from "../components/helpers";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem("jwtToken", response.token);
      }
      toast.success("Access Granted!");
      navigate("/admin");
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Lock className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Portal Access
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Enter Portal"}
          </motion.button>
        </form>
        <div className="w-full mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/admin/register"
            className="text-[#004A51] hover:underline transition duration-200 ease-in-out"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
