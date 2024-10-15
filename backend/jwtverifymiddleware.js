const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: 'Authorization token is missing' });
    
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (err) {
   console.error("Token verification failed:", err);
   return res.status(403).json({ message: 'Invalid token' });
  }
};


module.exports = verifyToken;
