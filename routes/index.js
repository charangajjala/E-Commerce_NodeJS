import express from "express";
import * as userRoutes from "./userRoutes.js";

export const router = express.Router();

router.use("/user", userRoutes.router);

export const adminRouter = express.Router();
adminRouter.use("/user", userRoutes.adminRouter);
