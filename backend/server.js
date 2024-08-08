const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/userModel");
const jwt = require('jsonwebtoken')
const zod = require('zod')
const userSchema = require('./schemas/userRegisterSchema')
const authMiddleware = require('./middleware/authMiddleware')
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());

// Define an async function to connect to MongoDB
async function connectToDatabase() {
  try {
    // Attempt to connect to MongoDB using the connection string from environment variables
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true, // Use the new URL parser to avoid deprecation warnings
      useUnifiedTopology: true, // Use the new Server Discover and Monitoring engine
    });

    // Log a success message if the connection is established
    console.log("MongoDB connected Successfully");
  } catch (err) {
    // Log an error message if the connection fails
    console.error("Error connecting to Database:", err.message);
  }
}

// Call the function to initiate the connection to the database
connectToDatabase();

//---------------------------------------------

// Route to handle user registration
app.post("/register", async (req, res) => {
  // Extract user details from the request body
  const { name, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !password || !email) {
    return res.status(400).json({
      message: 'Every field is required'
    });
  }

  try {
    // Hash the password using bcrypt before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object with the hashed password
    const userDetails = {
      name,
      email,
      password: hashedPassword, // Ensure the password field is correctly named
    };

    // Validate user details against the schema
    const parsedUserDetails = userSchema.safeParse(userDetails);

    if (!parsedUserDetails.success) {
      // If validation fails, send a response with validation errors
      return res.status(400).json({
        message: "Validation failed",
        errors: parsedUserDetails.error.errors
      });
    }
    
    console.log("Valid data: ", parsedUserDetails.data);

    // Instantiate a new User model with validated user details
    const user = new User(userDetails);

    // Save the new user to the database
    await user.save();

    // Log a success message
    console.log("User Created Successfully");

    // Send a success response
    return res.json({
      message: "User Created Successfully",
    });
  } catch (err) {
    // Log error message and send an error response if something goes wrong
    console.error("Error creating User:", err.message);
    return res.status(500).json({
      message: "Error creating User",
    });
  }
});

//---------------------------


app.post('/login', async (req, res) => {
  const{email, password} = req.body
  if(!email, !password){
    console.log("All fields are required");
    
    return res.json({
      message : "All fields are required"
    })
  }
  const user = await User.findOne({email : email})
  if(!user){
    console.log("User not found");
    
    return res.json({
      message : 'User not found'
    })
  }
  try{
    const isMatch = await bcrypt.compare(password,user.password)
    if(isMatch){
      const payload = {
        id: user._id,
        email: user.password 
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      res.json({token})
      console.log("token", token);
    }
  }catch(err){
    console.log("Error Login");
    res.json({
      message : 'Error Login'
    })
    
  }
  res.json(user.password)
})

app.post('/cards', authMiddleware, async(req, res) => {

  res.json({
    msg : "cards"
  })
})





app.listen(3000, () => console.log("server running on port 3000"));
