const Card = require("../models/cardModel");

// Get all cars
exports.getCars = async (req, res) => {
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
};

// Add a new car
exports.postCar = async (req, res) => {
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
};
