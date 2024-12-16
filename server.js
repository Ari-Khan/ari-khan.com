import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

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