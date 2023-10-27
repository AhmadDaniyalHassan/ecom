import express from "express";
import {
  registerController,
  loginController,
  getOrdersController,
  updateProfileController,
  forgotPasswordController,
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

// admin user
userRoute.get("/admin-auth", verifyToken, isAdmin, (req, res, next) => {
  res.status(200).send({ ok: true });
});

//orders
userRoute.get("/orders", verifyToken, getOrdersController);

export default userRoute;
