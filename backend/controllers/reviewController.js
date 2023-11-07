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

// question and answer api

export const postQueAnsProductController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { questions, title, userId } = req.body; // Update the request body to match your schema

    // Check if the user has already asked a question for this product
    const existingQuestion = await questionModel.findOne({
      userId,
      "questions.product": productId,
    });

    if (existingQuestion) {
      return res
        .status(400)
        .json({ message: "You can only ask one question per product." });
    }

    // Create a new question
    const question = new questionModel({
      questions: [
        { product: productId, question: questions, title: title, answer: "" },
      ], // Initialize the question array according to your schema
      userId,
    });

    // Save the question to the database
    await question.save();

    // Optionally, you can associate the question with the product if needed
    // Example: Add the question's ID to the product's questions array
    await productModel.findByIdAndUpdate(productId, {
      $push: { question: question._id }, // Ensure it matches your schema
    });

    res.status(201).json({
      success: true,
      message: "Question Created Successfully",
      question,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error creating the question.", error });
  }
};

export const getQuestionsController = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find all questions related to the given product
    const questions = await questionModel.find({
      "questions.product": productId,
    });

    res.status(200).json({
      success: true,
      message: "Questions retrieved successfully",
      questions,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error retrieving questions.", error });
  }
};
