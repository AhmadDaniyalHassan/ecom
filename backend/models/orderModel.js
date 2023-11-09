import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        total: {
          type: Number,
        },
        name: {
          type: String,
        },
        image: [
          {
            type: String,
          },
        ],
      },
    ],
    total: {
      type: Number,
    },
    payment: {},
    paymentMethod: {
      type: String,
      enum: ["Braintree", "COD"], // Add the COD payment option
    },
    purchaser: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
