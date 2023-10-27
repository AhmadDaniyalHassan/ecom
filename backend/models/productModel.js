import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
    },
    in_stock: {
      type: Boolean,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
