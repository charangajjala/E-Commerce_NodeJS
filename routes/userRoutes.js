import express from "express";

import * as userController from "../controllers/userController.js";
import * as userValidator from "../validations/userValidator.js";
import { authenticate } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post(
  "/signup",
  userValidator.postSignUp.reqValidator(),
  userController.postSignUp.serve,
  userValidator.postSignUp.resValidateSender()
);

router.post(
  "/login",
  userValidator.postLogin.reqValidator(),
  userController.postLogin.serve,
  userValidator.postLogin.resValidateSender()
);

router.get(
  "/:id",
  authenticate,
  userValidator.getUser.reqValidator(),
  userController.getUser.serve,
  userValidator.getUser.resValidateSender()
);

export default router;
