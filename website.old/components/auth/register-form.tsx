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
	const [registerError, setRegisterError] = useState<string | null>(null);

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
		setRegisterError(null);
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
		} catch (error: any) {
			setRegisterError(error?.response?.data?.message || "Registration failed. Please try again.");
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
		<div className="min-h-screen flex">
			{/* Left Side - Illustration Panel */}
			<div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
				{/* Decorative background pattern */}
				<div className="absolute inset-0 opacity-30">
					<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<pattern id="grid-register" width="40" height="40" patternUnits="userSpaceOnUse">
								<circle cx="20" cy="20" r="1" className="fill-primary/20" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid-register)" />
					</svg>
				</div>

				<div className="relative z-10 flex flex-col justify-between p-8 xl:p-12 w-full">
					{/* Logo */}
					<Link href="/" className="inline-flex items-center gap-2.5 text-foreground hover:text-primary transition-colors w-fit group">
						<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
							<ShoppingBag className="h-5 w-5" />
						</div>
						<span className="font-bold text-xl tracking-tight">VarsityMart</span>
					</Link>

					{/* Center - Illustration & Content */}
					<div className="flex-1 flex flex-col items-center justify-center py-8">
						{/* Registration Celebration Illustration */}
						<svg viewBox="0 0 500 400" className="w-full max-w-md" fill="none" xmlns="http://www.w3.org/2000/svg">
							{/* Background Elements */}
							<circle cx="250" cy="200" r="150" className="fill-primary/10" />
							<circle cx="380" cy="80" r="40" className="fill-primary/5" />
							<circle cx="100" cy="320" r="30" className="fill-primary/5" />
							
							{/* Floating Books */}
							<g className="animate-pulse" style={{ animationDuration: "3s" }}>
								<rect x="60" y="100" width="50" height="65" rx="3" className="fill-primary/20" />
								<rect x="63" y="103" width="44" height="4" rx="1" className="fill-primary/40" />
								<rect x="63" y="112" width="35" height="3" rx="1" className="fill-primary/30" />
							</g>
							
							{/* Student Figure - Celebrating */}
							<g>
								{/* Body */}
								<path d="M250 280 L250 340" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
								{/* Arms Up - Celebrating */}
								<path d="M250 300 L210 260" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
								<path d="M250 300 L290 260" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
								{/* Legs */}
								<path d="M250 340 L230 380" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
								<path d="M250 340 L270 380" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
								{/* Head */}
								<circle cx="250" cy="255" r="28" className="fill-primary/20 stroke-foreground" strokeWidth="3" />
								{/* Happy Face */}
								<circle cx="240" cy="252" r="3" className="fill-foreground" />
								<circle cx="260" cy="252" r="3" className="fill-foreground" />
								<path d="M240 265 Q250 275 260 265" className="stroke-foreground" strokeWidth="2" fill="none" strokeLinecap="round" />
								{/* Graduation Cap */}
								<path d="M220 240 L250 225 L280 240 L250 255 Z" className="fill-primary" />
								<rect x="248" y="220" width="4" height="15" className="fill-primary" />
								<circle cx="250" cy="218" r="5" className="fill-primary" />
							</g>
							
							{/* Shopping Bag */}
							<g transform="translate(330, 280)">
								<rect x="0" y="15" width="45" height="50" rx="5" className="fill-primary/80" />
								<path d="M10 15 L10 5 Q22.5 -5 35 5 L35 15" className="stroke-primary-foreground" strokeWidth="3" fill="none" />
								<circle cx="22.5" cy="40" r="8" className="fill-primary-foreground/30" />
							</g>
							
							{/* Confetti */}
							<rect x="180" y="200" width="8" height="8" rx="1" className="fill-primary animate-bounce" style={{ animationDelay: "0s" }} />
							<rect x="300" y="180" width="6" height="6" rx="1" className="fill-primary/60 animate-bounce" style={{ animationDelay: "0.2s" }} />
							<rect x="220" y="170" width="7" height="7" rx="1" className="fill-primary/80 animate-bounce" style={{ animationDelay: "0.4s" }} />
							<circle cx="350" cy="220" r="4" className="fill-primary/50 animate-bounce" style={{ animationDelay: "0.3s" }} />
							<circle cx="160" cy="230" r="5" className="fill-primary/70 animate-bounce" style={{ animationDelay: "0.5s" }} />
						</svg>
						
						<div className="mt-8 text-center max-w-md">
							<h2 className="text-2xl xl:text-3xl font-bold text-foreground mb-3">
								{selectedRole === "seller" ? "Start Selling Today" : "Join the Campus Community"}
							</h2>
							<p className="text-muted-foreground">
								{selectedRole === "seller"
									? "Turn your items into cash. Join thousands of student sellers."
									: "Create your account and start buying, selling, and connecting with students."
								}
							</p>
						</div>

						{/* Feature list */}
						<div className="mt-8 space-y-3">
							{(selectedRole === "seller" ? [
								"Zero listing fees for students",
								"Instant campus-wide reach",
								"Secure payments guaranteed",
							] : [
								"Buy & sell textbooks and more",
								"Connect directly with campus sellers",
								"Exclusive student deals and offers",
							]).map((feature) => (
								<div key={feature} className="flex items-center gap-3 text-sm">
									<div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary">
										<Check className="w-3 h-3" />
									</div>
									<span className="text-foreground">{feature}</span>
								</div>
							))}
						</div>
					</div>

					{/* Bottom - Stats */}
					<div className="flex items-center justify-center gap-8 text-center">
						<div>
							<p className="text-2xl font-bold text-primary">10K+</p>
							<p className="text-xs text-muted-foreground">Active Students</p>
						</div>
						<div className="w-px h-8 bg-border" />
						<div>
							<p className="text-2xl font-bold text-primary">50+</p>
							<p className="text-xs text-muted-foreground">Universities</p>
						</div>
						<div className="w-px h-8 bg-border" />
						<div>
							<p className="text-2xl font-bold text-primary">100K+</p>
							<p className="text-xs text-muted-foreground">Items Traded</p>
						</div>
					</div>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="flex-1 flex flex-col min-h-screen bg-background">
				{/* Mobile Header */}
				<header className="lg:hidden p-4 border-b border-border">
					<Link href="/" className="inline-flex items-center gap-2 text-foreground">
						<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
							<ShoppingBag className="h-4 w-4" />
						</div>
						<span className="font-bold text-lg">VarsityMart</span>
					</Link>
				</header>

				{/* Form Content */}
				<div className="flex-1 flex items-center justify-center p-6 sm:p-8">
					<div className="w-full max-w-md">
						{/* Progress Indicator */}
						<div className="mb-8">
							<div className="flex items-center justify-between mb-2">
								{STEPS.map((step, index) => (
									<div key={step.id} className="flex items-center">
										<div
											className={cn(
												"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
												currentStep > step.id
													? "bg-primary text-primary-foreground"
													: currentStep === step.id
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground"
											)}
										>
											{currentStep > step.id ? (
												<Check className="h-4 w-4" />
											) : (
												step.id
											)}
										</div>
										{index < STEPS.length - 1 && (
											<div
												className={cn(
													"w-12 sm:w-16 h-1 mx-1",
													currentStep > step.id ? "bg-primary" : "bg-muted"
												)}
											/>
										)}
									</div>
								))}
							</div>
							<div className="text-center mt-4">
								<h1 className="text-xl font-semibold">{STEPS[currentStep - 1].title}</h1>
								<p className="text-sm text-muted-foreground">{STEPS[currentStep - 1].description}</p>
								<p className="text-xs text-primary/90 mt-1">{STEP_ENCOURAGEMENT[currentStep]}</p>
							</div>
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

								{/* Step 4: Security */}
								{currentStep === 4 && (
									<div className="space-y-4">
										{registerError && (
											<div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg">
												{registerError}
											</div>
										)}

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
																className="h-11 pr-10"
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
																className="h-11 pr-10"
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
												<FormItem className="flex items-start gap-3 rounded-xl border-2 border-muted p-4">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
															disabled={isLoading || isRegistering}
															className="mt-0.5 h-5 w-5 rounded border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
														/>
													</FormControl>
													<FormLabel className="text-sm font-normal cursor-pointer leading-snug">
														I agree to the{" "}
														<Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
														and{" "}
														<Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
													</FormLabel>
												</FormItem>
											)}
										/>
										<p className="text-xs text-center text-primary/90">You&apos;re at the finish line - create your account to start exploring campus deals.</p>
									</div>
								)}

								{/* Navigation Buttons */}
								<div className="flex gap-3 pt-4">
									{currentStep > 1 && (
										<Button
											type="button"
											variant="outline"
											onClick={prevStep}
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
