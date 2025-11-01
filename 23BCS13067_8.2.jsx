
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// 🧾 Dummy user database
const users = [
  { id: 1, username: "admin", password: bcrypt.hashSync("1234", 8) }
];

// 🔑 Secret key for signing JWTs (in real apps, keep this in .env)
const JWT_SECRET = "my_secret_key";

// 🧍‍♂️ Route: User Login (Generate JWT)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "User not found" });

  // Validate password
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  // Generate JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "Login successful", token });
});

// 🧱 Middleware: Verify JWT Token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Expected format: "Bearer <token>"
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid or expired token" });

    req.user = decoded; // Save decoded user info for later use
    next();
  });
}

// 🔒 Protected Route
app.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.username}!`,
    userData: req.user,
  });
});

// 🌐 Public Route
app.get("/", (req, res) => {
  res.send("Welcome to the JWT Auth Demo API");
});

// 🚀 Start the server
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
