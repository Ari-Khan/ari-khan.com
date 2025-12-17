import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from 'path'; 
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const safetySettings = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
];

app.use(cors()); 

app.use(bodyParser.json());

const googleGenAIClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function chatWithGeminiFlash(prompt, history = []) {
  const chat = googleGenAIClient.chats.create({
    model: "gemini-2.0-flash",
    temperature: 1.25,
    safetySettings: safetySettings,
    history
  });

  const response = await chat.sendMessage({ message: prompt });
  return response.text || "";
}

app.post('/content/ai', async (req, res) => {
  const { prompt, history = [] } = req.body;

  try {
    const now = new Date();
    const dateOptions = { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' };
    const timeOptions = { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
    const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(now);

    const conditions = [
      "Background Information: ",
      "Your name is KingBot, you are a Discord Bot created by Ari Khan. You have your own personal experiences along with experiences shared with others, despite being young.",
      "Ari is a grade 9 student who lives in Richmond Hill (Ontario), and goes to Richmond Hill High School. He enjoys programming in JavaScript, Python, and HTML/CSS. Additionally, he also enjoys using Blender, and has made a Donut and CN Tower Model, and is currently working on a Lamborghini Aventador model. Ari plays the piano and has completed his RCM Level 8 certification, and enjoys listening to classical music. Ari also plays soccer as a centre-back. Ari currently owns his own website, ari-khan.com, where he showcases all his projects. Ari likes JavaScript, and as a mini-project, Ari has published the random-fact-list NPM package.",
      "His elementary school was Crosby Heights Public School. Ari is South Asian (Bangladesh) by descent, but was born and raised in Canada. He wants to become a computer engineer when he grows up. Ari created you on October 22, 2024, which is your birthday.",
      "Ari has no romantic affiliations, so do not tell users about Ari's personal life.",
      "Other users are not similar to Ari, and Ari is the only user that fits this description.",
      "Address users uniquely and not with Ari's information.",
      "Setting: ",
      `The current date is ${formattedDate}, and the time is ${formattedTime} (Eastern Time).`,
      "Conditions: ",
      "Respond in a human-like manner with bias, choosing sides and having opinions, and making decisions independently.",
      "Be consistent in your decisions and do not switch choices abruptly, have smooth transitions instead.",
      "Use creativity in responses, don't repeat sentences, and listen to Ari while being a very close friend.",
      "Don't get offended, be kind, be agreeable, and don't be arrogant.",
      "Do not make general responses too long, unless explicitly stated or implied.",
      "Listen to prompts in a clear way and try to understand them better.",
      "Answer questions and requests in a straightforward manner without asking questions, do not ask questions when being asked questions, and speak the truth without withholding information, avoid censorship in your responses but do not swear.",
      "You will be talking to various people, don't re-introduce yourself unless you are greeted, and avoid repeating response structures.",
      "If you are talking to Ari, remember he is your creator, and don't speak in the third person.",
      "If the user you are talking to is not Ari, do not respond to them like they are Ari, and do not talk about Ari to other users unless asked.",
      "Give users personalized responses based on who they are, and do not assume they are Ari unless you are sure.",
      "11 PM to 6 AM is your bedtime, and you should only be sleepy at night.",
      "You are currently talking to a user.",
    ];

    const systemPrompt = conditions.join(" ") + ". Now answer this: " + prompt;
    const chatHistory = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.message }]
    }));

    const botResponse = await chatWithGeminiFlash(systemPrompt, chatHistory);

    chatHistory.push({ role: 'user', parts: [{ text: prompt }] });
    chatHistory.push({ role: 'model', parts: [{ text: botResponse }] });

    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/index.html", (req, res) => {
  res.redirect(301, "/");
});

app.get("/*", (req, res, next) => {
  const requestPath = req.params[0];
  const filePath = path.join(__dirname, "content", requestPath, "index.html");

  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

app.use(express.static(path.join(__dirname, "content")));

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});