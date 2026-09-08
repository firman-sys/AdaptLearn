import express from "express";
import {
  getMaterials,
  getMaterialById,
  getMaterialsByLevel,
  getTopics,
} from "../controllers/materialController.js";

const router = express.Router();

router.get("/topics", getTopics);
router.get("/level/:level", getMaterialsByLevel);
router.get("/:id", getMaterialById);
router.get("/", getMaterials);

export default router;
