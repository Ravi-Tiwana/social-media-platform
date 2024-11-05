const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const { readFile, writeFile } = require('../utils/fileUtils');

const register = (req, res) => {
  const { username, email, password, phone_number } = req.body;
  const users = readFile('users.json');

  // Check if user already exists by email or username
  if (users.find(user => user.email === email || user.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: uuid.v4(),
    username,
    email,
    password: hashedPassword,
    role: 'registered',  // Default role for new users
    phone_number,
    followers: [],
    following: [],
    activity: [],
    posts: []
  };

  users.push(newUser);
  writeFile('users.json', users);
  res.status(201).json({ message: 'User registered successfully' });
};

// Login Functionality
const login = (req, res) => {
  const { email, password } = req.body;
  const users = readFile('users.json');
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Compare hashed password
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  res.status(200).json({ message: 'Login successful', userId: user.id, role: user.role });
};

module.exports = { register, login };
