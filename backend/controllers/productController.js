import slugify from "slugify";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import braintree from "braintree";
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

export const brainTreePaymentsController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 350;
    const productsToUpdate = []; // To track products that need quantity updates
    let quantityError = false; // Flag to check if any product has a zero quantity

    // Calculate the total and update the productsToUpdate array
    cart.map((orderItem) => {
      if (orderItem.quantity <= 0) {
        // Handle the case where quantity is zero
        quantityError = true;
        return;
      }
      if (quantityError) {
        // Respond with an error message if any product has zero quantity
        res
          .status(400)
          .json({ error: "One or more products have a quantity of zero." });
        return;
      }

      total += orderItem.price * orderItem.quantity;

      productsToUpdate.push({
        _id: orderItem._id,
        quantity: orderItem.quantity,
        name: product.name,
        image:product.image
      });
    });

    // Create a Braintree transaction
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (error, result) {
        if (result) {
          // Update product quantities in the Product schema
          try {
            for (const productUpdate of productsToUpdate) {
              const product = await productModel.findById(productUpdate._id);
              if (product) {
                // Decrease the product quantity based on the order quantity
                product.quantity -= productUpdate.quantity;
                await product.save();
              }
            }
          } catch (err) {
            console.error(err);
          }

          // Save the order with updated quantities
          const order = new orderModel({
            products: cart,
            total: total, // Set the total outside of the payment
            payment: result,
            purchaser: req.user._id,
          }).save();

          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, category, in_stock } = req.body;

    const image = [];

    switch (true) {
      case !name:
        return res
          .status(400)
          .send({ success: false, message: "Product Name field Required" });
      case !quantity:
        return res
          .status(400)
          .send({ success: false, message: "Product Quantity field Required" });
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
      quantity,
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
    const { name, description, price, quantity, category, in_stock } = req.body;
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
        quantity,
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
// get all api product

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

    const prod = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
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
      .populate("category");
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
