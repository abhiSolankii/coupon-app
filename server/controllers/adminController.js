import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";

const generateToken = (adminId) => {
  const token = jwt.sign({ adminId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

// @desc    Auth admin & get token
// @route   POST /api/admin/auth
// @access  Public
const authAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id);
      res.json({
        _id: admin._id,
        email: admin.email,
        token, // Send token in response
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      res.status(400).json({ message: "Admin already exists" });
      return;
    }

    const admin = await Admin.create({
      email,
      password,
    });

    if (admin) {
      const token = generateToken(admin._id);
      res.status(201).json({
        _id: admin._id,
        email: admin.email,
        token, // Send token in response
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout admin
// @route   POST /api/admin/logout
// @access  Private
const logoutAdmin = async (req, res) => {
  // No cookie to clear; client will handle token removal from localStorage
  res.json({ message: "Logged out successfully" });
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (admin) {
      res.json({
        _id: admin._id,
        email: admin.email,
      });
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { authAdmin, registerAdmin, logoutAdmin, getAdminProfile };
