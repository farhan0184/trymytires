import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password cannot exceed 50 characters"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  // ),
});



export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(50, "Password cannot exceed 50 characters"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  // ),
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
});
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(50, "Password cannot exceed 50 characters"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  // ),
  confirm_password: z
    .string()
    .min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});



export const updatePasswordSchema = z.object({
  old_password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(50, "Password cannot exceed 50 characters"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(50, "Password cannot exceed 50 characters"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  // ),
  confirm_password: z
    .string()
    .min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters")
    .max(100, "Subject cannot exceed 100 characters"),
  message: z.string()
    .min(2, "Message must be at least 2 characters")
    .max(500, "Message cannot exceed 500 characters")
})