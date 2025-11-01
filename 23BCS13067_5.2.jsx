// ======================================================
// 🎓 Student Management System using MVC + MongoDB + Node.js
// ======================================================

// 1️⃣ Import Required Modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// 2️⃣ Initialize Express App
const app = express();
app.use(bodyParser.json());

// 3️⃣ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/schoolDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));


// ======================================================
// 🧱 MODEL (M) — Defines Student Schema & Model
// ======================================================
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    grade: String,
    city: String
});

const Student = mongoose.model('Student', studentSchema);


// ======================================================
// 🧠 CONTROLLER (C) — Handles CRUD Logic
// ======================================================
const studentController = {

    // CREATE
    async create(req, res) {
        try {
            const student = new Student(req.body);
            const saved = await student.save();
            res.status(201).json({ message: '✅ Student created successfully', data: saved });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // READ (All Students)
    async getAll(req, res) {
        try {
            const students = await Student.find();
            res.json(students);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // READ (By ID)
    async getById(req, res) {
        try {
            const student = await Student.findById(req.params.id);
            if (!student) return res.status(404).json({ message: 'Student not found' });
            res.json(student);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // UPDATE
    async update(req, res) {
        try {
            const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updated) return res.status(404).json({ message: 'Student not found' });
            res.json({ message: '✅ Student updated', data: updated });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // DELETE
    async delete(req, res) {
        try {
            const deleted = await Student.findByIdAndDelete(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Student not found' });
            res.json({ message: '🗑️ Student deleted', data: deleted });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};


// ======================================================
// 👀 VIEW (V) — Express Routes (HTTP Endpoints)
// ======================================================

// Home Route (simple HTML view)
app.get('/', (req, res) => {
    res.send(`
        <h1>🎓 Student Management System (MVC + Mongoose)</h1>
        <p>Available Endpoints:</p>
        <ul>
            <li>POST /students → Create a student</li>
            <li>GET /students → Get all students</li>
            <li>GET /students/:id → Get student by ID</li>
            <li>PUT /students/:id → Update student</li>
            <li>DELETE /students/:id → Delete student</li>
        </ul>
        <p>Use Postman or any REST client to test these endpoints.</p>
    `);
});

// Route Definitions (View → Controller)
app.post('/students', studentController.create);
app.get('/students', studentController.getAll);
app.get('/students/:id', studentController.getById);
app.put('/students/:id', studentController.update);
app.delete('/students/:id', studentController.delete);


// ======================================================
// 🚀 START SERVER
// ======================================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
