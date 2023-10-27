import express from "express";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";
import {
  createCategoryController,
  updateCategoryController,
  getSignleCategoryController,
  getCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

//admin route only
// create category
categoryRouter.post(
  "/create-category",
  verifyToken,
  isAdmin,
  createCategoryController
);

categoryRouter.put(
  "/update-category/:id",
  verifyToken,
  isAdmin,
  updateCategoryController
);

categoryRouter.get("/get-category", getCategoryController);
categoryRouter.get("/single-category/:slug", getSignleCategoryController);

categoryRouter.delete(
  "/delete-category/:id",
  verifyToken,
  isAdmin,
  deleteCategoryController
);

export default categoryRouter;
