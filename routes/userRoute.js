import express, { Router } from "express";
import {
  UserLogout,
  UserProfileController,
  loginController,
  registerController,
  updateUser,
  Updatephone,
  Resetphone,
} from "../controller/userController.js";
import { isAuth } from "../middleware/AuthMiddlerware.js";

import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// route object
const route = express.Router();

// routes
// http://localhost:8080/api/v1/user/register
route.post("/register", limiter, registerController);
route.post("/login", limiter, loginController);

route.get("/profile", isAuth, UserProfileController);
route.get("/logout", isAuth, UserLogout);
route.put("/updateUser", isAuth, updateUser);
route.put("/updatePhone", isAuth, Updatephone);
route.put("/resetPhone", Resetphone);
// export route
export default route;
