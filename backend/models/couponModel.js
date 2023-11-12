import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  code: {
    type: String,
    unique: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  discount: {
    type: Boolean,
    default: false,
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

export default mongoose.model("Coupon", couponSchema);
