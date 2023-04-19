import express from "express";

import { authenticate } from "../middlewares/authMiddleware.js";
import {
  AdminUserAPI,
  AuthAPI,
  UserAPI,
} from "../controllers/userController/views.js";
import * as userValidator from "../validations/userValidator.js";

//open User Routes
export const router = express.Router();
router.post(
  "/signup",
  userValidator.postSignUp.reqValidator(),
  AuthAPI.postSignUp
);

router.post(
  "/login",
  userValidator.postLogin.reqValidator(),
  AuthAPI.postLogin
);

router.get(
  "/:id",
  authenticate,
  userValidator.getUser.reqValidator(),
  UserAPI.get
);

//Admin User routes
export const adminRouter = express.Router();
adminRouter.post(
  "/signup",
  userValidator.postSignUp.reqValidator(),
  AuthAPI.postSignUp
);

adminRouter.post(
  "/login",
  userValidator.postLogin.reqValidator(),
  AuthAPI.postLogin
);

adminRouter.get(
  "/:id",
  authenticate,
  userValidator.getUser.reqValidator(),
  AdminUserAPI.get
);
