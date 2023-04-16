import express from "express";
import * as userController from "../controllers/userController.js";
import * as userValidator from "../validations/userValidator.js";
const router = express.Router();

router.post(
  "/signup",
  userValidator.postSignUp.reqValidator(),
  userController.postSignUp.serve,
  userValidator.postSignUp.resValidateSender()
);

export default router;
