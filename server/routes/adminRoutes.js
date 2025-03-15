import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  authAdmin,
  registerAdmin,
  logoutAdmin,
  getAdminProfile,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/auth", authAdmin);
router.post("/register", registerAdmin);
router.post("/logout", logoutAdmin);
router.get("/profile", protect, getAdminProfile);

export default router;
