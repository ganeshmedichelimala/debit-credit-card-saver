const User = require("../models/userModel"); // Assuming you need to check user existence
const cardSchema = require("../schemas/cardSchema");
const Card = require("../models/cardModel");

// Get all cars for a user
exports.getCars = async (req, res) => {
  const userId = req.user.id; // Retrieve user ID from request

  try {
    // Find all cards belonging to the user
    const cards = await Card.find({ user: userId });

    // Check if no cards were found
    if (cards.length === 0) {
      console.log("No cards found for the user", { userId });
      return res.status(404).json({ message: "No cards found for the user" });
    }

    // Return the list of cards
    return res.status(200).json(cards);
  } catch (err) {
    // Log and handle errors during card retrieval
    console.error("Error retrieving cards:", err.message);
    return res.status(500).json({ message: "Error retrieving cards" });
  }
};

// Add a new card

exports.postCar = async (req, res) => {
  const { cardNumber, cardHolderName, expiryDate, bankName, cardLimit } =
    req.body;
  const userId = req.user.id;

  try {
    // Validate the card data using Zod
    const cardData = {
      cardNumber,
      cardHolderName,
      expiryDate,
      bankName,
      cardLimit,
      user: userId,
    };
    const parsedCardData = cardSchema.safeParse(cardData);

    if (!parsedCardData.success) {
      console.log(
        "Validation failed for card data",
        parsedCardData.error.errors
      );
      return res.status(400).json({
        message: "Invalid card data",
        errors: parsedCardData.error.errors,
      });
    }

    // Proceed with saving the card data
    const card = new Card(cardData);
    await card.save();

    console.log("Card details saved successfully", card);
    return res
      .status(201)
      .json({
        cardNumber,
        cardHolderName,
        expiryDate,
        bankName,
        cardLimit,
        userId,
      });
  } catch (err) {
    console.error("Error saving card:", err.message);
    return res.status(500).json({ message: "Error saving card" });
  }
};
