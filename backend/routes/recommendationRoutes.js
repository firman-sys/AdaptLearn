import express from "express";
import {
  getRecommendations,
  getYoutubeMaterials,
  getRelatedMaterials,
  getNextMaterial,
  getPreviousMaterial,
} from "../controllers/recommendationController.js";

const router = express.Router();

router.get("/video", getYoutubeMaterials);
router.get("/materials", getRelatedMaterials);
router.get("/next/:current_id", getNextMaterial);
router.get("/previous/:current_id", getPreviousMaterial);
router.get("/:user_id", getRecommendations);

export default router;
