import couponModel from "../models/couponModel.js";

const generateCouponCode = () => {
  const couponCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  return couponCode;
};

const generateCoupons = async (quantity) => {
  const newCoupons = [];

  for (let i = 0; i < quantity; i++) {
    const couponCode = generateCouponCode();
    const coupon = await couponModel.create({ code: couponCode });
    newCoupons.push(coupon);
  }

  return newCoupons;
};

const useCoupon = async (couponCode, userId) => {
  const coupon = await couponModel.findOne({ code: couponCode, usedBy: null });

  if (!coupon) {
    throw new Error(
      "Invalid coupon. Please remove the coupon fields to proceed with order."
    );
  }

  coupon.usedBy = userId;
  await coupon.save();

  return coupon;
};

const generateCouponsWithinLimit = async (quantity) => {
  // Generate coupons only if the current month is even
  const existingCouponsCount = await couponModel.countDocuments();

  if (existingCouponsCount < 10) {
    const remainingCoupons = Math.min(10 - existingCouponsCount, quantity);
    await generateCoupons(remainingCoupons);
    return true; // Coupons generated successfully
  } else {
    return false; // Coupon generation limit reached for the next 2 months
  }

  return false; // No coupons generated for this month
};

const deleteAllCoupons = async () => {
  try {
    await couponModel.deleteMany({});
    return { success: true, message: "All coupons deleted successfully." };
  } catch (error) {
    throw new Error(`Error deleting coupons: ${error.message}`);
  }
};

export {
  generateCoupons,
  useCoupon,
  generateCouponsWithinLimit,
  deleteAllCoupons,
};
