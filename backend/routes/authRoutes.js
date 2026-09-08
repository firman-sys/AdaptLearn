import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", getUserProfile);

export default router;
