import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getReviewController,
  postReviewController,
  postQueAnsProductController,
  getQuestionsController,
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
export default reviewRouter;
