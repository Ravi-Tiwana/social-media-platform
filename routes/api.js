const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Load data from JSON files
function loadData(file) {
  return JSON.parse(fs.readFileSync(file));
}

// Save data to JSON files
function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// User registration
router.post('/signup', async (req, res) => {
  const { email, mobile, password } = req.body;
  const users = loadData('./data/users.json');

  if (users.find(user => user.email === email || user.mobile === mobile)) {
    return res.status(400).send('Email or mobile already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, mobile, password: hashedPassword, followers: [], following: [], role: 'registered' };

  users.push(newUser);
  saveData('./data/users.json', users);
  res.status(201).send('User registered successfully.');
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = loadData('./data/users.json');
  const user = users.find(user => user.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Invalid credentials.');
  }

  const token = jwt.sign({ email: user.email, role: user.role }, 'your_jwt_secret');
  res.json({ token });
});

module.exports = router;

// Add this to routes/api.js

// Load posts data
function loadPosts() {
    return JSON.parse(fs.readFileSync('./data/posts.json'));
  }
  
  // Save posts data
  function savePosts(posts) {
    fs.writeFileSync('./data/posts.json', JSON.stringify(posts, null, 2));
  }
  
  // Create a post
  router.post('/posts', (req, res) => {
    const { title, description } = req.body;
    const posts = loadPosts();
    const newPost = { id: posts.length + 1, title, description, author: req.user.email, likes: 0, comments: [] };
  
    posts.push(newPost);
    savePosts(posts);
    res.status(201).send('Post created successfully.');
  });
  
  // Get all posts
  router.get('/posts', (req, res) => {
    const posts = loadPosts();
    res.json(posts);
  });

  
  // Add this to routes/api.js

// Add a comment to a post
router.post('/posts/:id/comments', (req, res) => {
    const { text } = req.body;
    const posts = loadPosts();
    const post = posts.find(post => post.id === parseInt(req.params.id));
  
    if (!post) {
      return res.status(404).send('Post not found.');
    }
  
    const newComment = { id: post.comments.length + 1, text, author: req.user.email, nested_comments: [] };
    post.comments.push(newComment);
    savePosts(posts);
    res.status(201).send('Comment added.');
  });

  
  const auth = require('../middleware/auth');

// Protect post creation and comment routes
router.post('/posts', auth, (req, res) => { /* ... */ });
router.post('/posts/:id/comments', auth, (req, res) => { /* ... */ });


// Add this to routes/api.js

// Follow a user
router.post('/follow/:email', auth, (req, res) => {
  const users = loadData('./data/users.json');
  const userToFollow = users.find(user => user.email === req.params.email);
  const currentUser = users.find(user => user.email === req.user.email);

  if (!userToFollow) {
    return res.status(404).send('User not found.');
  }

  if (currentUser.following.includes(userToFollow.email)) {
    return res.status(400).send('Already following this user.');
  }

  currentUser.following.push(userToFollow.email);
  userToFollow.followers.push(currentUser.email);
  saveData('./data/users.json', users);
  res.send('Now following the user.');
});
