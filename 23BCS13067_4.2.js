const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// In-memory array to store cards
let cards = [
  { id: 1, suit: "Hearts", value: "Ace" },
  { id: 2, suit: "Spades", value: "King" },
  { id: 3, suit: "Diamonds", value: "Queen" }
];

// ✅ GET all cards
app.get("/cards", (req, res) => {
  res.status(200).json(cards);
});

// ✅ GET a card by ID
app.get("/cards/:id", (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = cards.find(c => c.id === cardId);

  if (card) {
    res.status(200).json(card);
  } else {
    res.status(404).json({ message: "Card not found" });
  }
});

// ✅ POST a new card
app.post("/cards", (req, res) => {
  const { suit, value } = req.body;

  if (!suit || !value) {
    return res.status(400).json({ message: "Suit and value are required" });
  }

  const newCard = {
    id: cards.length + 1,
    suit,
    value
  };

  cards.push(newCard);
  res.status(201).json(newCard);
});

// ✅ DELETE a card by ID
app.delete("/cards/:id", (req, res) => {
  const cardId = parseInt(req.params.id);
  const index = cards.findIndex(c => c.id === cardId);

  if (index !== -1) {
    const removed = cards.splice(index, 1);
    res.status(200).json({ message: "Card deleted", card: removed[0] });
  } else {
    res.status(404).json({ message: "Card not found" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
