import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";

const generateToken = (res, adminId) => {
  const token = jwt.sign({ adminId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV === "production", // Set secure to true in production
  });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/auth
// @access  Public
const authAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      generateToken(res, admin._id);
      res.json({
        _id: admin._id,
        email: admin.email,
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

    if (!admin) {
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
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production", // Set secure to true in production
  });
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
