const zod = require("zod");

const userLoginSchema = zod.object({
  email: zod
    .string()
    .email("Invalid email address"), // Ensure the email is valid
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters long") // Ensure minimum length
    .max(100, "Password must be at most 100 characters long") // Optional: Set an upper limit for password length
    .regex(/[a-zA-Z]/, "Password must contain at least one letter") // Ensure password contains letters
    .regex(/[0-9]/, "Password must contain at least one number"), // Ensure password contains numbers
});

module.exports = userLoginSchema;
