import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

const safetySettings = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
];

export async function generateAIResponse(prompt, history = []) {
  const chat = client.chats.create({
    model: "gemini-flash-latest",
    temperature: 1.25,
    safetySettings,
    history: history.map(h => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.message }]
    }))
  });

  const response = await chat.sendMessage({ message: prompt });
  return response.text || "";
}
