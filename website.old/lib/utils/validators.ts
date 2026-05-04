import { z } from "zod"

// Auth validators
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  phone: z.string().optional(),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Product validators
export const createProductSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description is too long"),
  price: z.number().positive("Price must be greater than 0"),
  compareAtPrice: z.number().positive().optional(),
  categoryId: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  condition: z.enum(["new", "like-new", "good", "fair"]),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  images: z.array(z.string()).min(1, "At least one image is required").max(5, "Maximum 5 images allowed"),
  tags: z.array(z.string()).optional(),
})

// Address validator
export const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().default("Nigeria"),
  postalCode: z.string().optional(),
  isDefault: z.boolean().default(false),
})

// Order validators
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, "At least one item is required"),
  deliveryAddressId: z.string().min(1, "Delivery address is required"),
  paymentMethodId: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
})

// Store validators
export const createStoreSchema = z.object({
  name: z.string().min(3, "Store name must be at least 3 characters").max(50, "Store name is too long"),
  description: z.string().min(20, "Description must be at least 20 characters").max(500, "Description is too long"),
  logo: z.string().optional(),
  banner: z.string().optional(),
})

// KYC validators
export const studentKYCSchema = z.object({
  studentId: z.string().min(5, "Student ID is required"),
  university: z.string().min(3, "University name is required"),
  documents: z
    .array(
      z.object({
        type: z.string(),
        url: z.string().url(),
      }),
    )
    .min(1, "At least one document is required"),
})

export const businessKYCSchema = z.object({
  businessName: z.string().min(3, "Business name is required"),
  registrationNumber: z.string().min(5, "Registration number is required"),
  documents: z
    .array(
      z.object({
        type: z.string(),
        url: z.string().url(),
      }),
    )
    .min(1, "At least one document is required"),
})

// Types from schemas
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type CreateProductFormData = z.infer<typeof createProductSchema>
export type AddressFormData = z.infer<typeof addressSchema>
export type CreateOrderFormData = z.infer<typeof createOrderSchema>
export type CreateStoreFormData = z.infer<typeof createStoreSchema>
