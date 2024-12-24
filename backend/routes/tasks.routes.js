import express from "express";
import {
  createList,
  createTask,
  deleteList,
  deleteTask,
  getLists,
  getTask,
  updatedList,
  updateTask,
} from "../controllers/tasks.controller.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/task", getTask);
router.get("/lists", asyncHandler(getLists));

router.post("/task/:id", createTask);
router.post("/list", asyncHandler(createList));

router.patch("/list/:id", updatedList);
router.patch("/task/:id", updateTask);

router.delete("/task/:id", deleteTask);
router.delete("/list/:id", asyncHandler(deleteList));

export default router;
