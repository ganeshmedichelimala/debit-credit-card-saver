const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { userSchema } = require("../schemas/userLoginSchema"); // Assuming you have a userSchema for validation

// User Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !password || !email) {
    console.log("Error: Missing fields", { name, email, password });
    return res.status(400).json({ message: "Every field is required" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDetails = { name, email, password: hashedPassword };

    // Validate user details using the schema
    const parsedUserDetails = userSchema.safeParse(userDetails);

    if (!parsedUserDetails.success) {
      console.log("Validation failed", parsedUserDetails.error.errors);
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedUserDetails.error.errors,
      });
    }

    // Create a new user
    const user = new User(userDetails);
    await user.save();
    console.log("User Created Successfully", user);

    return res.json({ message: "User Created Successfully" });
  } catch (err) {
    // Log and handle errors during user creation
    console.error("Error creating User:", err.message);
    return res.status(500).json({ message: "Error creating User" });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if both fields are provided
  if (!email || !password) {
    console.log("Error: Missing fields", { email, password });
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Error: User not found", { email });
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Error: Incorrect password");
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate a JWT token
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Login successful, token generated");
    return res.json({ token });
  } catch (err) {
    // Log and handle errors during login
    console.error("Error during login:", err.message);
    return res.status(500).json({ message: "Error during login" });
  }
};
