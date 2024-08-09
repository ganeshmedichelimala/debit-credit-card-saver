const jwt = require("jsonwebtoken");

// Middleware function to authenticate requests using JWT
function authMiddleware(req, res, next) {
  // Retrieve the Authorization header from the request
  const authHeader = req.headers["authorization"];

  // Log the incoming request's authorization header
  console.log("Authorization header received:", authHeader);

  // Check if the Authorization header is missing
  if (!authHeader) {
    console.log("Error: Authorization header missing");
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // Check if the Authorization header starts with 'Bearer '
  if (!authHeader.startsWith("Bearer ")) {
    console.log("Error: Authorization header format is incorrect");
    return res
      .status(401)
      .json({ message: "Authorization header format is incorrect" });
  }

  // Extract the token from 'Bearer <token>'
  const token = authHeader.split(" ")[1];
  console.log("Extracted token:", token);

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token successfully verified. Decoded payload:", decoded);

    // Attach decoded user data to the request object
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    // Handle invalid or expired token
    console.error("Error verifying token:", err.message);
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: err.message });
  }
}

module.exports = authMiddleware;
