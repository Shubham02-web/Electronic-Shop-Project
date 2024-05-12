import Category from "../models/Category.js";
import ProductModel from "../models/ProductModel.js";

export const createCategory = async (req, res, next) => {
  try {
    const { category } = req.body;
    if (!category)
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    await Category.create({ category });

    return res.status(200).send({
      success: true,
      message: `${category} Cateogry Created Succesfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Create Category API",
    });
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const category = await Category.find({});

    res.status(200).send({
      success: true,
      message: "All Category Find Succesfully",
      Category_Length: category.length,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get-ALl Category API",
    });
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    const products = await ProductModel.find({ category: category._id });
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }
    await category.deleteOne();
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    // Handling caste Error
    if (error.name === "CastError")
      return res.status(500).send({
        success: false,
        message: "Invalid ID",
      });
    res.status(500).send({
      success: false,
      message: "Error in delete Category API",
      error,
    });
  }
};

export const UpdateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    const { updatedCategory } = req.body;
    if (!updatedCategory)
      return res.status(400).send({
        success: true,
        message: "updatedCategory is required",
      });
    const products = await ProductModel.find({ category: category._id });
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updatedCategory;
      await product.save();
    }
    if (updatedCategory) category.category = updatedCategory;
    await category.save();
    res.status(200).send({
      success: true,
      message: "Category Updated successfully",
    });
  } catch (error) {
    console.log(error);
    // Handling caste Error
    if (error.name === "CastError")
      return res.status(500).send({
        success: false,
        message: "Invalid ID",
      });
    res.status(500).send({
      success: false,
      message: "Error in Update Category API",
      error,
    });
  }
};
