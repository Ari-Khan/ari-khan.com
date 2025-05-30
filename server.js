import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from "url";
import mongoose from 'mongoose';
import ChatHistory from './models/ChatHistory.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const gemini20Flash = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-04-17",
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  ],
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1.25,
  },
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/content/ai', async (req, res) => {
  const { prompt } = req.body;
  try {
    const now = new Date();
    const dateOptions = { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' };
    const timeOptions = { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
    const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(now);

    const conditions = [/* your long preamble here */];
    const humanPrompt = conditions.join(" ") + ". Now answer this: " + prompt;

    const historyDocs = await ChatHistory.find().sort({ createdAt: -1 }).limit(500);
    const history = historyDocs.reverse().map(doc => ({ role: 'user', parts: [{ text: doc.message }] }));
    history.push({ role: 'user', parts: [{ text: humanPrompt }] });

    let attempts = 0;
    let botResponse;
    while (attempts < 3) {
      try {
        const chat = gemini20Flash.startChat({ history });
        const result = await chat.sendMessage(humanPrompt);
        botResponse = result.response.text();
        break;
      } catch (err) {
        attempts++;
        if (attempts >= 3) throw err;
      }
    }

    await ChatHistory.create({ user: 'User', message: prompt });
    await ChatHistory.create({ user: 'KingBot', message: botResponse });

    res.json({ response: botResponse });
  } catch (err) {
    console.error('Error generating AI response:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use((req, res, next) => {
  if (!path.extname(req.path)) req.url += '.html';
  next();
});

app.use(express.static(path.join(__dirname, "content")));

app.get("/index.html", (req, res) => {
  res.redirect(301, "/");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "content/index.html"));
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
