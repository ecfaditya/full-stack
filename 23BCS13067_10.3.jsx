// --- Dependencies ---
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// --- View Engine (EJS for simplicity) ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- MongoDB Connection ---
mongoose.connect('mongodb://localhost:27017/socialApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// --- Models ---
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatar: String,
});
const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  content: String,
  image: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
const Post = mongoose.model('Post', PostSchema);

// --- JWT Secret ---
const SECRET = 'supersecretkey';

// --- Middleware for Auth ---
const auth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.redirect('/login');
  }
};

// --- File Upload (for images) ---
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --- Routes ---
// Home Feed
app.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username avatar').sort({ createdAt: -1 });
  res.render('feed', { posts });
});

// Register
app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hash });
  res.redirect('/login');
});

// Login
app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send('User not found');
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send('Incorrect password');
  const token = jwt.sign({ id: user._id }, SECRET);
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/');
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Create Post
app.get('/create', auth, (req, res) => res.render('create'));
app.post('/create', auth, upload.single('image'), async (req, res) => {
  await Post.create({
    content: req.body.content,
    image: req.file ? '/uploads/' + req.file.filename : null,
    author: req.user._id,
  });
  res.redirect('/');
});

// Like Post
app.post('/like/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.user._id)) {
    post.likes.push(req.user._id);
  } else {
    post.likes = post.likes.filter(uid => uid.toString() !== req.user._id.toString());
  }
  await post.save();
  res.redirect('/');
});

// --- Server Start ---
app.listen(5000, () => console.log('🚀 Social App running at http://localhost:5000'));
