import productModel from "../models/productModel.js";
import questionModel from "../models/questionModel.js";
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

export const deleteReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review by ID and delete it
    const deletedReview = await reviewModel.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    // Remove the review ID from the product's reviews array
    await productModel.findByIdAndUpdate(deletedReview.productId, {
      $pull: { review: reviewId },
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting review.",
      error,
    });
  }
};

// question and answer api

export const getQuestionsController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { questionPage = 1, limit = 3 } = req.query;

    // Find all questions related to the given product with pagination
    const questions = await questionModel
      .find({ product: productId })
      .limit(limit)
      .skip((questionPage - 1) * limit)
      .populate("userId", "name");

    res.status(200).json({
      success: true,
      message: "Questions retrieved successfully",
      questions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error retrieving questions.",
      error,
    });
  }
};

export const postQueAnsProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { question, title, userId } = req.body; // Update the request body to match your schema

    // Check if the user has already asked a question for this product

    // Create a new question
    const newQuestion = new questionModel({
      product: productId,
      question,
      title,
      answer: "",
      userId,
    });

    // Save the question to the database
    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Question Created Successfully",
      question: newQuestion,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error creating the question.", error });
  }
};

export const deleteQuestionController = async (req, res) => {
  try {
    const { questionId } = req.params;
    const deletedQuestion = await questionModel.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Remove the review ID from the product's reviews array
    await productModel.findByIdAndUpdate(deletedQuestion.product, {
      $pull: { question: questionId },
    });

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving questions.", error });
  }
};

export const updateAnswerController = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;
    const updatedQuestion = await questionModel.findByIdAndUpdate(
      questionId,
      { answer },
      { new: true } // Return the updated question
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Add the question ID to the product's questions array
    await productModel.findByIdAndUpdate(updatedQuestion.product, {
      $push: { question: updatedQuestion._id },
    });

    res.status(200).json({
      success: true,
      message: "Answer updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving questions.", error });
  }
};
