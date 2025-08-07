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
    const newGame = new Game(req.body);
    await newGame.save();
    res.status(200).json({ message: "Game saved successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to save game." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
