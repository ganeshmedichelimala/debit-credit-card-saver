const mongoose = require("mongoose");
const Card = require("./cardModel");
const { Schema } = mongoose;

// Define the schema for user
const userSchema = new mongoose.Schema(
  {
    // User's name
    name: {
      type: String,
      required: true,
    },

    // User's email (must be unique)
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // User's password
    password: {
      type: String,
      required: true,
    },

    // List of friends (references to other users)
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { collection: "users" }
); // Specify the collection name

// Middleware to handle actions before a user is removed
userSchema.pre("remove", async function (next) {
  try {
    // Remove related cards when the user is deleted
    await Card.deleteMany({ user: this._id });
    next();
  } catch (err) {
    // Pass error to the next middleware or handler
    next(err);
  }
});

// Create and export the User model based on the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
