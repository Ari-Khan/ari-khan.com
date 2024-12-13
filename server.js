import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("MongoDB connected successfully!"));
db.on("error", (err) => console.log("MongoDB connection error:", err));

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

const Subscriber = mongoose.model("Subscriber", emailSchema);

app.use(bodyParser.json());
app.use(cors());

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(201).json({ message: "Email added to the mailing list" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
