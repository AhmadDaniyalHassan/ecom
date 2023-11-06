import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    averageRating: {
      type: Number,
      default: 0, // Initialize with a default value of 0
    },
  },
  { timestamps: true }
);

// Middleware to calculate and update the averageRating
reviewSchema.pre("save", async function (next) {
  try {
    const reviews = await this.model("Review").find({ productId: this.productId });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);

      // Calculate the average rating
      this.averageRating = Math.round((totalRating / reviews.length) * 2) / 2; // Round to increments of 0.5
    }

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Review", reviewSchema);
