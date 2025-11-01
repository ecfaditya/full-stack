// --- Dependencies ---
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// --- View Engine ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Database Connection ---
mongoose.connect('mongodb://localhost:27017/blogPlatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// --- Models ---
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Post = mongoose.model('Post', PostSchema);

const CommentSchema = new mongoose.Schema({
  text: String,
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});
const Comment = mongoose.model('Comment', CommentSchema);

// --- JWT Secret ---
const SECRET = 'secret123';

// --- Middleware to Protect Routes ---
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

// --- Routes ---
// Home page showing all posts
app.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username');
  res.render('index', { posts });
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
  if (!match) return res.send('Wrong password');
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
app.post('/create', auth, async (req, res) => {
  await Post.create({ title: req.body.title, content: req.body.content, author: req.user._id });
  res.redirect('/');
});

// View Single Post
app.get('/post/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  const comments = await Comment.find({ post: post._id }).populate('author', 'username');
  res.render('post', { post, comments });
});

// Add Comment
app.post('/post/:id/comment', auth, async (req, res) => {
  await Comment.create({ text: req.body.text, post: req.params.id, author: req.user._id });
  res.redirect('/post/' + req.params.id);
});

// --- Server Start ---
app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
