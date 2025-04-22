import { z } from "zod";

const PasswordErrorMessage =
  "Password must contain at least one lowercase letter, an uppercase letter, and a number";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export const registerSchema = loginSchema.extend({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, {
      message: PasswordErrorMessage,
    })
    .regex(/[A-Z]/, {
      message: PasswordErrorMessage,
    })
    .regex(/\d/, {
      message: PasswordErrorMessage,
    }),
});
