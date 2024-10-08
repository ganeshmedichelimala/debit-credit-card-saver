const zod = require("zod");

const cardSchema = zod.object({
  cardNumber: zod
    .string()
    .length(16, "Card number must be exactly 16 digits") // Ensure the card number is exactly 16 digits
    .regex(/^\d{16}$/, "Card number must only contain digits"), // Ensure the card number contains only digits
  cardHolderName: zod
    .string()
    .min(1, "Cardholder name is required") // Ensure the cardholder name is not empty
    .max(100, "Cardholder name is too long"), // Limit the cardholder name length
  expiryDate: zod
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/[0-9]{2}$/,
      "Expiry date must be in MM/YY format"
    ), // Ensure the expiry date is in MM/YY format
  bankName: zod
    .string()
    .min(1, "Bank name is required") // Ensure the bank name is not empty
    .max(50, "Bank name is too long"), // Limit the bank name length
  cardLimit: zod
    .number()
    .positive("Card limit must be a positive number") // Ensure the card limit is positive
    .max(1000000, "Card limit cannot exceed 1,000,000"), // Limit the maximum card limit
  user: zod.string(), // User ID (assuming it's an ObjectId in string format)
});

module.exports = cardSchema;
