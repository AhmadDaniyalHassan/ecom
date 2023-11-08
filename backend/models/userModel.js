import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true, // By default, admin users are active
    },
    address: {
      type: {},
      required: true,
    },
    answer: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

export default mongoose.model("User", userSchema);
