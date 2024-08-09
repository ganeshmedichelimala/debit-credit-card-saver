const mongoose = require("mongoose");
const {Schema} = mongoose

// Define the Mongoose schema for cards
const cardSchema = mongoose.Schema(
  {
    cardNumber: { type: String, required: true, unique: true },
    cardHolderName: { type: String, required: true },
    expiryDate: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  },
  { collection: "cards" }
); // Specify the collection name

// Create the model from the schema
const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
