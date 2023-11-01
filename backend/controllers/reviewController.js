import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js";

export const postReviewController = async (req, res) => {
  const { productId } = req.params;
  const { user, rating, comment } = req.body;

  try {
    const review = new reviewModel({ productId, user, rating, comment });
    await review.save();

    // Add the review to the product's reviews array
    await productModel.findByIdAndUpdate(productId, {
      $push: { review: review._id },
    });

    res.status(200).send({
      success: true,
      message: "Review Created Successfully",
      review,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error coming from review",
      error,
    });
  }
};

export const getReviewController = async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 5 } = req.query;

  try {
    const reviews = await reviewModel
      .find({ productId })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate("user", "name"); // Populate user details in the review

    res.status(200).send({
      success: true,
      message: "Review Fetched Successfully",
      reviews,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error coming from fetching review",
      error,
    });
  }
};
