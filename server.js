import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Import cors package
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

// Serve static files (optional, if you need to serve HTML and other assets)
app.use(express.static('content'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
