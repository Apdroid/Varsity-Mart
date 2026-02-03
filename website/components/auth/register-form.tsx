"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader2, ShoppingBag, Store, Upload, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { authService } from "@/lib/api/services/auth.service";

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

const STEPS = [
	{ id: 1, title: "Account Type", description: "How will you use VarsityMart?" },
	{ id: 2, title: "Personal Info", description: "Tell us about yourself" },
	{ id: 3, title: "University", description: "Where do you study?" },
	{ id: 4, title: "Security", description: "Secure your account" },
];

export default function RegisterForm() {
	const router = useRouter();
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
			confirmPassword: "",
			agreeToTerms: false,
		},
		mode: "onChange",
	});

	const isStudent = form.watch("isStudent");
	const selectedUniversity = form.watch("university");
	const selectedRole = form.watch("role");
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

	// Validate current step before proceeding
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
				fieldsToValidate = ["password", "confirmPassword", "agreeToTerms"];
				break;
		}
		
		const result = await form.trigger(fieldsToValidate);
		return result;
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
		try {
			const response = await registerAsync({
				email: data.email,
				password: data.password,
				fullName: `${data.firstName} ${data.lastName}`,
				phone: data.phone,
				role: data.role,
				university: data.university,
				campus: data.campus,
				studentId: data.isStudent ? data.studentId : undefined,
			});

			if (response.success && data.avatar instanceof File) {
				try {
					const { userService } = await import("@/lib/api/services/user.service");
					await userService.uploadAvatar(data.avatar);
				} catch (uploadError) {
					console.error("Avatar upload failed:", uploadError);
				}
			}
		} catch (error) {
			console.error("Registration failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleAuth = () => {
		setIsLoading(true);
		// Redirect to backend Google OAuth endpoint
		window.location.href = authService.getGoogleAuthUrl();
	};

	return (
		<div className="min-h-screen flex">
			{/* Left Side - Image/Branding */}
			<div className="hidden lg:flex lg:w-1/2 bg-primary/5 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
				<div className="relative z-10 flex flex-col justify-between p-12 w-full">
					{/* Logo */}
					<Link href="/" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors w-fit">
						<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
							<ShoppingBag className="h-5 w-5" />
						</div>
						<span className="font-bold text-xl">VarsityMart</span>
					</Link>

					{/* Center Content */}
					<div className="space-y-6">
						<div className="space-y-4">
							<h2 className="text-4xl font-bold text-foreground">
								{selectedRole === "seller" ? "Start Selling Today" : "Shop Smart on Campus"}
							</h2>
							<p className="text-lg text-muted-foreground max-w-md">
								{selectedRole === "seller" 
									? "Turn your items into cash. Join thousands of student sellers on VarsityMart."
									: "Discover amazing deals from fellow students. Buy and sell with confidence."
								}
							</p>
						</div>

						{/* Features */}
						<div className="space-y-3">
							{(selectedRole === "seller" ? [
								"Zero listing fees for students",
								"Instant campus-wide reach",
								"Secure payments guaranteed",
							] : [
								"Verified student sellers",
								"Campus-exclusive deals",
								"Safe meetup locations",
							]).map((feature, i) => (
								<div key={i} className="flex items-center gap-3">
									<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary">
										<Check className="h-4 w-4" />
									</div>
									<span className="text-foreground">{feature}</span>
								</div>
							))}
						</div>
					</div>

					{/* Bottom Quote */}
					<div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
						<p className="text-foreground italic">
							"VarsityMart made it so easy to sell my textbooks. Made over $200 in my first week!"
						</p>
						<div className="mt-4 flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
								<User className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="font-medium text-sm">Sarah K.</p>
								<p className="text-xs text-muted-foreground">University of Ghana</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="flex-1 flex flex-col min-h-screen">
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
							</div>
						</div>

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
								{/* Step 1: Account Type */}
								{currentStep === 1 && (
									<div className="space-y-6">
										<FormField
											control={form.control}
											name="role"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<div className="grid grid-cols-2 gap-4">
															<button
																type="button"
																onClick={() => field.onChange("buyer")}
																className={cn(
																	"relative flex flex-col items-center p-6 rounded-xl border-2 transition-all hover:border-primary/50",
																	field.value === "buyer"
																		? "border-primary bg-primary/5"
																		: "border-muted bg-card"
																)}
															>
																{field.value === "buyer" && (
																	<div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
																		<Check className="h-3 w-3 text-primary-foreground" />
																	</div>
																)}
																<div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
																	<ShoppingBag className="h-7 w-7 text-primary" />
																</div>
																<span className="font-semibold">Buy</span>
																<span className="text-xs text-muted-foreground mt-1">Shop on campus</span>
															</button>

															<button
																type="button"
																onClick={() => field.onChange("seller")}
																className={cn(
																	"relative flex flex-col items-center p-6 rounded-xl border-2 transition-all hover:border-primary/50",
																	field.value === "seller"
																		? "border-primary bg-primary/5"
																		: "border-muted bg-card"
																)}
															>
																{field.value === "seller" && (
																	<div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
																		<Check className="h-3 w-3 text-primary-foreground" />
																	</div>
																)}
																<div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
																	<Store className="h-7 w-7 text-primary" />
																</div>
																<span className="font-semibold">Sell</span>
																<span className="text-xs text-muted-foreground mt-1">Start selling</span>
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
											<div className="relative flex justify-center text-xs uppercase">
												<span className="bg-background px-2 text-muted-foreground">or continue with</span>
											</div>
										</div>

										<Button
											type="button"
											variant="outline"
											className="w-full h-11"
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
									</div>
								)}

								{/* Step 2: Personal Info */}
								{currentStep === 2 && (
									<div className="space-y-4">
										{/* Avatar Upload */}
										<div className="flex justify-center mb-2">
											<div className="relative">
												<Avatar className="h-24 w-24 border-4 border-background shadow-lg">
													<AvatarImage src={avatarPreview || undefined} alt="Profile preview" />
													<AvatarFallback className="bg-primary/10">
														<User className="h-10 w-10 text-primary" />
													</AvatarFallback>
												</Avatar>
												<Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
													<div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
														<Upload className="h-4 w-4" />
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
										<p className="text-xs text-center text-muted-foreground mb-4">Upload a profile photo (optional)</p>

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
													<FormDescription className="text-xs">Use your university email for faster verification</FormDescription>
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
														<Input type="tel" placeholder="+233 XX XXX XXXX" autoComplete="tel" disabled={isLoading || isRegistering} {...field} />
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
												<FormItem className="flex items-center justify-between rounded-xl border-2 border-muted p-4 hover:border-primary/50 transition-colors">
													<div className="space-y-0.5">
														<FormLabel className="text-base font-medium">I'm a student</FormLabel>
														<FormDescription className="text-xs">Student accounts get verified faster</FormDescription>
													</div>
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
															disabled={isLoading || isRegistering}
															className="h-6 w-6 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
															<SelectTrigger className="h-11">
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
																<SelectTrigger className="h-11">
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
														<FormDescription className="text-xs">Required for KYC verification</FormDescription>
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
											name="agreeToTerms"
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
											className="flex-1 h-11"
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
											className="flex-1 h-11"
										>
											Continue
											<ArrowRight className="h-4 w-4 ml-2" />
										</Button>
									) : (
										<Button
											type="submit"
											disabled={isLoading || isRegistering}
											className="flex-1 h-11"
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

						{/* Sign in link */}
						<p className="mt-6 text-center text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link href="/auth/login" className="text-primary font-medium hover:underline">
								Sign in
							</Link>
						</p>
					</div>
				</div>

				{/* Footer */}
				<footer className="p-4 text-center border-t border-border lg:border-0">
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} VarsityMart. All rights reserved.
					</p>
				</footer>
			</div>
		</div>
	);
}
