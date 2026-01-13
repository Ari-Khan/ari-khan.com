import express from "express";
import { generateAIResponse } from "../services/google-service.js";
import { generateGroqResponse } from "../services/groq-service.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt, history = [] } = req.body;

  const chatHistory = history.map(h => ({
    role: h.role === "user" ? "user" : "model",
    parts: [{ text: h.message }],
  }));

  try {
    const response = await generateAIResponse(prompt, chatHistory);
    return res.json({ response, provider: "google" });
  } catch (googleErr) {
    console.error("Google AI failed, falling back to Groq:", googleErr);

    try {
      const response = await generateGroqResponse(prompt, chatHistory);
      return res.json({ response, provider: "groq" });
    } catch (groqErr) {
      console.error("Groq AI also failed:", groqErr);

      return res.json({
        response: "⚠️ KingBot is down right now. Try again in a bit.",
        provider: "error"
      });
    }
  }
});

export default router;
