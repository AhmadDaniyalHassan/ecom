import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.ObjectId,
      ref: "Product",
    },
    question: {
      type: String,
    },
    title: {
      type: String,
    },
    answer: {
      type: String,
    },

    userId: {
      type: mongoose.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
