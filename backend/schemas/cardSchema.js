const zod = require('zod')


const cardSchema = zod.object({
  cardNumber : zod
                .string()
                .length(16, "Card number must be exactly 16 digits")
                .regex(/^{16}$/, "card number must only contains digits"),
  cardHolderName : zod
                .string()
                .min(1, "CardHolder name is required")
                .max(100, "Card Holder name is long"),
  expiryDate : zod
                .string()
                .regex(/^(0[0-9]|1[0-2]\/[0-9]{2}$)/, "Expiry date must be in MM/YY fromat")
})




module.exports = cardSchema