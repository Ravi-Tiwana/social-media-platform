const express = require('express');
const bodyParser = require('body-parser');
const { register, login } = require('C:/Users/tiwan/Desktop/back end/social-media-backend/controllers/authController.js');
const { createPost, addComment, likePost } = require('C:/Users/tiwan/Desktop/back end/social-media-backend/controllers/postController.js');
const { followUser } = require('./controllers/userController');

const app = express();
app.use(bodyParser.json());

// User Authentication
app.post('/register', register);
app.post('/login', login);

// Post Routes
app.post('/posts', createPost);
app.post('/posts/:id/comments', addComment);
app.post('/posts/:id/like', likePost);

// User Routes
app.post('/follow', followUser);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
