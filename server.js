import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log("MongoDB connection error:", err));

const db = mongoose.connection;
db.on("error", (err) => console.log("MongoDB connection error:", err));

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

const Subscriber = mongoose.model("Subscriber", emailSchema);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  try {
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    res.status(201).json({ message: "Email added to the mailing list!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));