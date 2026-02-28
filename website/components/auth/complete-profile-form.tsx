"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Loader2, ShoppingBag, Store, Upload, User } from "lucide-react";
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
import { useAuth } from "@/hooks/queries/useAuth";
import { universities } from "@/data/auth/universities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService } from "@/lib/api/services/user.service";

const completeProfileSchema = z.object({
	phone: z.string().min(10, "Please enter a valid phone number"),
	role: z.enum(["buyer", "seller"], {
		required_error: "Please select how you want to use VarsityMart",
	}),
	isStudent: z.boolean().default(true),
	studentId: z.string().optional(),
	university: z.string().min(1, "Please select your university"),
	campus: z.string().min(1, "Please select your campus"),
	agreeToTerms: z.boolean().refine((val) => val, {
		message: "You must agree to the terms and conditions",
	}),
}).refine((data) => !data.isStudent || (data.isStudent && data.studentId && data.studentId.length > 0), {
	message: "Student ID is required for students",
	path: ["studentId"],
});

type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

const STEPS = [
	{ id: 1, title: "Account Type", description: "How will you use VarsityMart?" },
	{ id: 2, title: "University", description: "Where do you study or work?" },
	{ id: 3, title: "Verification", description: "Complete your KYC" },
];

export default function CompleteProfileForm() {
	const router = useRouter();
	const { user, refetchUser } = useAuth();
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<CompleteProfileFormValues>({
		resolver: zodResolver(completeProfileSchema),
		defaultValues: {
			phone: "",
			role: "buyer",
			isStudent: true,
			studentId: "",
			university: "",
			campus: "",
			agreeToTerms: false,
		},
		mode: "onChange",
	});

	const isStudent = form.watch("isStudent");
	const selectedUniversity = form.watch("university");
	const selectedRole = form.watch("role");
	const availableCampuses = selectedUniversity ? universities[selectedUniversity] || [] : [];

	// Redirect if user hasn't signed in with OAuth
	useEffect(() => {
		// If no user or user already has complete profile, redirect
		if (!user) {
			// Allow access for OAuth flow - user data might be loading
			return;
		}

		// Profile completion check removed - fields not in User model
	}, [user, router]);

	// Validate current step before proceeding
	const validateStep = async (step: number): Promise<boolean> => {
		let fieldsToValidate: (keyof CompleteProfileFormValues)[] = [];

		switch (step) {
			case 1:
				fieldsToValidate = ["role", "phone"];
				break;
			case 2:
				fieldsToValidate = isStudent
					? ["university", "campus", "studentId"]
					: ["university", "campus"];
				break;
			case 3:
				fieldsToValidate = ["agreeToTerms"];
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

	const onSubmit = async (data: CompleteProfileFormValues) => {
		setIsLoading(true);
		try {
			// Update user profile with KYC data
			await userService.updateProfile({
				phone: data.phone,
				role: data.role,
				university: data.university,
				campus: data.campus,
				studentId: data.isStudent ? data.studentId : undefined,
			});

			// Refetch user data to update the store
			await refetchUser();

			// Redirect to home or dashboard after completion
			router.push("/");
		} catch (error) {
			console.error("Profile update failed:", error);
		} finally {
			setIsLoading(false);
		}
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
							<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
								<Check className="h-4 w-4" />
								Google Sign-in Successful
							</div>
							<h2 className="text-4xl font-bold text-foreground">
								Almost There!
							</h2>
							<p className="text-lg text-muted-foreground max-w-md">
								Complete your profile to unlock all features of VarsityMart and start {selectedRole === "seller" ? "selling" : "shopping"}.
							</p>
						</div>

						{/* Why Complete Profile */}
						<div className="space-y-3">
							<p className="text-sm font-medium text-foreground">Why complete your profile?</p>
							{[
								"Verify your identity for secure transactions",
								"Connect with your campus community",
								"Access exclusive student deals",
								"Build trust with other users",
							].map((reason, i) => (
								<div key={i} className="flex items-center gap-3">
									<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary">
										<Check className="h-4 w-4" />
									</div>
									<span className="text-foreground text-sm">{reason}</span>
								</div>
							))}
						</div>
					</div>

					{/* User Info Card */}
					{user && (
						<div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
							<p className="text-xs text-muted-foreground mb-3">Signed in as</p>
							<div className="flex items-center gap-3">
								<Avatar className="h-12 w-12">
									<AvatarImage src={user.avatar || undefined} alt={user.fullName} />
									<AvatarFallback className="bg-primary/10">
										<User className="h-6 w-6 text-primary" />
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{user.fullName}</p>
									<p className="text-sm text-muted-foreground">{user.email}</p>
								</div>
							</div>
						</div>
					)}
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
							<div className="flex items-center justify-center mb-2">
								{STEPS.map((step, index) => (
									<div key={step.id} className="flex items-center">
										<div
											className={cn(
												"w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
												currentStep > step.id
													? "bg-primary text-primary-foreground"
													: currentStep === step.id
													? "bg-primary text-primary-foreground"
													: "bg-muted text-muted-foreground"
											)}
										>
											{currentStep > step.id ? (
												<Check className="h-5 w-5" />
											) : (
												step.id
											)}
										</div>
										{index < STEPS.length - 1 && (
											<div
												className={cn(
													"w-16 sm:w-20 h-1 mx-2",
													currentStep > step.id ? "bg-primary" : "bg-muted"
												)}
											/>
										)}
									</div>
								))}
							</div>
							<div className="text-center mt-6">
								<h1 className="text-2xl font-bold">{STEPS[currentStep - 1].title}</h1>
								<p className="text-sm text-muted-foreground mt-1">{STEPS[currentStep - 1].description}</p>
							</div>
						</div>

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
								{/* Step 1: Account Type & Phone */}
								{currentStep === 1 && (
									<div className="space-y-6">
										<FormField
											control={form.control}
											name="role"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-base">I want to</FormLabel>
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

										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Phone number</FormLabel>
													<FormControl>
														<Input
															type="tel"
															placeholder="+233 XX XXX XXXX"
															autoComplete="tel"
															disabled={isLoading || isLoading}
															className="h-12"
															{...field}
														/>
													</FormControl>
													<FormDescription className="text-xs">
														We'll use this for order notifications and verification
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								)}

								{/* Step 2: University */}
								{currentStep === 2 && (
									<div className="space-y-4">
										<FormField
											control={form.control}
											name="isStudent"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-xl border-2 border-muted p-4 hover:border-primary/50 transition-colors">
													<div className="space-y-0.5 flex items-center gap-3">
														<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
															<GraduationCap className="h-5 w-5 text-primary" />
														</div>
														<div>
															<FormLabel className="text-base font-medium">I'm a student</FormLabel>
															<FormDescription className="text-xs">Student accounts get verified faster</FormDescription>
														</div>
													</div>
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
															disabled={isLoading || isLoading}
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
														disabled={isLoading || isLoading}
													>
														<FormControl>
															<SelectTrigger className="h-12">
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
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
															disabled={isLoading || isLoading}
														>
															<FormControl>
																<SelectTrigger className="h-12">
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
															<Input
																placeholder="e.g. PS/CSC/20/0001"
																disabled={isLoading || isLoading}
																className="h-12"
																{...field}
															/>
														</FormControl>
														<FormDescription className="text-xs">Required for student verification</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}
									</div>
								)}

								{/* Step 3: Terms & Complete */}
								{currentStep === 3 && (
									<div className="space-y-6">
										{/* Summary Card */}
										<div className="rounded-xl border-2 border-muted p-5 space-y-4">
											<h3 className="font-semibold text-lg">Profile Summary</h3>

											<div className="space-y-3">
												<div className="flex justify-between items-center py-2 border-b border-border/50">
													<span className="text-sm text-muted-foreground">Account Type</span>
													<span className="text-sm font-medium capitalize">{form.watch("role")}</span>
												</div>
												<div className="flex justify-between items-center py-2 border-b border-border/50">
													<span className="text-sm text-muted-foreground">Phone</span>
													<span className="text-sm font-medium">{form.watch("phone")}</span>
												</div>
												<div className="flex justify-between items-center py-2 border-b border-border/50">
													<span className="text-sm text-muted-foreground">University</span>
													<span className="text-sm font-medium">{form.watch("university")}</span>
												</div>
												<div className="flex justify-between items-center py-2 border-b border-border/50">
													<span className="text-sm text-muted-foreground">Campus</span>
													<span className="text-sm font-medium">{form.watch("campus")}</span>
												</div>
												{isStudent && (
													<div className="flex justify-between items-center py-2">
														<span className="text-sm text-muted-foreground">Student ID</span>
														<span className="text-sm font-medium">{form.watch("studentId")}</span>
													</div>
												)}
											</div>
										</div>

										<FormField
											control={form.control}
											name="agreeToTerms"
											render={({ field }) => (
												<FormItem className="flex items-start gap-3 rounded-xl border-2 border-muted p-4">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
															disabled={isLoading || isLoading}
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

										<p className="text-xs text-muted-foreground text-center">
											By completing your profile, you confirm that the information provided is accurate.
										</p>
									</div>
								)}

								{/* Navigation Buttons */}
								<div className="flex gap-3 pt-4">
									{currentStep > 1 && (
										<Button
											type="button"
											variant="outline"
											onClick={prevStep}
											disabled={isLoading || isLoading}
											className="flex-1 h-12"
										>
											<ArrowLeft className="h-4 w-4 mr-2" />
											Back
										</Button>
									)}

									{currentStep < STEPS.length ? (
										<Button
											type="button"
											onClick={nextStep}
											disabled={isLoading || isLoading}
											className="flex-1 h-12"
										>
											Continue
											<ArrowRight className="h-4 w-4 ml-2" />
										</Button>
									) : (
										<Button
											type="submit"
											disabled={isLoading || isLoading}
											className="flex-1 h-12"
										>
											{(isLoading || isLoading) ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													Completing profile...
												</>
											) : (
												<>
													<Check className="mr-2 h-4 w-4" />
													Complete Profile
												</>
											)}
										</Button>
									)}
								</div>
							</form>
						</Form>

						{/* Skip for now link */}
						<p className="mt-6 text-center text-sm text-muted-foreground">
							Want to explore first?{" "}
							<Link href="/" className="text-primary font-medium hover:underline">
								Skip for now
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
