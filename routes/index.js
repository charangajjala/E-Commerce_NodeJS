import express from "express";

import authRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/user", authRoutes);

export default router;
