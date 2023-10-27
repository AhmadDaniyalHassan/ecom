import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import morgan from "morgan";
import colors from "colors";
import mongoose from "mongoose";
//routes
import userRoute from "./routes/userRoutes.js";
import categoryRouter from "../backend/routes/categoryRoutes.js";
import productRouter from "./routes/productRoutes.js";
// import reviewRouter from "./routes/reviewRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(express.static("uploads"));

app.use("/api/user", userRoute);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
// app.use("/api/review", reviewRouter);
app.use("/api/checkout", orderRouter);

connectDB();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server started on port ${port}`.blue);
});
