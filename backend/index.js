import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/quiz", quizRoutes);

app.use("/api/materials", materialRoutes);

app.use("/api/progress", progressRoutes);

app.use("/api/recommendations", recommendationRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "AdaptLearn API is running 🚀",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth",
      quiz: "/api/quiz",
      materials: "/api/materials",
      progress: "/api/progress",
      recommendations: "/api/recommendations",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} tidak ditemukan`
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ AdaptLearn server running on port ${PORT}`);
  });
}

export default app;
