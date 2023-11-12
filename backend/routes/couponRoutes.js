import express from "express";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";
import {
  generateCouponsWithinLimit,
  useCoupon,
  deleteAllCoupons,
} from "../controllers/couponController.js";

const couponRouter = express.Router();

couponRouter.get("/generate-coupon", verifyToken, isAdmin, async (req, res) => {
  try {
    const result = await generateCouponsWithinLimit(10); // Assuming you want to generate 10 coupons
    if (result) {
      res
        .status(200)
        .json({ success: true, message: "Coupons generated successfully." });
    } else {
      res.status(400).json({
        success: false,
        message: "Coupon generation limit reached for the next 2 months.",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
});

couponRouter.post("/use-coupon", verifyToken, async (req, res) => {
  try {
    const { couponCode } = req.body;
    const userId = req.user._id; // Assuming you have the user ID in the request

    const coupon = await useCoupon(couponCode, userId);

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

couponRouter.delete(
  "/delete-all-coupons",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const result = await deleteAllCoupons();
      res.status(200).json(result);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error", error });
    }
  }
);

export default couponRouter;
