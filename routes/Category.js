import express from "express";
import { isAuth, isAdmin } from "../middleware/AuthMiddlerware.js";
import {
  UpdateCategory,
  createCategory,
  deleteCategory,
  getAllCategory,
} from "../controller/CategoryController.js";
const route = express.Router();

// http://localhost:8080/api/v1/Cat/createCategory
route.post("/createCategory", isAuth, isAdmin, createCategory);
route.get("/all-category", getAllCategory);
route.delete("/delete/:id", isAuth, isAdmin, deleteCategory);
route.put("/Update/:id", isAuth, isAdmin, UpdateCategory);
export default route;
