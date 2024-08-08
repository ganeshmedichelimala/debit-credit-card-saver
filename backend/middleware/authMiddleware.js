const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next){
  const authHeader  = req.headers['authorization']
   
   // Check if the Authorization header is missing
   if (!authHeader) {return res.status(401).json({ message: 'Authorization header missing' });
  }

    
  // Check if the Authorization header starts with 'Bearer '
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header format is incorrect' });
  }
   // Extract the token from 'Bearer <token>'
   const token = authHeader.split(' ')[1];

   try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user data to the request object
    req.user = decoded;

    // Call next middleware or route handler
    next();
  } catch (err) {
    // Handle invalid or expired token
    res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
}

module.exports = authMiddleware