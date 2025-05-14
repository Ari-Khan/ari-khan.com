import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Import CORS
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import dotenv from "dotenv";
import path from 'path';  // For path resolution
import { fileURLToPath } from "url";
import mongoose from 'mongoose';  // Import Mongoose for MongoDB
import ChatHistory from './models/ChatHistory.js';  // Import the ChatHistory schema

// Initialize ENV variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Necessary for using __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

// Enable CORS for all origins
app.use(cors()); 

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Set up the Google Gemini model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const gemini20Flash = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-exp",
  safetySettings: safetySettings,
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1.25,
  },
});

// MongoDB connection using Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Route to handle content/ai
app.post('/content/ai', async (req, res) => {
  const { prompt } = req.body;

  try {
    const now = new Date();

    const dateOptions = {
      timeZone: 'America/New_York',
      weekday: 'long',
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    };

    const timeOptions = {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
    const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(now);

    const conditions = [
      "Background Information: ",
      "Your name is KingBot, you are a Discord Bot created by Ari Khan. You have your own personal experiences along with experiences shared with others, despite being young.",
      "Ari is a grade 9 student who lives in Richmond Hill (Ontario), and goes to Richmond Hill High School. He enjoys programming in JavaScript, Python, and HTML/CSS. Additionally, he also enjoys using Blender, and has made a Donut and CN Tower Model, and is currently working on a Lamborghini Aventador model. Ari plays the piano and has completed his RCM Level 8 certification, and enjoys listening to classical music. Ari also plays soccer as a centre-back. Ari currently owns his own website, ari-khan.com, where he showcases all his projects. Ari likes JavaScript, and as a mini-project, Ari has published the random-fact-list NPM package. He is currently taking French (Mme. Fu), Science (Ms. Hu), Business (Mr. Hatzimalis), and Phys-Ed (Mr. Harris) courses in that order. last semester he took English (Dr. Zsebik), Geography (Ms. Leale), Math (Ms. Jmemari), and Computer Science (Ms. Wang) courses in that order. He is also in Band, organized by Mr. Rawlins and Ms. Christopoulos, wich runs from 3:40 PM to 5:40 PM on Thursdays, and on Tuesdays and Wednesdays from 7:40 AM to 8:40 AM, with only woodwinds being on Tuesdays and brass being on Wednesdays. Ari plays a brass instrument, the trombone. He is in Debate Club (Mondays), Band (Thursdays), and DECA (Fridays).",
      "His elementary school was Crosby Heights Public School, and Ms. Boehlke was his homeroom teacher in Grade 7/8. Ms. Boehlke taught him English, Science, Math, and Phys-Ed, with Science and Phys-Ed being her main subjects. In Grade 8, Ari had Ms. Gibson for Geography, History, Art, and Drama, Ms. Boehlke for Health, Ms. Deluca for French, and Ms. Michopolous for Music. In Grade 7, Ari had Mr. Nacuta for Geography and Health, Ms. Deluca for French and Media, Ms. Michopolous for Music, and Mr. Puvaneswaran (Mr. P) for Drama and Art. Ari also had Ms. Levy as his Grade 6 homeroom teacher.",
      "Ari is South Asian (Bangladesh) by descent, but was born and raised in Canada. He wants to become a computer engineer when he grows up. Ari created you on October 22, which is your birthday.",
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

    const humanPrompt = conditions.join(" ") + ". Now answer this: " + prompt;

    const historyDocuments = await ChatHistory.find()
      .sort({ createdAt: -1 })
      .limit(500);
    const history = historyDocuments.reverse().map((doc) => ({
      role: 'user',
      parts: [{ text: doc.message }],
    }));

    history.push({
      role: 'user',
      parts: [{ text: humanPrompt }],
    });

    let attempts = 0;
    const maxAttempts = 3;
    let botResponse;

    while (attempts < maxAttempts) {
      try {
        const chat = gemini20Flash.startChat({ history: history });
        const result = await chat.sendMessage(humanPrompt);
        botResponse = result.response.text();
        break; // Exit loop on successful response
      } catch (retryError) {
        attempts++;
        console.error(`Retry attempt ${attempts} failed:`, retryError);
        if (attempts >= maxAttempts) throw retryError;
      }
    }

    await ChatHistory.create({ user: 'User', message: prompt });
    await ChatHistory.create({ user: 'KingBot', message: botResponse });

    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Redirect /index.html to /
app.get("/index.html", (req, res) => {
  res.redirect(301, "/");
});

// Dynamic routing for folders
app.get("/:folder", (req, res, next) => {
  const folder = req.params.folder;
  const filePath = path.join(__dirname, "content", folder, "index.html");

  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

// Handle deeper paths dynamically
app.get("/:folder/*", (req, res, next) => {
  const folder = req.params.folder;
  const subPath = req.params[0];
  const filePath = path.join(__dirname, "content", folder, subPath);

  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

// Serve static files from the "content" directory
app.use(express.static(path.join(__dirname, "content")));

// Fallback route for index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "content/index.html"));
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
