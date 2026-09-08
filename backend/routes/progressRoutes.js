import express from "express";
import {
  saveProgress,
  getProgress,
  getProgressSummary,
  reassessLevel,
} from "../controllers/progressController.js";

const router = express.Router();

router.post("/save", saveProgress);
router.post("/reassess", reassessLevel);
router.get("/:user_id/summary", getProgressSummary);
router.get("/:user_id", getProgress);

export default router;
