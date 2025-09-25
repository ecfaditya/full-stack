const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory seats data
// States: available | locked | booked
let seats = [
  { id: 1, status: "available", lockedBy: null, lockExpiry: null },
  { id: 2, status: "available", lockedBy: null, lockExpiry: null },
  { id: 3, status: "available", lockedBy: null, lockExpiry: null }
];

// Utility function: clear expired locks
function clearExpiredLocks() {
  const now = Date.now();
  seats.forEach(seat => {
    if (seat.status === "locked" && seat.lockExpiry && now > seat.lockExpiry) {
      seat.status = "available";
      seat.lockedBy = null;
      seat.lockExpiry = null;
    }
  });
}

// ✅ View all seats
app.get("/seats", (req, res) => {
  clearExpiredLocks();
  res.json(seats);
});

// ✅ Lock a seat
app.post("/lock", (req, res) => {
  clearExpiredLocks();

  const { seatId, userId } = req.body;
  if (!seatId || !userId) {
    return res.status(400).json({ message: "seatId and userId are required" });
  }

  const seat = seats.find(s => s.id === seatId);

  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seat.status === "booked") {
    return res.status(400).json({ message: "Seat already booked" });
  }

  if (seat.status === "locked" && seat.lockedBy !== userId) {
    return res.status(400).json({ message: "Seat is currently locked by another user" });
  }

  // Lock the seat for 1 minute
  seat.status = "locked";
  seat.lockedBy = userId;
  seat.lockExpiry = Date.now() + 60 * 1000;

  res.json({ message: `Seat ${seatId} locked for user ${userId}` });
});

// ✅ Confirm booking
app.post("/confirm", (req, res) => {
  clearExpiredLocks();

  const { seatId, userId } = req.body;
  if (!seatId || !userId) {
    return res.status(400).json({ message: "seatId and userId are required" });
  }

  const seat = seats.find(s => s.id === seatId);

  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seat.status === "booked") {
    return res.status(400).json({ message: "Seat already booked" });
  }

  if (seat.status !== "locked" || seat.lockedBy !== userId) {
    return res.status(400).json({ message: "Seat is not locked by this user" });
  }

  // Confirm booking
  seat.status = "booked";
  seat.lockedBy = null;
  seat.lockExpiry = null;

  res.json({ message: `Seat ${seatId} successfully booked by user ${userId}` });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
