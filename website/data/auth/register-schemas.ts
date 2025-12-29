import * as z from "zod";

// Step schemas
export const step1Schema = z.object({
	auth_method: z.enum(["google", "credentials"]),
});

export const step2Schema = z.object({
	fullName: z.string().min(2, "Full name must be at least 2 characters"),
});

export const step3Schema = z.object({
	email: z.string().email("Invalid email address"),
});

export const step4Schema = z.object({
	phone: z
		.string()
		.regex(/^\+233\d{9}$/, "Phone must be in format +233XXXXXXXXX"),
});

export const step5Schema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const step6Schema = z.object({
	isStudent: z.boolean(),
});

export const step7Schema = z.object({
	studentId: z.string().min(1, "Student ID is required"),
});

export const step8Schema = z.object({
	university: z.string().min(1, "Please select a university"),
});

export const step9Schema = z.object({
	campus: z.string().min(1, "Please select a campus"),
});

export const step10Schema = z.object({
	agreeToTerms: z.boolean().refine((val) => val === true, {
		message: "You must agree to the terms",
	}),
});

// Full form schema
export const fullFormSchema = z.object({
	fullName: z.string().min(2, "Full name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	phone: z
		.string()
		.regex(/^\+233\d{9}$/, "Phone must be in format +233XXXXXXXXX"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.optional(),
	confirmPassword: z.string().optional(),
	studentId: z.string().optional(),
	isStudent: z.boolean(),
	university: z.string().min(1, "Please select a university"),
	campus: z.string().min(1, "Please select a campus"),
	agreeToTerms: z.boolean(),
	role: z.string().default("buyer"),
	auth_method: z.enum(["google", "credentials"]),
	profile_pic: z.string().optional(),
});

