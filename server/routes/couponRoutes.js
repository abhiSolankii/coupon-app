import express from "express";

import {
  claimCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getClaimHistory,
} from "../controllers/couponController.js";
import { protect } from "../middleware/authMiddleware.js";
import { limiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/claim", limiter, claimCoupon);
router.get("/", protect, getAllCoupons);
router.post("/", protect, createCoupon);
router.put("/:id", protect, updateCoupon);
router.delete("/:id", protect, deleteCoupon);
router.get("/history", protect, getClaimHistory);

export default router;
