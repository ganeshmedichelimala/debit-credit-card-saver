const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// User Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !password || !email) {
    console.log("Error: Missing fields", { name, email, password });
    return res.status(400).json({ message: "Every field is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDetails = { name, email, password: hashedPassword };

    const parsedUserDetails = userSchema.safeParse(userDetails);

    if (!parsedUserDetails.success) {
      console.log("Validation failed", parsedUserDetails.error.errors);
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedUserDetails.error.errors,
      });
    }

    const user = new User(userDetails);
    await user.save();
    console.log("User Created Successfully", user);

    return res.json({ message: "User Created Successfully" });
  } catch (err) {
    console.error("Error creating User:", err.message);
    return res.status(500).json({ message: "Error creating User" });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Error: Missing fields", { email, password });
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Error: User not found", { email });
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Error: Incorrect password");
      return res.status(401).json({ message: "Incorrect password" });
    }

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Login successful, token generated");
    return res.json({ token });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({ message: "Error during login" });
  }
};
