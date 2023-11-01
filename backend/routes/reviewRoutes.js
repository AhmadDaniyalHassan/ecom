import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getReviewController,
  postReviewController,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// GET /products/:id
reviewRouter.post("/:productId/reviews", verifyToken, postReviewController);
reviewRouter.get("/:productId/get-reviews", getReviewController);

export default reviewRouter;
