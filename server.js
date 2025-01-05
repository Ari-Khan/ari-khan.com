import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Import cors package
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from 'path';  // Needed for path resolution
import { fileURLToPath } from "url";

// Initialize environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Necessary for using __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all origins (you can restrict this to certain origins if needed)
app.use(cors()); // This will allow requests from any origin

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Set up the Google Gemini model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const gemini20Flash = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1.25,
  },
});

// Route to handle content/ai
app.post('/content/ai', async (req, res) => {
    const { prompt } = req.body;

    try {
        const result = await gemini20Flash.generateContent(prompt);
        const aiResponse = result.response.text(); // Assuming Gemini returns a response with a `.text()` method

        // Send back the response to the frontend
        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Error generating AI response:", error);
        res.status(500).json({ error: "Error generating AI response" });
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
