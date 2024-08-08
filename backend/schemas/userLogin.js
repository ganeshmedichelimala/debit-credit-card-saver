const zod = require('zod')

const userLoginSchema = zod.object({
  email : zod.string().email(),
  password : zod.string().min(6, "Password ust be at least 6 characters long")
})
module.exports = userLoginSchema