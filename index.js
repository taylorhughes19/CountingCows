const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const gameSchema = new mongoose.Schema({
  mode: String,
  date: Date,
  players: [
    {
      name: String,
      cows: Number,
    },
  ],
});

const Game = mongoose.model("Game", gameSchema);

app.post("/save-game", async (req, res) => {
  try {
    console.log("Incoming request body:", req.body); // ✅ See incoming data
    const newGame = new Game(req.body);
    await newGame.save(); // 👈 This is where the failure likely happens
    res.status(200).json({ message: "Game saved successfully." });
  } catch (err) {
    console.error("❌ Save failed:", err); // ✅ Log the actual error
    res.status(500).json({ error: "Failed to save game.", details: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
