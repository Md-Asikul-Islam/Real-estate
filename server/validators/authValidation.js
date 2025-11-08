import { z } from "zod";

const userNameRegex = /^(?=.*[A-Za-z])[A-Za-z0-9_ ]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

 const signUpSchema = z.object({
  userName: z
  .string()
  .trim()
  .min(3, "User name must be at least 3 characters long")
  .max(27, "User name cannot exceed 27 characters")
  .regex(userNameRegex, "User name must contain at least one letter and may include numbers or underscores"),
  email: z
  .string()
  .trim()
  .email("Invalid email format"),
  password: z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(passwordRegex, "Password must include uppercase, lowercase, number, and special character"),
});

 const signInSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

 const forgotSchema = z.object({
  email: z.string().trim().email("Invalid email"),
});

 const resetSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 chars")
    .regex(passwordRegex, "Password must include uppercase, lowercase, number & special char"),
});

export {signUpSchema, signInSchema,forgotSchema,resetSchema}