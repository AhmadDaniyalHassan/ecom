import express from "express";
import {
  createProductController,
  productListController,
  searchProductController,
  brainTreeTokenController,
  brainTreePaymentsController,
  getProductController,
  createFilterProductController,
  updateProductController,
  deleteProductController,
  getSingleProductController,
  productCategoryController,
  getSimilarProductController,
  productCountController,
  getFeaturedProductController,
  toggleFeaturedController,
} from "../controllers/productController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";
import cloudinary from "cloudinary";
import upload from "../helper/multer.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// formidable(),
const productRouter = express.Router();
//admin route only
productRouter.post(
  "/create-product",
  upload.array("images"),
  verifyToken,
  isAdmin,
  createProductController
);
productRouter.put(
  "/update-product/:pid",
  upload.array("images"),
  verifyToken,
  isAdmin,
  updateProductController
);

// filtering based on category
productRouter.post("/filter-product", createFilterProductController);
productRouter.get("/search/:keyword", searchProductController);

//user route
// productRouter.get("/get-product", getProductController)
productRouter.get("/single-product/:slug", getSingleProductController);
productRouter.get("/get-product/", getProductController);
productRouter.get("/get-featured-product/", getFeaturedProductController);
productRouter.put(
  "/toggle-featured/:productId",
  verifyToken,
  isAdmin,
  toggleFeaturedController
);
productRouter.delete("/delete-product/:pid", deleteProductController);

// payment route
productRouter.get("/braintree/token", brainTreeTokenController);
productRouter.post(
  "/braintree/payment",
  verifyToken,
  brainTreePaymentsController
);

// category controller nav
productRouter.get("/product-category/:slug", productCategoryController);

// similarproduct
productRouter.get("/similar-product/:pid/:cid", getSimilarProductController);

productRouter.get("/product-count", productCountController);

productRouter.get("/product-list/:page", productListController);

export default productRouter;
