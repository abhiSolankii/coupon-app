import Coupon from "../models/couponModel.js";

// @desc    Claim a coupon
// @route   POST /api/coupons/claim
// @access  Public
const claimCoupon = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const ip = req.ip;

    // Find the next available coupon
    const coupon = await Coupon.findOne({
      isActive: true,
      isAvailable: true,
      expiryDate: { $gt: new Date() },
      "claimedBy.ip": { $ne: ip },
      "claimedBy.sessionId": { $ne: sessionId },
    }).sort({ createdAt: 1 });

    if (!coupon) {
      return res.status(404).json({ message: "No coupons available" });
    }

    // Update coupon with claim information
    coupon.claimedBy.push({ ip, sessionId });
    if (coupon.claimedBy.length >= process.env.MAX_CLAIMS_PER_COUPON) {
      coupon.isAvailable = false;
    }
    await coupon.save();

    res.json({
      code: coupon.code,
      description: coupon.description,
      expiryDate: coupon.expiryDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getAllCoupons = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const coupons = await Coupon.find({ adminId: adminId });
    if (!coupons.length) {
      //return empty array if no coupons
      return res.json([]);
    }
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const { code, description, expiryDate } = req.body;
    const existingCoupon = await Coupon.findOne({ code: code });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    const coupon = await Coupon.create({
      code,
      description,
      expiryDate,
      adminId,
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const coupon = await Coupon.findById(req.params.id);
    if (coupon.adminId.toString() !== adminId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingCoupon = await Coupon.findOne({ code: req.body.code });
    if (
      existingCoupon &&
      existingCoupon._id.toString() !== coupon._id.toString()
    ) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    if (coupon) {
      coupon.code = req.body.code || coupon.code;
      coupon.description = req.body.description || coupon.description;
      coupon.isActive = req.body.isActive ?? coupon.isActive;
      coupon.expiryDate = req.body.expiryDate || coupon.expiryDate;

      const updatedCoupon = await coupon.save();
      res.json(updatedCoupon);
    } else {
      res.status(404).json({ message: "Coupon not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const coupon = await Coupon.findById(req.params.id);
    if (coupon.adminId.toString() !== adminId.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    if (coupon) {
      await coupon.deleteOne();
      res.json({ message: "Coupon removed" });
    } else {
      res.status(404).json({ message: "Coupon not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get claim history
// @route   GET /api/coupons/history
// @access  Private/Admin
const getClaimHistory = async (req, res) => {
  try {
    const coupons = await Coupon.find({ "claimedBy.0": { $exists: true } });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  claimCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getClaimHistory,
};
