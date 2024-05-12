import express from "express";
import { singleUpload } from "../middleware/multer.js";
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAllProducts,
  getSingleProduct,
  getTopProducts,
  updateProduct,
  updateProductImage,
} from "../controller/ProductController.js";
import { isAuth, isAdmin } from "../middleware/AuthMiddlerware.js";
const route = express.Router();

// http://localhost:8080/api/v1/Products/all-products
route.get("/all-products", getAllProducts);
route.get("/top", getTopProducts);
route.get("/:id", getSingleProduct);
route.post("/createProduct", isAuth, isAdmin, singleUpload, createProduct);
route.put("/updateProduct/:id", isAuth, isAdmin, updateProduct);
route.put(
  "/updateProductImage/:id",
  isAuth,
  isAdmin,
  singleUpload,
  updateProductImage
);
route.delete("/delete-image/:id", isAuth, isAdmin, deleteProductImage);
route.delete("/delete/:id", isAuth, isAdmin, deleteProduct);

export default route;
