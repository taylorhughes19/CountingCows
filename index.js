const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔐 Connect to MongoDB
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;
client.connect()
  .then(() => {
    db = client.db("Counting_Cows");
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
  });


// ✅ Save a game
app.post("/save-game", async (req, res) => {
  const { mode, date, players } = req.body;

  if (!mode || !date || !Array.isArray(players)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.collection("games").insertOne({ mode, date, players });
    res.json({ message: "Game saved successfully.", gameId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Failed to save game.", details: error.message });
  }
});


// ✅ Get all saved games
app.get("/get-games", async (req, res) => {
  try {
    const games = await db.collection("games").find().sort({ date: -1 }).toArray();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch games.", details: error.message });
  }
});


// ✅ Delete a game by ID
app.delete("/delete-game/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.collection("games").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.json({ message: "Game deleted successfully." });
    } else {
      res.status(404).json({ error: "Game not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete game.", details: error.message });
  }
});


// ✅ Root route (optional)
app.get("/", (req, res) => {
  res.send({ message: "API is working" });
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
