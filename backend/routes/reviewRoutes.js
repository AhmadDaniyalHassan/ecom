import express from "express";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";
import {
  getReviewController,
  postReviewController,
  postQueAnsProductController,
  getQuestionsController,
  deleteQuestionController,
  updateAnswerController,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// GET /products/:id
reviewRouter.post("/:productId/reviews", verifyToken, postReviewController);
reviewRouter.get("/:productId/get-reviews", getReviewController);

// Q/A api's
reviewRouter.post(
  "/:productId/post-questions",
  verifyToken,
  postQueAnsProductController
);

reviewRouter.get("/get-questions/:productId", getQuestionsController);

reviewRouter.delete(
  "/:productId/delete-questions/:questionId",
  verifyToken,
  isAdmin,
  deleteQuestionController
);
reviewRouter.put(
  "/:productId/ans-questions/:questionId",
  verifyToken,
  isAdmin,
  updateAnswerController
);

export default reviewRouter;
