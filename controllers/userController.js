const { readFile, writeFile } = require('../utils/fileUtils');

const followUser = (req, res) => {
  const { userId, followUserId } = req.body;
  const users = readFile('users.json');

  const user = users.find(u => u.id === userId);
  const followUser = users.find(u => u.id === followUserId);

  if (!user || !followUser) return res.status(404).json({ message: 'User not found' });

  // Add to followers and following lists
  if (!user.following.includes(followUserId)) {
    user.following.push(followUserId);
    followUser.followers.push(userId);
    writeFile('users.json', users);
    return res.status(200).json({ message: 'Now following user' });
  } else {
    return res.status(400).json({ message: 'Already following this user' });
  }
};

module.exports = { followUser };
