"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader2, ShoppingBag, Store, Upload, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { PhoneInput } from "@/components/ui/phone-input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/queries/useAuth";
import { universities } from "@/data/auth/universities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authService } from "@/lib/api/services/auth.service";
import { userService } from "@/lib/api/services/user.service";

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
	confirm_password: z.string(),
	agree_to_terms: z.boolean().refine((val) => val, {
		message: "You must agree to the terms and conditions",
	}),
}).refine((data) => data.password === data.confirm_password, {
	message: "Passwords don't match",
	path: ["confirm_password"],
}).refine((data) => !data.isStudent || (data.isStudent && data.studentId && data.studentId.length > 0), {
	message: "Student ID is required for students",
	path: ["studentId"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const STEPS = [
	{ id: 1, title: "Account Type", description: "How will you use VarsityMart?" },
	{ id: 2, title: "Personal Info", description: "Tell us about yourself" },
	{ id: 3, title: "University", description: "Where do you study?" },
	{ id: 4, title: "Security", description: "Secure your account" },
];

export default function RegisterForm() {
	const { registerAsync, isRegistering } = useAuth();
	const [currentStep, setCurrentStep] = useState(1);
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
			confirm_password: "",
			agree_to_terms: false,
		},
		mode: "onChange",
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

	const validateStep = async (step: number): Promise<boolean> => {
		let fieldsToValidate: (keyof RegisterFormValues)[] = [];

		switch (step) {
			case 1:
				fieldsToValidate = ["role"];
				break;
			case 2:
				fieldsToValidate = ["firstName", "lastName", "email", "phone"];
				break;
			case 3:
				fieldsToValidate = isStudent
					? ["university", "campus", "studentId"]
					: ["university", "campus"];
				break;
			case 4:
				fieldsToValidate = ["password", "confirm_password", "agree_to_terms"];
				break;
		}

		return form.trigger(fieldsToValidate);
	};

	const nextStep = async () => {
		const isValid = await validateStep(currentStep);
		if (isValid && currentStep < STEPS.length) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const onSubmit = async (data: RegisterFormValues) => {
		setIsLoading(true);
		let registrationSucceeded = false;
		try {
			await registerAsync({
				email: data.email,
				password: data.password,
				firstName: data.firstName,
				lastName: data.lastName,
				agree_to_terms: data.agree_to_terms,
				confirm_password: data.confirm_password,
				phone: data.phone,
				role: data.role,
				university: data.university,
				campus: data.campus,
				studentId: data.isStudent ? data.studentId : undefined,
			});
			registrationSucceeded = true;
		} catch (error) {
			console.error("Registration failed:", error);
		} finally {
			if (registrationSucceeded && data.avatar instanceof File) {
				try {
					await userService.uploadAvatar(data.avatar);
				} catch (uploadError) {
					console.error("Avatar upload failed:", uploadError);
				}
			}
			setIsLoading(false);
		}
	};

	const handleGoogleAuth = () => {
		setIsLoading(true);
		window.location.href = authService.getGoogleAuthUrl();
	};

	return (
		<AuthLayout 
			title={STEPS[currentStep - 1].title} 
			description={STEPS[currentStep - 1].description}
			className="max-w-lg"
		>
			{/* Progress */}
			<div className="flex items-center justify-between mb-6">
				{STEPS.map((step, index) => (
					<div key={step.id} className="flex items-center">
						<div
							className={cn(
								"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
								currentStep >= step.id
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground"
							)}
						>
							{currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
						</div>
						{index < STEPS.length - 1 && (
							<div
								className={cn(
									"w-8 sm:w-12 h-1 mx-1",
									currentStep > step.id ? "bg-primary" : "bg-muted"
								)}
							/>
						)}
					</div>
				))}
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					{/* Step 1: Account Type */}
					{currentStep === 1 && (
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="grid grid-cols-2 gap-3">
												<button
													type="button"
													onClick={() => field.onChange("buyer")}
													className={cn(
														"flex flex-col items-center p-4 rounded-lg border-2 transition-all",
														field.value === "buyer"
															? "border-primary bg-primary/5"
															: "border-border hover:border-primary/50"
													)}
												>
													<ShoppingBag className="h-6 w-6 text-primary mb-2" />
													<span className="font-medium">Buy</span>
													<span className="text-xs text-muted-foreground">Shop on campus</span>
												</button>

												<button
													type="button"
													onClick={() => field.onChange("seller")}
													className={cn(
														"flex flex-col items-center p-4 rounded-lg border-2 transition-all",
														field.value === "seller"
															? "border-primary bg-primary/5"
															: "border-border hover:border-primary/50"
													)}
												>
													<Store className="h-6 w-6 text-primary mb-2" />
													<span className="font-medium">Sell</span>
													<span className="text-xs text-muted-foreground">Start selling</span>
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t border-border" />
								</div>
								<div className="relative flex justify-center text-xs">
									<span className="bg-card px-2 text-muted-foreground">or</span>
								</div>
							</div>

							<Button
								type="button"
								variant="outline"
								className="w-full"
								onClick={handleGoogleAuth}
								disabled={isLoading}
							>
								<svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
									<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
									<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
									<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
									<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
								</svg>
								Continue with Google
							</Button>
						</div>
					)}

					{/* Step 2: Personal Info */}
					{currentStep === 2 && (
						<div className="space-y-4">
							<div className="flex justify-center">
								<div className="relative">
									<Avatar className="h-20 w-20">
										<AvatarImage src={avatarPreview || undefined} alt="Profile" />
										<AvatarFallback className="bg-muted">
											<User className="h-8 w-8 text-muted-foreground" />
										</AvatarFallback>
									</Avatar>
									<Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
										<div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
											<Upload className="h-3 w-3" />
										</div>
										<Input
											id="avatar-upload"
											type="file"
											accept="image/*"
											className="hidden"
											disabled={isLoading || isRegistering}
											onChange={handleAvatarChange}
										/>
									</Label>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First name</FormLabel>
											<FormControl>
												<Input placeholder="John" autoComplete="given-name" disabled={isLoading || isRegistering} {...field} />
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
												<Input placeholder="Doe" autoComplete="family-name" disabled={isLoading || isRegistering} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" placeholder="you@university.edu" autoComplete="email" disabled={isLoading || isRegistering} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone number</FormLabel>
										<FormControl>
											<PhoneInput
												placeholder="Enter your phone number"
												autoComplete="tel"
												defaultCountry="GH"
												international
												disabled={isLoading || isRegistering}
												value={field.value || ""}
												onChange={(value) => field.onChange(value || "")}
												name={field.name}
												onBlur={field.onBlur}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}

					{/* Step 3: University */}
					{currentStep === 3 && (
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="isStudent"
								render={({ field }) => (
									<FormItem className="flex items-center justify-between rounded-lg border p-3">
										<FormLabel className="font-normal">I'm a student</FormLabel>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isLoading || isRegistering}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="university"
								render={({ field }) => (
									<FormItem>
										<FormLabel>University</FormLabel>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												form.setValue("campus", "");
											}}
											defaultValue={field.value}
											disabled={isLoading || isRegistering}
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

							{selectedUniversity && availableCampuses.length > 0 && (
								<FormField
									control={form.control}
									name="campus"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Campus</FormLabel>
											<Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading || isRegistering}>
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

							{isStudent && (
								<FormField
									control={form.control}
									name="studentId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Student ID</FormLabel>
											<FormControl>
												<Input placeholder="e.g. PS/CSC/20/0001" disabled={isLoading || isRegistering} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>
					)}

					{/* Step 4: Security */}
					{currentStep === 4 && (
						<div className="space-y-4">
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
													disabled={isLoading || isRegistering}
													className="pr-10"
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
										<FormDescription className="text-xs">Minimum 8 characters</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirm_password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showConfirmPassword ? "text" : "password"}
													placeholder="••••••••"
													autoComplete="new-password"
													disabled={isLoading || isRegistering}
													className="pr-10"
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

							<FormField
								control={form.control}
								name="agree_to_terms"
								render={({ field }) => (
									<FormItem className="flex items-start gap-2">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isLoading || isRegistering}
												className="mt-0.5"
											/>
										</FormControl>
										<FormLabel className="text-sm font-normal leading-snug">
											I agree to the{" "}
											<Link href="/terms" className="text-primary hover:underline">Terms</Link>{" "}
											and{" "}
											<Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
										</FormLabel>
									</FormItem>
								)}
							/>
						</div>
					)}

					{/* Navigation */}
					<div className="flex gap-3 pt-2">
						{currentStep > 1 && (
							<Button
								type="button"
								variant="outline"
								onClick={prevStep}
								disabled={isLoading || isRegistering}
								className="flex-1"
							>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back
							</Button>
						)}

						{currentStep < STEPS.length ? (
							<Button
								type="button"
								onClick={nextStep}
								disabled={isLoading || isRegistering}
								className="flex-1"
							>
								Continue
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						) : (
							<Button
								type="submit"
								disabled={isLoading || isRegistering}
								className="flex-1"
							>
								{(isLoading || isRegistering) ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating account...
									</>
								) : (
									"Create account"
								)}
							</Button>
						)}
					</div>
				</form>
			</Form>

			<p className="mt-4 text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link href="/auth/login" className="text-primary hover:underline">
					Sign in
				</Link>
			</p>
		</AuthLayout>
	);
}
