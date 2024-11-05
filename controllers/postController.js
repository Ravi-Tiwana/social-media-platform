const { readFile, writeFile } = require('../utils/fileUtils');
const uuid = require('uuid');

const createPost = (req, res) => {
  const { title, description } = req.body;
  const { userId } = req;

  const posts = readFile('posts.json');
  const newPost = {
    id: uuid.v4(),
    authorId: userId,
    title,
    description,
    likes: 0,
    comments: [],
    createdAt: new Date().toISOString()
  };

  posts.push(newPost);
  writeFile('posts.json', posts);
  res.status(201).json({ message: 'Post created successfully', postId: newPost.id });
};

const addComment = (req, res) => {
  const { postId, text } = req.body;
  const { userId } = req;
  
  const posts = readFile('posts.json');
  const post = posts.find(p => p.id === postId);
  
  if (!post) return res.status(404).json({ message: 'Post not found' });
  
  const newComment = {
    id: uuid.v4(),
    authorId: userId,
    text,
    likes: 0,
    nestedComments: [],
    createdAt: new Date().toISOString()
  };

  post.comments.push(newComment);
  writeFile('posts.json', posts);
  res.status(201).json({ message: 'Comment added successfully', commentId: newComment.id });
};

const likePost = (req, res) => {
  const { postId } = req.body;
  const { userId } = req;

  const posts = readFile('posts.json');
  const post = posts.find(p => p.id === postId);
  
  if (!post) return res.status(404).json({ message: 'Post not found' });

  // Increase like count for the post
  post.likes += 1;
  writeFile('posts.json', posts);

  res.status(200).json({ message: 'Post liked', likes: post.likes });
};

module.exports = { createPost, addComment, likePost };