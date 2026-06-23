import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import aiRoutes from "./routes/ai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/content/ai", aiRoutes);

app.use(express.static(path.resolve(__dirname, "../dist")));
app.use(express.static(path.resolve(__dirname, "../public")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist/index.html"));
});

export default app;
