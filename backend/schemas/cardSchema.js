const zod = require('zod')


const cardSchema = zod.object({
  cardNumber : zod
                .string()
                .length(16, "Card number must be exactly 16 digits")
                .regex(/^{16}$/, "card number must only contains digits")
})