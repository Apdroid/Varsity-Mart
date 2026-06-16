import { z } from "zod"

export const emailSchema = z.email("Enter a valid email address.")
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid phone number.")

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
})

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  universityId: z.string().min(1, "Select your institution."),
  campusId: z.string().min(1, "Select your campus."),
  agreeToTerms: z
    .boolean()
    .refine((v) => v, { message: "You must agree to the terms and privacy policy." }),
  authMethod: z.literal("credentials"),
  profilePic: z.string(),
})

export const forgotSchema = z.object({
  email: emailSchema,
})

export const resetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type ForgotSchema = z.infer<typeof forgotSchema>
export type ResetSchema = z.infer<typeof resetSchema>
