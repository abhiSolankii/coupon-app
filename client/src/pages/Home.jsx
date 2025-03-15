import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useApiRequest } from "../hooks/useApiRequest";
import { Gift } from "lucide-react";
import { motion } from "framer-motion";
import { errorHandler } from "../components/helpers";

function Home() {
  const [coupon, setCoupon] = useState(null);
  const { apiRequest, loading } = useApiRequest();

  const claimCoupon = async () => {
    try {
      const sessionId =
        localStorage.getItem("sessionId") ||
        Math.random().toString(36).substring(2);
      localStorage.setItem("sessionId", sessionId);

      const data = await apiRequest("post", "/coupons/claim", { sessionId });
      setCoupon(data);
      toast.success("Coupon Unlocked!");
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Coupon Treasure
          </h1>
          <p className="text-gray-600 text-lg">
            Unlock exclusive rewards with our cosmic distribution system!
          </p>
        </div>

        {coupon ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <Gift className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              {coupon.code}
            </h2>
            <p className="text-gray-600 mb-4 text-lg">{coupon.description}</p>
            <p className="text-sm text-gray-500">
              Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
            </p>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={claimCoupon}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Unlocking..." : "Claim Your Reward"}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

export default Home;
