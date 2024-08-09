const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Mongoose schema for cards
const cardSchema = new Schema(
  {
    BankName: {
      type: String,
      required: true,
      trim: true, // Ensure no extra whitespace
    },
    cardNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Ensure no extra whitespace
    },
    cardHolderName: {
      type: String,
      required: true,
      trim: true, // Ensure no extra whitespace
    },
    expiryDate: {
      type: String,
      required: true,
      trim: true, // Ensure no extra whitespace
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // Reference to User model
    },
  },
  {
    collection: "cards", // Specify the collection name
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the model from the schema
const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
