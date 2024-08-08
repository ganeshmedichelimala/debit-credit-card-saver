const zod = require("zod");

const userSchema = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one Uppercase letter",
    })
    .refine((value) => /[a-z]/.test(value), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((value) => /[0-9]/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => /[!@#$%&*]/.test(value), {
      message:
        "password must contain at least one special character(e.g., @, &, $, !, %)",
    }),
});


module.exports = userSchema