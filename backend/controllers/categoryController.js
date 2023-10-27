import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    // validation
    if (!name) {
      return res.status(401).send({ message: "Name Is Required" });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res
        .status(200)
        .send({ success: true, message: "Category Already Exists" });
    }
    // createing category
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res
      .status(200)
      .send({
        success: true,
        message: "Category Created Successfully",
        category,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error In Category" });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    // updating category
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res
      .status(200)
      .send({
        success: true,
        message: "Category Updated Successfully",
        category,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error In Updating Category" });
  }
};
export const getCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res
      .status(200)
      .send({
        success: true,
        message: "Successfully Fetched Category",
        category,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error In Fetching Category" });
  }
};
export const getSignleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res
      .status(200)
      .send({
        success: true,
        message: "Successfully Fetched Signle Category",
        category,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        error,
        message: "Error In Fetching Single Category",
      });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res
      .status(200)
      .send({ success: true, message: "Successfully Deleted Category" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error In Deleting Category" });
  }
};
