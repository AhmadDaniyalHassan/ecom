import express from "express";
import {
  registerController,
  loginController,
  getOrdersController,
  updateProfileController,
  forgotPasswordController,
  getAllOrdersController,
  getOrderStatus,
  getAdminUserController,
  getUserController,
} from "../controllers/userController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";

const userRoute = express.Router();

//routing
//register or call signup || method post

userRoute.post("/signup", registerController);
userRoute.post("/login", loginController);

userRoute.put("/profile", verifyToken, updateProfileController);

// forgetpassword
userRoute.post("/forgot-password", forgotPasswordController);

// auth user
userRoute.get("/user-auth", verifyToken, (req, res, next) => {
  res.status(200).send({ ok: true });
});

//user fetch data
userRoute.get("/get-user", verifyToken, isAdmin, getUserController);

userRoute.get("/get-admin", verifyToken, isAdmin, getAdminUserController);

// admin user
userRoute.get("/admin-auth", verifyToken, isAdmin, (req, res, next) => {
  res.status(200).send({ ok: true });
});

//orders
userRoute.get("/orders", verifyToken, getOrdersController);

userRoute.get("/all-orders", verifyToken, isAdmin, getAllOrdersController);

userRoute.put("/order-status/:orderId", verifyToken, isAdmin, getOrderStatus);

export default userRoute;
