import slugify from "slugify";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import braintree from "braintree";
import reviewModel from "../models/reviewModel.js";
import couponModel from "../models/couponModel.js";
dotenv.config();

// payment gateway
let gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
const handleErrors = (res, error, status = 500) => {
  console.error(error);
  res.status(status).send({ error: "Internal Server Error" });
};
export const brainTreePaymentsController = async (req, res) => {
  try {
    const { cart, nonce, paymentMethod, couponCode } = req.body;
    let total = 350; // Initialize total to zero
    let discountApplied = false;
    const productsToUpdate = [];
    let quantityError = false;
    let couponId; // Add this variable to store the coupon ID

    // Additional check for total before applying coupon
    if (total <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid total amount for coupon application." });
    }

    // Calculate the total amount
    for (const orderItem of cart) {
      if (orderItem.quantity <= 0) {
        quantityError = true;
        break;
      }
      total += orderItem.price * orderItem.quantity;

      productsToUpdate.push({
        _id: orderItem._id,
        quantity: orderItem.quantity,
        name: orderItem.name,
        image: orderItem.image,
      });
    }

    if (quantityError) {
      return res
        .status(400)
        .json({ error: "One or more products have a quantity of zero." });
    }
    // Check if coupon code is provided
    if (couponCode) {
      try {
        const coupon = await couponModel.findOneAndUpdate(
          { code: couponCode, discount: false },
          { $set: { discount: true } },
          { new: true }
        );
        if (coupon) {
          discountApplied = true;
          total -= 350; // Assuming the discount amount is 350, adjust it based on your actual value
        }
        if (!coupon) {
          throw new Error(
            "Invalid coupon. Please remove the coupon fields to proceed with order"
          );
        }
      } catch (error) {
        return res.status(500).send(error.message);
      }
    }

    if (paymentMethod === "braintree") {
      try {
        const result = await new Promise((resolve, reject) => {
          gateway.transaction.sale(
            {
              amount: total,
              paymentMethodNonce: nonce,
              options: {
                submitForSettlement: true,
              },
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
        });

        // Perform asynchronous updates here
        for (const productUpdate of productsToUpdate) {
          const product = await productModel.findById(productUpdate._id);
          if (product) {
            product.quantity -= productUpdate.quantity;
            await product.save();
          }
        }

        // Update the coupon after the order is processed
        if (discountApplied && couponId) {
          const updatedCoupon = await couponModel.findByIdAndUpdate(
            couponId,
            { discount: true },
            { new: true }
          );
        }

        // Create the order and respond
        const order = new orderModel({
          products: cart,
          total: total,
          payment: result,
          paymentMethod: "Braintree", // Set the payment method
          purchaser: req.user._id,
          discountApplied: discountApplied,
        });
        await order.save();
        res.json({ success: true, data: order });
      } catch (error) {
        // Handle transaction failure
        res.status(500).send(error);
      }
    } else if (paymentMethod === "cod") {
      try {
        // Perform asynchronous updates here
        for (const productUpdate of productsToUpdate) {
          const product = await productModel.findById(productUpdate._id);
          if (product) {
            product.quantity -= productUpdate.quantity;
            await product.save();
          }
        }

        // Create the order and respond
        const order = new orderModel({
          products: cart,
          total: total,
          paymentMethod: "COD", // Set the payment method
          purchaser: req.user._id,
          discountApplied: discountApplied,
        });
        await order.save();

        res.json({ success: true, data: order });
      } catch (error) {
        handleErrors(res, error);
      }
    } else {
      res.status(400).json({ error: "Unsupported payment method" });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, in_stock } = req.body;

    const image = [];

    switch (true) {
      case !name:
        return res
          .status(400)
          .send({ success: false, message: "Product Name field Required" });

      case !description:
        return res.status(400).send({
          success: false,
          message: "Product Description field Required",
        });
      case !price:
        return res
          .status(400)
          .send({ success: false, message: "Product Price field Required" });
      case !in_stock:
        return res.status(400).send({
          success: false,
          message: "Product in Stock status field Required",
        });

      case !category:
        return res
          .status(400)
          .send({ success: false, message: "Product category field Required" });
    }

    // Upload each image to Cloudinary
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      image.push(result.secure_url);
      fs.unlinkSync(file.path);
    }
    // Create a new product
    const product = await productModel.create({
      name,
      description,
      price,
      category,
      in_stock,
      slug: slugify(name),
      image: image,
    });

    // Save the product in the database
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

//update
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, in_stock } = req.body;
    const { pid } = req.params;

    const image = [];

    const oldProducts = await productModel.find();
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      image.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    const products = await productModel.findByIdAndUpdate(
      pid,
      {
        name,
        description,
        price,
        category,
        in_stock,
        slug: slugify(name),
        image: image,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error While Updating Product" });
  }
};

// get api product

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Successfully Fetched Signle product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Fetching Single product",
    });
  }
};
// get all api reviews

export const getProductController = async (req, res) => {
  try {
    const product = await productModel
      .find({})
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Successfully Fetched All product",
      countTotal: product.length,
      product,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error In Fetching product" });
  }
};

//featured product api
export const getFeaturedProductController = async (req, res) => {
  try {
    const featuredProducts = await productModel.find({ isFeatured: true });

    res.json(featuredProducts);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error In Fetching product" });
  }
};

export const toggleFeaturedController = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Toggle the isFeatured field
    product.isFeatured = !product.isFeatured;

    await product.save();

    res.json({
      success: true,
      message: `Product featured status toggled successfully`,
      isFeatured: product.isFeatured,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in toggle featured status API",
      error: error.message,
    });
  }
};

// delete api product

export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.pid);
    if (!product) {
      res.status(400).send({ success: false, message: "Product Not Found" });
    }
    await cloudinary.uploader.destroy;
    res
      .status(200)
      .send({ success: true, message: "Successfully Deleted product" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Deleting Product Image",
      error,
    });
  }
};

export const createFilterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length > 0) args.price = { $gte: radio[0], $lte: radio[1] };
    const product = await productModel.find(args);
    res.status(200).send({
      success: true,
      message: "Filter Product Fetched Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Filter Product",
    });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const parsedKeyword = parseFloat(keyword);

    const prod = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        {
          price: isNaN(parsedKeyword)
            ? { $regex: keyword, $options: "i" }
            : { $lte: parsedKeyword },
        },
      ],
    });
    res.json(prod);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in search product api", error });
  }
};

export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in fetching category wise",
      error,
    });
  }
};

export const getSimilarProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .limit(4)
      .populate("category")
      .populate("review");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in fetching similar product",
      error,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error In Counting Products",
      error,
      success: false,
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const perPage = 5;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .skip((page - 1) * perPage)
      .populate("category")
      .limit(perPage)
      .sort({ createdAt: -1 });

    for (const product of products) {
      const reviews = await reviewModel.find({ productId: product._id });
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        product.averageRating =
          Math.round((totalRating / reviews.length) * 2) / 2;
      } else {
        product.averageRating = 0; // No reviews, so the average rating is 0.
      }
    }

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error in fetching per page controller",
    });
  }
};
