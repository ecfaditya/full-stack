const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// 🧾 Dummy user database with roles
const users = [
  { id: 1, username: "admin", password: bcrypt.hashSync("admin123", 8), role: "admin" },
  { id: 2, username: "manager", password: bcrypt.hashSync("manager123", 8), role: "manager" },
  { id: 3, username: "user", password: bcrypt.hashSync("user123", 8), role: "user" }
];

// 🔑 Secret key for JWT signing
const JWT_SECRET = "my_super_secret_key";

// 🧍‍♂️ Login Route: Generates JWT token with role info
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid password" });

  // 🪙 Include the user's role inside the JWT payload
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token });
});

// 🧱 Middleware: Verify JWT Token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Expected: "Bearer <token>"
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
}

// 🛡️ Middleware: Role-based access check
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });
    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({ message: "Access denied: insufficient privileges" });
    next();
  };
}

// 🌐 Public route
app.get("/", (req, res) => {
  res.send("Welcome to the RBAC Demo API!");
});

// 🔒 Protected route (any logged-in user)
app.get("/profile", verifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}!`, role: req.user.role });
});

// 🔐 Admin-only route
app.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: `Welcome, Admin ${req.user.username}.` });
});

// 🧾 Manager or Admin route
app.get("/reports", verifyToken, authorizeRoles("admin", "manager"), (req, res) => {
  res.json({ message: `Access granted to ${req.user.role} for viewing reports.` });
});

// 🚫 Restricted route (users cannot access)
app.get("/super-secret", verifyToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Top secret admin data." });
});

// 🚀 Start server
app.listen(4000, () => console.log("✅ Server running on http://localhost:4000"));
