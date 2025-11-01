const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/crudApp', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema & Model
const UserSchema = new mongoose.Schema({ name: String, email: String });
const User = mongoose.model('User', UserSchema);

// Routes
app.get('/users', async (req, res) => res.json(await User.find()));
app.post('/users', async (req, res) => res.json(await User.create(req.body)));
app.put('/users/:id', async (req, res) => res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/users/:id', async (req, res) => res.json(await User.findByIdAndDelete(req.params.id)));

app.listen(5000, () => console.log('Server running on port 5000'));
