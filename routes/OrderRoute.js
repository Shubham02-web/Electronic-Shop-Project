import express from "express";
import {
  CreateOrder,
  GetMyAllOrders,
  PaymentController,
  cancelOrder,
  cancelSingleOrder,
  getAllOrderAdmin,
  getMySingleOrder,
} from "../controller/OrderController.js";
import { isAdmin, isAuth } from "../middleware/AuthMiddlerware.js";

const route = express.Router();

// http://localhost:8080/api/v1/orders/createOrder
route.post("/createOrder", isAuth, CreateOrder);
route.post("/payement", isAuth, PaymentController);

route.get("/MyAll-Orders", isAuth, GetMyAllOrders);

route.get("/getMySingleOrder/:id", isAuth, getMySingleOrder);
route.get("/admin-getAllOrder", isAuth, isAdmin, getAllOrderAdmin);
route.delete("/deleteAllOrder", isAuth, cancelOrder);
route.delete("/deleteSingleOrder/:id", isAuth, cancelSingleOrder);

export default route;
