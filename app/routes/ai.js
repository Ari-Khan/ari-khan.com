import express from "express";
import { generateAIResponse } from "../services/ai-service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt, history = [] } = req.body;

  try {
    const response = await generateAIResponse(prompt, history);
    res.json({ response });
  } catch (err) {
    console.error("AI route error:", err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;
