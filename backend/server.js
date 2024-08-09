const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./models/userModel");
const Card = require("./models/cardModel");
const jwt = require("jsonwebtoken");
const zod = require("zod");
const userSchema = require("./schemas/userRegisterSchema");
const cardSchema = require("./schemas/cardSchema");
const authMiddleware = require("./middleware/authMiddleware");
const { default: mongoose } = require("mongoose");
const FriendRequest = require("./models/friendRequestModel");
require("dotenv").config();
const app = express();
app.use(express.json());

// Define an async function to connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected Successfully");
  } catch (err) {
    console.error("Error connecting to Database:", err.message);
  }
}

// Call the function to initiate the connection to the database
connectToDatabase();

// Route to handle user registration
app.post("/register", async (req, res) => {
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
});

// Route to handle user login
app.post("/login", async (req, res) => {
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
});

// Route to handle adding card details
app.post("/cards", authMiddleware, async (req, res) => {
  const { cardNumber, cardHolderName, expiryDate } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("Error: User not found", { userId });
      return res.status(404).json({ message: "User not found" });
    }

    const existingCard = await Card.findOne({ cardNumber });
    if (existingCard) {
      console.log("Error: Card already exists", { cardNumber });
      return res.status(400).json({ message: "Card already exists" });
    }

    const cardData = { cardNumber, cardHolderName, expiryDate, user: userId };

    cardSchema.parse(cardData);

    const card = new Card(cardData);
    await card.save();

    console.log("Card details saved successfully", card);
    return res
      .status(201)
      .json({ cardNumber, cardHolderName, expiryDate, userId });
  } catch (err) {
    if (err instanceof zod.ZodError) {
      console.log("Validation failed for card data", err.errors);
      return res
        .status(400)
        .json({ message: "Invalid card data", errors: err.errors });
    }

    console.error("Error saving card:", err.message);
    return res.status(500).json({ message: "Error saving card" });
  }
});

// Route to retrieve all cards for a user
app.get("/cards", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const cards = await Card.find({ user: userId });

    if (cards.length === 0) {
      console.log("No cards found for the user", { userId });
      return res.status(404).json({ message: "No cards found for the user" });
    }

    return res.status(200).json(cards);
  } catch (err) {
    console.error("Error retrieving cards:", err.message);
    return res.status(500).json({ message: "Error retrieving cards" });
  }
});

// Route to handle sending a friend request
app.post("/friends/request", authMiddleware, async (req, res) => {
  const requesterId = req.user.id;
  const { recipientEmail } = req.body;

  try {
    const recipientUser = await User.findOne({ email: recipientEmail });
    if (!recipientUser) {
      console.log("Error: Recipient user not found", { recipientEmail });
      return res.status(404).json({ message: "User not found" });
    }
    const recipientId = recipientUser._id.toString();

    const existingRequest = await FriendRequest.findOne({
      requester: requesterId,
      recipient: recipientId,
    });
    if (existingRequest) {
      console.log("Error: Friend request already sent", {
        requesterId,
        recipientId,
      });
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const friendRequest = new FriendRequest({
      requester: requesterId,
      recipient: recipientId,
    });
    await friendRequest.save();

    console.log("Friend request sent successfully", {
      requesterId,
      recipientId,
    });
    return res
      .status(201)
      .json({ message: "Friend request sent successfully" });
  } catch (err) {
    console.error("Error sending friend request:", err.message);
    return res.status(500).json({ message: "Error sending friend request" });
  }
});

// Route to handle accepting a friend request
app.post("/friends/accept", authMiddleware, async (req, res) => {
  const recipientId = req.user.id;
  const { requesterEmail } = req.body;

  try {
    const requesterUser = await User.findOne({ email: requesterEmail });
    if (!requesterUser) {
      console.log("Error: Requester user not found", { requesterEmail });
      return res.status(404).json({ message: "User not found" });
    }
    const requesterId = requesterUser._id.toString();

    const friendRequest = await FriendRequest.findOne({
      requester: recipientId,
      recipient: requesterId,
    });
    if (!friendRequest) {
      console.log("Error: Friend request not found", {
        requesterId,
        recipientId,
      });
      return res.status(404).json({ message: "Friend request not found" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(recipientId, {
      $addToSet: { friends: requesterId },
    });
    await User.findByIdAndUpdate(requesterId, {
      $addToSet: { friends: recipientId },
    });

    console.log("Friend request accepted", { recipientId, requesterId });
    return res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error("Error accepting friend request:", err.message);
    return res.status(500).json({ message: "Error accepting friend request" });
  }
});

app.get("/friends/cards", authMiddleware, async (req, res) => {
  const { friendEmail } = req.query;
  
  // Log instructions for request usage
  if (!friendEmail) {
    console.log("Error: 'friendEmail' query parameter is required. Example: /friends/cards?friendEmail=example@example.com");
    return res.status(400).json({
      message: "friend email is required. Example: /friends/cards?friendEmail=example@example.com",
    });
  }
  
  try {
    const friend = await User.findOne({ email: friendEmail });
    if (!friend) {
      console.log(`Error: Friend with email ${friendEmail} not found.`);
      return res.status(404).json({
        message: `Friend with email ${friendEmail} not found.`,
      });
    }
    
    const friendId = friend._id.toString();
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId);
    
    if (!currentUser) {
      console.log(`Error: Current user with ID ${currentUserId} not found.`);
      return res.status(404).json({
        message: `Current user with ID ${currentUserId} not found.`,
      });
    }

    console.log("Current user's friends list:", currentUser.friends);
    
    // Check if the friend is in the current user's friends list
    const isFriends = currentUser.friends.some(friendId => friendId.toString() === friendId);

    if (isFriends) {
      console.log("They are friends. If you want to get cards, use the appropriate endpoint.");
      // Respond with success message or friend's cards if necessary
      return res.status(200).json({ message: "They are friends" });
    } else {
      console.log("They are not friends.");
      // Respond with appropriate message or handle the case where they are not friends
      return res.status(200).json({ message: "They are not friends" });
    }
  } catch (err) {
    // Handle any errors that occur during the process
    console.error("Error fetching friend details:", err.message);
    return res.status(500).json({ message: "Error fetching friend details" });
  }
});


app.listen(3000, () => console.log("Server running on port 3000"));
