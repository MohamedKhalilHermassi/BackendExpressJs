const jwt = require('jsonwebtoken');
//  vérifier le token
function authenticateToken(req, res, next) {
    const authHeader  = req.headers.authorization
    
    if (!authHeader ) return res.status(401).json({ message: 'Access denied. No token provided' });
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Access denied. Invalid token' });
      req.user = user;
      next();
    });
  }
  
  // vérifier les autorisations
  function authorizeUser(userType) {
    return (req, res, next) => {
      if (req.user && req.user.role === userType) {
        next();
      } else {
        res.status(403).json({ message: 'Access denied. Insufficient permissions' });
      }
    };
  }

  module.exports = { authenticateToken, authorizeUser };