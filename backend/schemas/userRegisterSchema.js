const zod = require("zod");

const userSchema = zod.object({
  name: zod.string()
    .min(1, "Name is required") // Ensure the name field is not empty
    .max(100, "Name must be at most 100 characters long"), // Optional: Set a maximum length for the name
  email: zod.string()
    .email("Invalid email address"), // Ensure the email is valid
  password: zod.string()
    .min(6, "Password must be at least 6 characters long") // Ensure minimum length
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((value) => /[0-9]/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => /[!@#$%&*]/.test(value), {
      message: "Password must contain at least one special character (e.g., @, &, $, !, %)",
    })
    .max(100, "Password must be at most 100 characters long"), // Optional: Set a maximum length for the password
});

module.exports = userSchema;
