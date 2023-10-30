import express from "express";

import { createOrder, getOrderById } from "../controllers/orderController.js";

const orderRouter = express.Router();

//admin route only


orderRouter.post("/create-order", createOrder);
orderRouter.get("/orders/:orderId", getOrderById);

export default orderRouter;
