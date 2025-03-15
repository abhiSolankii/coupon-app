import React, { useState, useEffect } from "react";
import { useApiRequest } from "../hooks/useApiRequest";
import { toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  Check,
  X,
  Edit,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { errorHandler } from "../components/helpers";

function AdminDashboard() {
  const [coupons, setCoupons] = useState([]);
  const [history, setHistory] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState({});
  const [editCoupon, setEditCoupon] = useState({
    _id: "",
    code: "",
    description: "",
    expiryDate: "",
  });
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    expiryDate: "",
  });
  const { apiRequest, loading } = useApiRequest();

  useEffect(() => {
    fetchCoupons();
    fetchHistory();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await apiRequest("get", "/coupons");
      setCoupons(data || []);
    } catch (error) {
      errorHandler(error);
      setCoupons([]);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await apiRequest("get", "/coupons/history");
      setHistory(data || []);
    } catch (error) {
      errorHandler(error);
      setHistory([]);
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("post", "/coupons", newCoupon);
      toast.success("Coupon added successfully");
      setShowAddForm(false);
      setNewCoupon({ code: "", description: "", expiryDate: "" });
      await fetchCoupons();
      await fetchHistory();
    } catch (error) {
      errorHandler(error);
    }
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("put", `/coupons/${editCoupon._id}`, {
        code: editCoupon.code,
        description: editCoupon.description,
        expiryDate: editCoupon.expiryDate,
      });
      toast.success("Coupon updated successfully");
      setShowEditModal(false);
      await fetchCoupons();
      await fetchHistory();
    } catch (error) {
      errorHandler(error);
    }
  };

  const toggleCouponStatus = async (id, isActive) => {
    try {
      await apiRequest("put", `/coupons/${id}`, { isActive: !isActive });
      toast.success("Coupon status updated");
      await fetchCoupons();
      await fetchHistory();
    } catch (error) {
      errorHandler(error);
    }
  };

  const deleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await apiRequest("delete", `/coupons/${id}`);
        toast.success("Coupon deleted successfully");
        await fetchCoupons();
        await fetchHistory();
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  const toggleHistory = (couponId) => {
    setExpandedHistory((prev) => ({
      ...prev,
      [couponId]: !prev[couponId],
    }));
  };

  const openEditModal = (coupon) => {
    setEditCoupon({
      _id: coupon._id,
      code: coupon.code,
      description: coupon.description,
      expiryDate: coupon.expiryDate.split("T")[0], // Format for date input
    });
    setShowEditModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto pt-24 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Coupon Control Center
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-6 rounded-full shadow-lg"
          disabled={loading}
        >
          <Plus size={18} />
          <span>Create Coupon</span>
        </motion.button>
      </motion.div>

      {/* Add Coupon Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              New Coupon Generator
            </h2>
            <form onSubmit={handleAddCoupon} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, code: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newCoupon.expiryDate}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, expiryDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCoupon.description}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    rows="4"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 rounded-full"
                  disabled={loading}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-6 rounded-full shadow-lg disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Generate Coupon"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Coupon Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Update Coupon
              </h2>
              <form onSubmit={handleUpdateCoupon} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={editCoupon.code}
                    onChange={(e) =>
                      setEditCoupon({ ...editCoupon, code: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={editCoupon.expiryDate}
                    onChange={(e) =>
                      setEditCoupon({
                        ...editCoupon,
                        expiryDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editCoupon.description}
                    onChange={(e) =>
                      setEditCoupon({
                        ...editCoupon,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    rows="4"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 rounded-full"
                    disabled={loading}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 px-6 rounded-full shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Coupon"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupons Table */}
      {loading && !coupons.length ? (
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            Loading...
          </motion.div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                {[
                  "Code",
                  "Description",
                  "Expiry",
                  "Status",
                  "Available",
                  "Actions",
                  "History",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {coupons.map((coupon) => (
                  <React.Fragment key={coupon._id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{coupon.code}</td>
                      <td className="px-6 py-4">{coupon.description}</td>
                      <td className="px-6 py-4">
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() =>
                            toggleCouponStatus(coupon._id, coupon.isActive)
                          }
                          disabled={loading}
                          className={`flex items-center space-x-2 ${
                            coupon.isActive
                              ? "text-green-600 hover:text-green-700"
                              : "text-red-600 hover:text-red-700"
                          }`}
                        >
                          {coupon.isActive ? (
                            <>
                              <Check size={18} />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <X size={18} />
                              <span>Inactive</span>
                            </>
                          )}
                        </motion.button>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          disabled={loading}
                          className={`flex items-center space-x-2 ${
                            coupon.isAvailable
                              ? "text-green-600 hover:text-green-700"
                              : "text-red-600 hover:text-red-700"
                          }`}
                        >
                          {coupon.isAvailable ? (
                            <>
                              <Check size={18} />
                              <span>Available</span>
                            </>
                          ) : (
                            <>
                              <X size={18} />
                              <span>Unavailable</span>
                            </>
                          )}
                        </motion.button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditModal(coupon)}
                            className="text-blue-600 hover:text-blue-800"
                            disabled={loading}
                          >
                            <Edit size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteCoupon(coupon._id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={loading}
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => toggleHistory(coupon._id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {expandedHistory[coupon._id] ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </motion.button>
                      </td>
                    </motion.tr>
                    {expandedHistory[coupon._id] && (
                      <motion.tr
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan="6" className="px-6 py-4 bg-gray-50">
                          <div className="text-sm text-gray-600">
                            <h4 className="font-semibold mb-2">
                              Claim History:
                            </h4>
                            {history
                              .filter((h) => h._id === coupon._id)
                              .map((h) =>
                                h.claimedBy.map((claim) => (
                                  <div
                                    key={claim._id}
                                    className="mb-2 p-2 bg-gray-100 rounded"
                                  >
                                    <p>IP: {claim.ip}</p>
                                    <p>Session: {claim.sessionId}</p>
                                    <p>
                                      Claimed:{" "}
                                      {new Date(
                                        claim.claimedAt
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                ))
                              )}
                            {!history.find((h) => h._id === coupon._id)
                              ?.claimedBy?.length && <p>No claims yet</p>}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {!coupons.length && (
            <div className="text-center py-4 text-gray-500">
              No coupons available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
