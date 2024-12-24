import express from "express";
import { getUser, logout, signup } from "../controllers/auth.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.post("/signup", asyncHandler(signup));

router.get("/users", asyncHandler(getUser));

router.get("logout", asyncHandler(logout));

export default router;
