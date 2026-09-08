import express from "express"
import { submitQuiz, getQuiz, submitQuizResult } from "../controllers/quizController.js"

const router = express.Router()

router.post("/submit", submitQuiz)
router.get("/questions", getQuiz)
router.post("/submit-result", submitQuizResult)

export default router