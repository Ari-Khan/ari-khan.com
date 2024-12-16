import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
export const fetchCache = 'force-no-store';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));
app.use("/assets", express.static(path.join(__dirname, "content/assets")));
app.use("/gallery", express.static(path.join(__dirname, "content/gallery")));
app.use("/", express.static(path.join(__dirname, "content")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./content/index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "./content/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));