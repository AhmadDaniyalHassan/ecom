import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import userModel from "../models/userModel.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, products, size } = req.body;

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate and store the products array
    const orderProducts = await Promise.all(
      products.map(async ({ productId }) => {
        const product = await Product.findById(productId);
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }

        return { product: productId };
      })
    );

    // Create the order
    const newOrder = new Order({
      products: orderProducts,
      user: userId,
      size: size,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("products.product", "name price")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
