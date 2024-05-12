import Category from "../models/Category.js";
import ProductModel from "../models/ProductModel.js";
import { User } from "../models/UserModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
export const getAllProducts = async (req, res, next) => {
  const { keyword, category } = req.query;
  try {
    const product = await ProductModel.find({
      name: {
        $regex: keyword ? keyword : "",
        $options: "i",
      },
    }).populate("category");
    res.status(200).send({
      success: true,
      message: "Products found succesfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getAllProduct API",
      error,
    });
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find({})
      .sort({ rating: -1 })
      .limit(5)
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Top 5 Products",
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getTop Products API",
    });
  }
};
export const getSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return console.log("please provide Product ID");
    const product = await ProductModel.findById(id).populate("category");

    if (!product)
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    res.status(200).send({
      success: true,
      message: "successfully get single product",
      product,
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
      message: "Error in get SingleProduct API",
      error,
    });
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category)
      return res.status(500).send({
        success: false,
        message: "please provide all fields",
      });

    if (!req.file)
      return res.status(500).send({
        success: false,
        message: "please upload image",
      });

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);

    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    const product = await ProductModel.create({
      name,
      description,
      price,
      stock,
      category,
      images: [image],
    });

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Product API",
    });
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product)
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    const { name, description, price, stock, category } = await req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    return res.status(200).send({
      success: true,
      message: "product updated succesfully",
      product,
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
      message: "Error in Update Product API",
      error,
    });
  }
};

export const updateProductImage = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product)
      return res.status(404).send({
        success: false,
        message: "product not found",
      });

    if (!req.file)
      return res.status(500).send({
        success: false,
        message: "Image not found",
      });

    const file = getDataUri(req.file);

    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    product.images.push(image);
    await product.save();

    res.status(200).send({
      success: true,
      message: "product image update successfully",
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
      message: "Error in Update Product Image API",
      error,
    });
  }
};

export const deleteProductImage = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product)
      return res.status(404).send({
        success: true,
        message: "Product not found",
      });

    //  Provide Product Image ID as a query
    const id = req.query.id;
    if (!id)
      return res.status(404).send({
        success: false,
        message: "Product Image Not Found",
      });

    let isExists = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) isExists = index;
    });

    if (isExists < 0)
      return res.status(404).send({
        success: false,
        message: "Image not found",
      });

    await cloudinary.v2.uploader.destroy(product.images[isExists].public_id);
    product.images.splice(isExists, 1);
    await product.save();

    return res.status(200).send({
      success: true,
      message: "product image deleted successfully",
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
      message: "Error in delete Product Image API",
      error,
    });
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product)
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });

    // find and delete image cloudinary
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "product deleted succefully",
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
      message: "Error in delete Product API",
      error,
    });
  }
};
