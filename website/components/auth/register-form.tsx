"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Upload, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { universities } from "@/data/auth/universities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const registerSchema = z.object({
	firstName: z.string().min(2, "First name is required"),
	lastName: z.string().min(2, "Last name is required"),
	avatar: z.any().optional(),
	email: z.string().email("Please enter a valid email"),
	phone: z.string().min(10, "Please enter a valid phone number"),
	role: z.enum(["buyer", "seller"], {
		required_error: "Please select how you want to use VarsityMart",
	}),
	isStudent: z.boolean().default(true),
	studentId: z.string().optional(),
	university: z.string().min(1, "Please select your university"),
	campus: z.string().min(1, "Please select your campus"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	confirmPassword: z.string(),
	agreeToTerms: z.boolean().refine((val) => val, {
		message: "You must agree to the terms and conditions",
	}),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
}).refine((data) => !data.isStudent || (data.isStudent && data.studentId && data.studentId.length > 0), {
	message: "Student ID is required for students",
	path: ["studentId"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
	const router = useRouter();
	const { setIsAuthenticated } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			avatar: undefined,
			email: "",
			phone: "",
			role: "buyer",
			isStudent: true,
			studentId: "",
			university: "",
			campus: "",
			password: "",
			confirmPassword: "",
			agreeToTerms: false,
		},
	});

	const isStudent = form.watch("isStudent");
	const selectedUniversity = form.watch("university");
	const availableCampuses = selectedUniversity ? universities[selectedUniversity] || [] : [];

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
			form.setValue("avatar", file);
		}
	};

	const onSubmit = async (data: RegisterFormValues) => {
		setIsLoading(true);
		try {
			// Simulate API call
			console.log("Registration data:", data);
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setIsAuthenticated(true);
			router.push("/account");
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleAuth = async () => {
		setIsLoading(true);
		try {
			// Simulate Google OAuth - would redirect to complete profile
			await new Promise((resolve) => setTimeout(resolve, 1000));
			// In real app, redirect to complete profile page after Google auth
			router.push("/auth/complete-profile");
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout
			title="Create account"
			description="Join VarsityMart and start buying or selling on campus"
			className="max-w-lg"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
					{/* Google Sign Up */}
					<Button
						type="button"
						variant="outline"
						className="w-full h-11 font-medium"
						onClick={handleGoogleAuth}
						disabled={isLoading}
					>
						<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
							<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
							<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
							<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
						</svg>
						Continue with Google
					</Button>

					{/* Divider */}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-card px-2 text-muted-foreground">or register with email</span>
						</div>
					</div>

					{/* Name fields */}
					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First name</FormLabel>
									<FormControl>
										<Input placeholder="John" autoComplete="given-name" disabled={isLoading} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last name</FormLabel>
									<FormControl>
										<Input placeholder="Doe" autoComplete="family-name" disabled={isLoading} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Profile Picture */}
					<FormField
						control={form.control}
						name="avatar"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Profile Picture (Optional)</FormLabel>
								<FormControl>
									<div className="flex items-center gap-4">
										<Avatar className="h-20 w-20 border-2 border-border">
											<AvatarImage src={avatarPreview || undefined} alt="Profile preview" />
											<AvatarFallback className="bg-muted">
												<User className="h-10 w-10 text-muted-foreground" />
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<Label htmlFor="avatar-upload" className="cursor-pointer">
												<div className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors">
													<Upload className="h-4 w-4" />
													<span className="text-sm">Upload Photo</span>
												</div>
												<Input
													id="avatar-upload"
													type="file"
													accept="image/*"
													className="hidden"
													disabled={isLoading}
													onChange={handleAvatarChange}
												/>
											</Label>
											<p className="text-xs text-muted-foreground mt-2">
												JPG, PNG or GIF (max. 5MB)
											</p>
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Email */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="you@university.edu" autoComplete="email" disabled={isLoading} {...field} />
								</FormControl>
								<FormDescription className="text-xs">Use your university email for faster verification</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Phone */}
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone number</FormLabel>
								<FormControl>
									<Input type="tel" placeholder="+233 XX XXX XXXX" autoComplete="tel" disabled={isLoading} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Role Selection */}
					<FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<FormItem>
								<FormLabel>I want to</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className="grid grid-cols-2 gap-3"
										disabled={isLoading}
									>
										<div>
											<RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
											<Label
												htmlFor="buyer"
												className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
											>
												<span className="text-sm font-medium">Buy</span>
												<span className="text-xs text-muted-foreground">Shop on campus</span>
											</Label>
										</div>
										<div>
											<RadioGroupItem value="seller" id="seller" className="peer sr-only" />
											<Label
												htmlFor="seller"
												className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
											>
												<span className="text-sm font-medium">Sell</span>
												<span className="text-xs text-muted-foreground">Start selling</span>
											</Label>
										</div>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Student Toggle */}
					<FormField
						control={form.control}
						name="isStudent"
						render={({ field }) => (
							<FormItem className="flex items-center justify-between rounded-lg border p-3">
								<div className="space-y-0.5">
									<FormLabel className="text-sm font-medium">I'm a student</FormLabel>
									<FormDescription className="text-xs">Student accounts get verified faster</FormDescription>
								</div>
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isLoading}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					{/* Student ID - Only shown if isStudent */}
					{isStudent && (
						<FormField
							control={form.control}
							name="studentId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Student ID</FormLabel>
									<FormControl>
										<Input placeholder="e.g. PS/CSC/20/0001" disabled={isLoading} {...field} />
									</FormControl>
									<FormDescription className="text-xs">Required for KYC verification</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					{/* University */}
					<FormField
						control={form.control}
						name="university"
						render={({ field }) => (
							<FormItem>
								<FormLabel>University</FormLabel>
								<Select
									onValueChange={(value) => {
										field.onChange(value);
										form.setValue("campus", ""); // Reset campus when university changes
									}}
									defaultValue={field.value}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select your university" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.keys(universities).map((uni) => (
											<SelectItem key={uni} value={uni}>
												{uni}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Campus - Only shown if university is selected */}
					{selectedUniversity && availableCampuses.length > 0 && (
						<FormField
							control={form.control}
							name="campus"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Campus</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select your campus" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{availableCampuses.map((campus) => (
												<SelectItem key={campus} value={campus}>
													{campus}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					{/* Password */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											autoComplete="new-password"
											disabled={isLoading}
											{...field}
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
										>
											{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Confirm Password */}
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm password</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											type={showConfirmPassword ? "text" : "password"}
											placeholder="••••••••"
											autoComplete="new-password"
											disabled={isLoading}
											{...field}
										/>
										<button
											type="button"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
										>
											{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Terms */}
					<FormField
						control={form.control}
						name="agreeToTerms"
						render={({ field }) => (
							<FormItem className="flex items-start gap-2">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isLoading}
										className="mt-0.5"
									/>
								</FormControl>
								<FormLabel className="text-sm font-normal cursor-pointer leading-snug">
									I agree to the{" "}
									<Link href="/help/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
									and{" "}
									<Link href="/help/privacy" className="text-primary hover:underline">Privacy Policy</Link>
								</FormLabel>
							</FormItem>
						)}
					/>

					{/* Submit */}
					<Button type="submit" className="w-full h-11" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating account...
							</>
						) : (
							"Create account"
						)}
					</Button>
				</form>
			</Form>

			{/* Sign in link */}
			<p className="mt-6 text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link href="/auth/login" className="text-primary font-medium hover:underline">
					Sign in
				</Link>
			</p>
		</AuthLayout>
	);
}
