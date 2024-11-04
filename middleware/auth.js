const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access denied.');

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).send('Invalid token.');
    req.user = user;
    next();
  });
}

module.exports = auth;
