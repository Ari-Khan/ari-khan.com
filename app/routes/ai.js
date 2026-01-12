import express from "express";
import { generateAIResponse } from "../services/ai-service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt, history = [] } = req.body;

  try {
    const chatHistory = history.map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.message }],
    }));

    const response = await generateAIResponse(prompt, chatHistory);
    res.json({ response });
  } catch (err) {
    console.error("AI route error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
