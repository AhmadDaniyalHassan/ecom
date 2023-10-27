import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Product",
      },
    ],
    payment_method: {},
    purchaser: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

// import mongoose from "mongoose";

// const orderSchema = mongoose.Schema({

//     size: {
//         type: String
//     },
//     status: {
//         type: String,
//         default: "Not Process",
//         enum: ['Not Process', 'Processing', 'Shipped', 'Delivered', 'Cancel']
//     },
//     payment_method: { type: String },

//     product: [{
//         type: mongoose.ObjectId,
//         ref: 'Product'
//     }],
//     user: [{
//         type: mongoose.ObjectId,
//         ref: "User",
//     }],

// }, { timestamps: true })

// export default mongoose.model('Order', orderSchema);
