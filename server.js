import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));