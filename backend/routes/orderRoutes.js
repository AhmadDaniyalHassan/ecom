import express from "express";
// import { verifyToken } from '../middleware/authMiddleware.js';
// import { createOrder, getorderController } from "../controllers/orderController.js";
import { createOrder, getOrderById } from "../controllers/orderController.js";

const orderRouter = express.Router();

//admin route only
// create order
// orderRouter.post("/create-order", verifyToken, createOrder)

orderRouter.post("/create-order", createOrder);
orderRouter.get("/orders/:orderId", getOrderById);

// orderRouter.put("/update-order/:id", verifyToken, isAdmin, updateorderController)

// orderRouter.get("/get-order/:orderId", getorderController)
// orderRouter.get("/single-order/:slug", getSignleorderController)

// orderRouter.delete("/delete-order/:id", verifyToken, isAdmin, deleteorderController)

export default orderRouter;
