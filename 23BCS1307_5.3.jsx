// ======================================================
// 🛍️ E-Commerce Catalog using MongoDB Nested Documents
// Node.js + Express + Mongoose (Single File Implementation)
// ======================================================

// 1️⃣ Import Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// 2️⃣ Initialize Express App
const app = express();
app.use(bodyParser.json());

// 3️⃣ Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/ecommerceDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// ======================================================
// 🧱 MODEL — Product Schema with Nested Documents
// ======================================================

// Variant Subdocument (nested)
const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  price: Number,
  stock: Number,
});

// Review Subdocument (nested)
const reviewSchema = new mongoose.Schema({
  user: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now },
});

// Category Subdocument (nested)
const categorySchema = new mongoose.Schema({
  main: String,
  sub: String,
});

// Product Schema (main document)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  description: String,
  categories: categorySchema,
  variants: [variantSchema],
  reviews: [reviewSchema],
  createdAt: { type: Date, default: Date.now },
});

// Create Model
const Product = mongoose.model("Product", productSchema);


// ======================================================
// 🧠 CONTROLLER — CRUD Operations for Product Catalog
// ======================================================

// CREATE Product
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json({ message: "✅ Product created", data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ All Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ One Product
app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Product
app.put("/products/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "✅ Product updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Product
app.delete("/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "🗑️ Product deleted", data: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ======================================================
// 👀 VIEW — Basic Homepage Route
// ======================================================
app.get("/", (req, res) => {
  res.send(`
    <h1>🛒 E-Commerce Catalog (MongoDB Nested Documents)</h1>
    <p>Available Endpoints:</p>
    <ul>
      <li>POST /products → Create product</li>
      <li>GET /products → Get all products</li>
      <li>GET /products/:id → Get product by ID</li>
      <li>PUT /products/:id → Update product</li>
      <li>DELETE /products/:id → Delete product</li>
    </ul>
    <p>Use Postman to send JSON requests.</p>
  `);
});


// ======================================================
// 🚀 START SERVER
// ======================================================
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
