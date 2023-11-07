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
    quantity: {
      type: Number,
      default: 0,
    },
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    question: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
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

productSchema.virtual("averageRating").get(function () {
  if (this.review.length === 0) {
    return 0; // No reviews, so the average rating is 0.
  }

  const totalRating = this.review.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  return Math.round((totalRating / this.review.length) * 2) / 2; // Round to increments of 0.5
});

export default mongoose.model("Product", productSchema);
