import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Menu } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
  const { admin, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg fixed w-full z-50"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-extrabold text-white">
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200"
            >
              CouponVerse
            </motion.span>
          </Link>
          <div className="flex items-center space-x-6">
            {admin ? (
              <>
                <Link
                  to="/admin"
                  className="text-white hover:text-indigo-200 transition-colors duration-300"
                >
                  <motion.div whileHover={{ scale: 1.05 }}>
                    Dashboard
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex items-center space-x-2 text-white hover:text-red-200 transition-colors duration-300"
                >
                  <LogOut size={18} />
                  <span>{isLoading ? "Logging out..." : "Logout"}</span>
                </motion.button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="text-white hover:text-indigo-200 transition-colors duration-300"
              >
                <motion.div whileHover={{ scale: 1.05 }}>
                  Admin Portal
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
