"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	GraduationCap,
	Lock,
	Mail,
	Phone,
	Sparkles,
	UserCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
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
import { fullFormSchema } from "@/data/auth/register-schemas";
import {
	mockGoogleUserData,
	stepDescriptions,
	stepImages,
	stepTitles,
} from "@/data/auth/register-steps";
import { universities } from "@/data/auth/universities";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterForm() {
	const [step, setStep] = useState(1);
	const [authMethod, setAuthMethod] = useState("");
	const [isAnimating, setIsAnimating] = useState(false);

	const form = useForm({
		resolver: zodResolver(fullFormSchema),
		defaultValues: {
			fullName: "",
			email: "",
			phone: "",
			password: "",
			confirmPassword: "",
			studentId: "",
			isStudent: true,
			university: "",
			campus: "",
			agreeToTerms: false,
			role: "buyer",
			auth_method: "",
			profile_pic: "",
		},
		mode: "onChange",
	});

	const { watch, setValue, trigger } = form;
	const isStudent = watch("isStudent");
	const selectedUniversity = watch("university");
	const availableCampuses = selectedUniversity
		? universities[selectedUniversity]
		: [];

	const handleStepChange = (newStep: number) => {
		setIsAnimating(true);
		setTimeout(() => {
			setStep(newStep);
			setIsAnimating(false);
		}, 200);
	};

	const handleGoogleAuth = () => {
		setAuthMethod("google");
		setValue("auth_method", "google");
		setValue("fullName", mockGoogleUserData.fullName);
		setValue("email", mockGoogleUserData.email);
		setValue("profile_pic", mockGoogleUserData.profile_pic);

		handleStepChange(4);
	};

	const handleCredentialsAuth = () => {
		setAuthMethod("credentials");
		setValue("auth_method", "credentials");
		handleStepChange(2);
	};

	const handleNext = async () => {
		let fieldsToValidate: string[] = [];
		let isValid = false;

		switch (step) {
			case 1:
				if (!authMethod) return;
				handleStepChange(step + 1);
				return;
			case 2:
				fieldsToValidate = ["fullName"];
				break;
			case 3:
				fieldsToValidate = ["email"];
				break;
			case 4:
				fieldsToValidate = ["phone"];
				break;
			case 5:
				fieldsToValidate = ["password", "confirmPassword"];
				break;
			case 6:
				handleStepChange(isStudent ? 7 : 8);
				return;
			case 7:
				fieldsToValidate = ["studentId"];
				break;
			case 8:
				fieldsToValidate = ["university"];
				break;
			case 9:
				fieldsToValidate = ["campus"];
				break;
			case 10:
				fieldsToValidate = ["agreeToTerms"];
				break;
		}

		isValid = await trigger(fieldsToValidate as any);

		if (isValid) {
			let nextStep = step + 1;

			if (step === 4 && authMethod === "google") {
				nextStep = 6;
			}

			handleStepChange(nextStep);
		}
	};

	const handleBack = () => {
		let prevStep = step - 1;

		if (step === 6 && authMethod === "google") {
			prevStep = 4;
		}

		if (step === 8 && !isStudent) {
			prevStep = 6;
		}

		handleStepChange(prevStep);
	};

	const { setIsAuthenticated } = useAuth();

	const onSubmit = (data: z.infer<typeof fullFormSchema>) => {
		const { confirmPassword, ...submissionData } = data;
		console.log("Form Submitted:", submissionData);
		setIsAuthenticated(true);
	};

	const getTotalSteps = () => {
		let total = 10;
		if (authMethod === "google") total -= 1;
		if (!isStudent) total -= 1;
		return total;
	};

	const getCurrentStepNumber = () => {
		let current = step;
		if (authMethod === "google" && step > 5) current -= 1;
		if (!isStudent && step > 7) current -= 1;
		return current;
	};

	const progress = (getCurrentStepNumber() / getTotalSteps()) * 100;
	const profilePic = watch("profile_pic");

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4 lg:p-0">
			<div className="max-w-6xl w-full">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl lg:rounded-none overflow-hidden shadow-2xl lg:shadow-none">
					{/* Left side - Image */}
					<div className="hidden lg:flex flex-col justify-between bg-card dark:bg-card relative overflow-hidden h-screen sticky top-0">
						{/* Background image */}
						<div className="absolute inset-0 z-0">
							<Image
								src={stepImages[step]}
								alt="Step illustration"
								fill
								className="object-cover opacity-50"
								priority
							/>
							<div className="absolute inset-0 dark:bg-gradient-to-b dark:from-slate-900/30 dark:via-slate-900/50 dark:to-slate-900/70 bg-gradient-to-b from-foreground/30 via-foreground/50 to-foreground/70 "></div>
						</div>

						{/* Content overlay */}
						<div className="relative z-10 p-12 space-y-8">
							<div>
								<h1 className="text-5xl font-black text-card-foreground mb-2">
									VarsityMart
								</h1>
								<p className="text-xl text-card-foreground/80 font-light">
									Africa's #1 student marketplace
								</p>
							</div>

							{/* Stats */}
							<div className="space-y-4">
								<div className="border-l-4 border-card-foreground pl-4">
									<p className="text-4xl font-black text-card-foreground">50K+</p>
									<p className="text-card-foreground/70 text-sm mt-1">Active Students</p>
								</div>
								<div className="border-l-4 border-card-foreground pl-4">
									<p className="text-4xl font-black text-card-foreground">10K+</p>
									<p className="text-card-foreground/70 text-sm mt-1">
										Quality Products
									</p>
								</div>
								<div className="border-l-4 border-card-foreground pl-4">
									<p className="text-4xl font-black text-card-foreground">Verified</p>
									<p className="text-card-foreground/70 text-sm mt-1">100% Secure</p>
								</div>
							</div>
						</div>

						{/* Bottom section */}
						<div className="relative z-10 p-12">
							<div className="space-y-4 border-t border-card-foreground/20 pt-8">
								<p className="text-sm text-card-foreground/70">
									Step {getCurrentStepNumber()} of {getTotalSteps()}
								</p>
								<div className="w-full h-1.5 bg-card-foreground/20 rounded-full overflow-hidden">
									<div
										className="h-full bg-card-foreground transition-all duration-700"
										style={{ width: `${progress}%` }}
									/>
								</div>
								<h2 className="text-2xl font-bold text-card-foreground">
									{stepTitles[step]}
								</h2>
								<p className="text-card-foreground/70 text-sm">
									{stepDescriptions[step]}
								</p>
							</div>
						</div>
					</div>

					{/* Right side - Form */}
					<div className=" flex flex-col justify-between min-h-screen lg:min-h-auto lg:h-screen overflow-y-auto lg:overflow-y-auto">
						<div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
							<div className="w-full max-w-md">
								{/* Mobile header */}
								<div className="lg:hidden mb-8">
									<h1 className="text-3xl font-black text-foreground mb-1">
										VarsityMart
									</h1>
									<p className="text-muted-foreground text-sm">{stepTitles[step]}</p>
									<div className="w-full h-1 bg-muted rounded-full mt-4 overflow-hidden">
										<div
											className="h-full bg-primary transition-all duration-700"
											style={{ width: `${progress}%` }}
										/>
									</div>
									<p className="text-xs text-muted-foreground mt-2">
										Step {getCurrentStepNumber()} of {getTotalSteps()}
									</p>
								</div>

								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit as any)}
										className={`space-y-6 transition-opacity duration-200 ${
											isAnimating ? "opacity-50" : "opacity-100"
										}`}
									>
										{/* Step 1: Auth Method */}
										{step === 1 && (
											<div className="space-y-4 animate-fade-in">
												<Button
													type="button"
													onClick={handleGoogleAuth}
													variant="outline"
													className="w-full h-12 text-base font-semibold border-2 border-border hover:border-primary/50 hover:bg-accent transition-all rounded-xl"
												>
													<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
														<path
															fill="#4285F4"
															d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
														/>
														<path
															fill="#34A853"
															d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
														/>
														<path
															fill="#FBBC05"
															d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
														/>
														<path
															fill="#EA4335"
															d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
														/>
													</svg>
													Continue with Google
												</Button>

												<div className="relative my-6">
													<div className="absolute inset-0 flex items-center">
														<span className="w-full border-t border-border" />
													</div>
													<div className="relative flex justify-center">
														<span className="px-3 bg-background text-xs text-muted-foreground font-semibold">
															OR
														</span>
													</div>
												</div>

												<Button
													type="button"
													onClick={handleCredentialsAuth}
													className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-colors rounded-xl text-primary-foreground"
												>
													<Mail className="w-5 h-5 mr-2" />
													Continue with Email
												</Button>
											</div>
										)}

										{/* Step 2: Full Name */}
										{step === 2 && (
											<div className="space-y-4 animate-fade-in">
												<FormField
													control={form.control}
													name="fullName"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-foreground font-semibold text-sm">
																Full Name
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
																	<Input
																		{...field}
																		placeholder="John Doe"
																		className="pl-12 h-11 rounded-lg border-border focus:border-primary focus:ring-primary/20 transition-all"
																		autoFocus
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										)}

										{/* Step 3: Email */}
										{step === 3 && (
											<div className="space-y-4 animate-fade-in">
												<FormField
													control={form.control}
													name="email"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-foreground font-semibold text-sm">
																Email Address
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
																	<Input
																		{...field}
																		type="email"
																		placeholder="john@university.edu.gh"
																		className="pl-12 h-11 rounded-lg border-border focus:border-primary focus:ring-primary/20 transition-all"
																		autoFocus
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										)}

										{/* Step 4: Phone */}
										{step === 4 && (
											<div className="space-y-4 animate-fade-in">
												<FormField
													control={form.control}
													name="phone"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-foreground font-semibold text-sm">
																Phone Number
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
																	<Input
																		{...field}
																		placeholder="+233XXXXXXXXX"
																		className="pl-12 h-11 rounded-lg border-border focus:border-primary focus:ring-primary/20 transition-all"
																		autoFocus
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										)}

										{/* Step 5: Password */}
										{step === 5 && authMethod === "credentials" && (
											<div className="space-y-4 animate-fade-in">
												<FormField
													control={form.control}
													name="password"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-foreground font-semibold text-sm">
																Password
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
																	<Input
																		{...field}
																		type="password"
																		placeholder="Min. 8 characters"
																		className="pl-12 h-11 rounded-lg border-border focus:border-primary focus:ring-primary/20 transition-all"
																		autoFocus
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="confirmPassword"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-foreground font-semibold text-sm">
																Confirm Password
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
																	<Input
																		{...field}
																		type="password"
																		placeholder="Re-enter password"
																		className="pl-12 h-11 rounded-lg border-border focus:border-primary focus:ring-primary/20 transition-all"
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<div className="bg-muted border border-border rounded-lg p-4 space-y-2">
													<p className="text-xs font-semibold text-foreground flex items-center gap-2">
														<Sparkles className="w-4 h-4" />
														Password Requirements
													</p>
													<ul className="text-xs text-muted-foreground space-y-1">
														<li>✓ At least 8 characters</li>
														<li>✓ Mix of letters and numbers</li>
														<li>✓ Easy to remember</li>
													</ul>
												</div>
											</div>
										)}

										{/* Step 6: Student Status */}
										{step === 6 && (
											<div className="space-y-4 animate-fade-in">
												<FormField
													control={form.control}
													name="isStudent"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-foreground font-semibold text-sm block mb-4">
																Are you a student?
															</FormLabel>
															<FormControl>
																<RadioGroup
																	value={field.value.toString()}
																	onValueChange={(value) => field.onChange(value === "true")}
																	className="space-y-3"
																>
																	<div className="flex items-center space-x-3 border-2 border-border rounded-lg p-4 hover:bg-accent hover:border-primary cursor-pointer transition-all">
																		<RadioGroupItem value="true" id="student-yes" />
																		<Label
																			htmlFor="student-yes"
																			className="font-semibold cursor-pointer flex-1 text-foreground"
																		>
																			Yes, I'm a student 🎓
																		</Label>
																	</div>
																	<div className="flex items-center space-x-3 border-2 border-border rounded-lg p-4 hover:bg-accent hover:border-primary cursor-pointer transition-all">
																		<RadioGroupItem value="false" id="student-no" />
																		<Label
																			htmlFor="student-no"
																			className="font-semibold cursor-pointer flex-1 text-foreground"
																		>
																			No, I'm not 💼
																		</Label>
																	</div>
																</RadioGroup>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										)}

										{/* Step 7: Student ID */}
										{step === 7 && isStudent && (
											<div className="space-y-4 animate-fade-in">
												<FormField
													control={form.control}
													name="studentId"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-foreground font-semibold text-sm">
																Student ID Number
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
																	<Input
																		{...field}
																		placeholder="UG12345678"
																		className="pl-12 h-11 rounded-lg border-border focus:border-primary focus:ring-primary/20 transition-all"
																		autoFocus
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										)}

										{/* Step 8: University */}
										{step === 8 && (
											<div className="space-y-4 animate-fade-in">
												<FormField
													control={form.control}
													name="university"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-foreground font-semibold text-sm">
																Your University
															</FormLabel>
															<Select
																onValueChange={(value) => {
																	field.onChange(value);
																	setValue("campus", "");
																}}
																value={field.value}
															>
																<FormControl>
																	<SelectTrigger className="h-11 rounded-lg border-border focus:border-primary focus:ring-primary/20 transition-all">
																		<SelectValue placeholder="Select your university" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent className="rounded-lg">
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
											</div>
										)}

										{/* Step 9: Campus */}
										{step === 9 && (
											<div className="space-y-4 animate-fade-in">
												<FormField
													control={form.control}
													name="campus"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-foreground font-semibold text-sm">
																Your Campus
															</FormLabel>
															<Select
																onValueChange={field.onChange}
																value={field.value}
																disabled={!selectedUniversity}
															>
																<FormControl>
																	<SelectTrigger className="h-11 rounded-lg border-border focus:border-primary focus:ring-primary/20 transition-all disabled:opacity-50">
																		<SelectValue placeholder="Select your campus" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent className="rounded-lg">
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
											</div>
										)}

										{/* Step 10: Review & Terms */}
										{step === 10 && (
											<div className="space-y-4 animate-fade-in">
												<div className="bg-muted rounded-lg p-4 space-y-3 border border-border">
													<h3 className="font-semibold text-foreground text-sm">
														Verify Your Details
													</h3>

													<div className="space-y-2">
														{[
															{
																label: "Name",
																value: watch("fullName"),
															},
															{ label: "Email", value: watch("email") },
															{ label: "Phone", value: watch("phone") },
															{
																label: "Status",
																value: isStudent ? "Student" : "Non-Student",
															},
															{
																label: "University",
																value: watch("university"),
															},
														].map((item, i) => (
															<div
																key={i}
																className="flex items-center justify-between text-sm border-b border-border/50 pb-2"
															>
																<span className="text-muted-foreground">{item.label}</span>
																<span className="font-semibold text-foreground">
																	{item.value}
																</span>
															</div>
														))}
													</div>
												</div>

												<FormField
													control={form.control}
													name="agreeToTerms"
													render={({ field }) => (
														<FormItem>
															<div className="flex items-start space-x-3 p-4 border-2 border-border rounded-lg hover:bg-accent hover:border-primary transition-all cursor-pointer">
																<FormControl>
																	<Checkbox
																		checked={field.value}
																		onCheckedChange={field.onChange}
																		className="mt-1"
																	/>
																</FormControl>
																<FormLabel className="text-sm font-medium text-foreground cursor-pointer leading-relaxed">
																	I agree to VarsityMart's Terms and Conditions, Privacy Policy,
																	and Merchant Agreement
																</FormLabel>
															</div>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										)}

										{/* Navigation */}
										<div className="flex gap-3 pt-6">
											<div
												style={{ display: step > 1 ? "block" : "none" }}
												className="flex-1"
											>
												<Button
													type="button"
													onClick={handleBack}
													variant="outline"
													className="w-full h-11 rounded-lg border-2 border-border hover:bg-accent font-semibold text-foreground transition-all"
												>
													<ArrowLeft className="w-4 h-4 mr-2" />
													Back
												</Button>
											</div>

											<div
												style={{
													display: step > 1 && step != 10 ? "block" : "none",
												}}
												className="flex-1"
											>
												<Button
													type="button"
													onClick={handleNext}
													className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 font-semibold text-primary-foreground transition-colors"
												>
													Continue
													<ArrowRight className="w-4 h-4 ml-2" />
												</Button>
											</div>

											<div
												style={{
													display: step === 10 ? "block" : "none",
												}}
												className="flex-1"
											>
												<Button
													type="submit"
													className="w-full h-11 rounded-lg bg-primary hover:bg-primary/90 font-semibold text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
													disabled={!watch("agreeToTerms")}
												>
													<CheckCircle2 className="w-5 h-5 mr-2" />
													Create Account
												</Button>
											</div>
										</div>
									</form>
								</Form>
							</div>
						</div>

						{/* Footer */}
						<div className="p-6 sm:p-8 lg:p-12 border-t border-border">
							<p className="text-xs text-muted-foreground text-center">
								🔒 Your data is encrypted and secure
							</p>
						</div>
					</div>
				</div>
			</div>

			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fadeIn 0.3s ease-out forwards;
				}

				input::placeholder {
					color: hsl(var(--muted-foreground));
				}
			`}</style>
		</div>
	);
}
