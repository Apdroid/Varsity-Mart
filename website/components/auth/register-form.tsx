"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	UserCircle,
	Mail,
	Phone,
	Lock,
	GraduationCap,
	CheckCircle2,
	ArrowRight,
	ArrowLeft,
	Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const universities = {
	"University of Ghana": ["Legon Campus", "Korle Bu Campus", "City Campus"],
	KNUST: [
		"Main Campus",
		"College of Health Sciences",
		"Institute of Distance Learning",
	],
	"University of Cape Coast": [
		"Main Campus",
		"Southern Campus",
		"Northern Campus",
	],
	GIMPA: ["Greenhill Campus", "City Campus"],
	"Ashesi University": ["Berekuso Campus"],
	Other: ["Main Campus", "Other"],
};

// Step schemas
const step1Schema = z.object({
	auth_method: z.enum(["google", "credentials"]),
});

const step2Schema = z.object({
	fullName: z.string().min(2, "Full name must be at least 2 characters"),
});

const step3Schema = z.object({
	email: z.string().email("Invalid email address"),
});

const step4Schema = z.object({
	phone: z
		.string()
		.regex(/^\+233\d{9}$/, "Phone must be in format +233XXXXXXXXX"),
});

const step5Schema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const step6Schema = z.object({
	isStudent: z.boolean(),
});

const step7Schema = z.object({
	studentId: z.string().min(1, "Student ID is required"),
});

const step8Schema = z.object({
	university: z.string().min(1, "Please select a university"),
});

const step9Schema = z.object({
	campus: z.string().min(1, "Please select a campus"),
});

const step10Schema = z.object({
	agreeToTerms: z.boolean().refine((val) => val === true, {
		message: "You must agree to the terms",
	}),
});

// Full form schema
const fullFormSchema = z.object({
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

const stepTitles = {
	1: "Welcome to VarsityMart",
	2: "What's your name?",
	3: "Your email address",
	4: "Phone number",
	5: "Create a secure password",
	6: "Student verification",
	7: "Your student ID",
	8: "Which university?",
	9: "Select your campus",
	10: "Verify your details",
};

const stepDescriptions = {
	1: "Africa's #1 student marketplace",
	2: "Help us personalize your experience",
	3: "We'll use this to secure your account",
	4: "In Ghana (+233 format)",
	5: "Keep your account safe",
	6: "Unlock exclusive VarsityMart benefits",
	7: "Verify your student status",
	8: "Access institution-specific offers",
	9: "For location-based deals",
	10: "Review before you confirm",
};

// Step images mapping
const stepImages = {
	1: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&h=800&fit=crop",
	2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
	3: "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=600&h=800&fit=crop",
	4: "https://images.unsplash.com/photo-1484807352052-23338112c498?w=600&h=800&fit=crop",
	5: "https://images.unsplash.com/photo-1526374965328-7f5ae4e8cfb2?w=600&h=800&fit=crop",
	6: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=800&fit=crop",
	7: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=800&fit=crop",
	8: "https://images.unsplash.com/photo-1531746790731-6c087fecd65b?w=600&h=800&fit=crop",
	9: "https://images.unsplash.com/photo-1507238691854-56c5b05ce285?w=600&h=800&fit=crop",
	10: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=800&fit=crop",
};

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

	const handleStepChange = (newStep) => {
		setIsAnimating(true);
		setTimeout(() => {
			setStep(newStep);
			setIsAnimating(false);
		}, 200);
	};

	const handleGoogleAuth = () => {
		setAuthMethod("google");
		const googleUserData = {
			fullName: "John Mensah",
			email: "john.mensah@gmail.com",
			profile_pic: "https://github.com/shadcn.png",
		};

		setValue("auth_method", "google");
		setValue("fullName", googleUserData.fullName);
		setValue("email", googleUserData.email);
		setValue("profile_pic", googleUserData.profile_pic);

		handleStepChange(4);
	};

	const handleCredentialsAuth = () => {
		setAuthMethod("credentials");
		setValue("auth_method", "credentials");
		handleStepChange(2);
	};

	const handleNext = async () => {
		let fieldsToValidate = [];
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

		isValid = await trigger(fieldsToValidate);

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

	const onSubmit = (data) => {
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
		<div className="min-h-screen bg-white flex items-center justify-center p-4 lg:p-0">
			<div className="w-full ">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl lg:rounded-none overflow-hidden shadow-2xl lg:shadow-none">
					{/* Left side - Image */}
					<div className="hidden lg:flex flex-col justify-between bg-slate-900 relative overflow-hidden h-screen sticky top-0">
						{/* Background image */}
						<div className="absolute inset-0 z-0">
							<Image
								src={stepImages[step]}
								alt="Step illustration"
								fill
								className="object-cover opacity-50"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/50 to-slate-900/70"></div>
						</div>

						{/* Content overlay */}
						<div className="relative z-10 p-12 space-y-8">
							<div>
								<h1 className="text-5xl font-black text-white mb-2">VarsityMart</h1>
								<p className="text-xl text-slate-200 font-light">
									Africa's #1 student marketplace
								</p>
							</div>

							{/* Stats */}
							<div className="space-y-4">
								<div className="border-l-4 border-white pl-4">
									<p className="text-4xl font-black text-white">50K+</p>
									<p className="text-slate-300 text-sm mt-1">Active Students</p>
								</div>
								<div className="border-l-4 border-white pl-4">
									<p className="text-4xl font-black text-white">10K+</p>
									<p className="text-slate-300 text-sm mt-1">Quality Products</p>
								</div>
								<div className="border-l-4 border-white pl-4">
									<p className="text-4xl font-black text-white">Verified</p>
									<p className="text-slate-300 text-sm mt-1">100% Secure</p>
								</div>
							</div>
						</div>

						{/* Bottom section */}
						<div className="relative z-10 p-12">
							<div className="space-y-4 border-t border-white/20 pt-8">
								<p className="text-sm text-slate-300">
									Step {getCurrentStepNumber()} of {getTotalSteps()}
								</p>
								<div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
									<div
										className="h-full bg-white transition-all duration-700"
										style={{ width: `${progress}%` }}
									/>
								</div>
								<h2 className="text-2xl font-bold text-white">
									{stepTitles[step]}
								</h2>
								<p className="text-slate-300 text-sm">
									{stepDescriptions[step]}
								</p>
							</div>
						</div>
					</div>

					{/* Right side - Form */}
					<div className="bg-white flex flex-col justify-between min-h-screen lg:min-h-auto lg:h-screen overflow-y-auto lg:overflow-y-auto">
						<div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
							<div className="w-full max-w-md">
								{/* Mobile header */}
								<div className="lg:hidden mb-8">
									<h1 className="text-3xl font-black text-slate-900 mb-1">VarsityMart</h1>
									<p className="text-slate-600 text-sm">
										{stepTitles[step]}
									</p>
									<div className="w-full h-1 bg-slate-200 rounded-full mt-4 overflow-hidden">
										<div
											className="h-full bg-slate-900 transition-all duration-700"
											style={{ width: `${progress}%` }}
										/>
									</div>
									<p className="text-xs text-slate-500 mt-2">
										Step {getCurrentStepNumber()} of {getTotalSteps()}
									</p>
								</div>

								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
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
													className="w-full h-12 text-base font-semibold border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all rounded-xl"
												>
													<svg
														className="w-5 h-5 mr-2"
														viewBox="0 0 24 24"
													>
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
														<span className="w-full border-t border-slate-200" />
													</div>
													<div className="relative flex justify-center">
														<span className="px-3 bg-white text-xs text-slate-600 font-semibold">
															OR
														</span>
													</div>
												</div>

												<Button
													type="button"
													onClick={handleCredentialsAuth}
													className="w-full h-12 text-base font-semibold bg-slate-900 hover:bg-slate-800 transition-colors rounded-xl text-white"
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
															<FormLabel className="text-slate-700 font-semibold text-sm">
																Full Name
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
																	<Input
																		{...field}
																		placeholder="John Doe"
																		className="pl-12 h-11 rounded-lg border-slate-200 focus:border-slate-900 focus:ring-slate-900/20 transition-all"
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
															<FormLabel className="text-slate-700 font-semibold text-sm">
																Email Address
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
																	<Input
																		{...field}
																		type="email"
																		placeholder="john@university.edu.gh"
																		className="pl-12 h-11 rounded-lg border-slate-200 focus:border-slate-900 focus:ring-slate-900/20 transition-all"
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
															<FormLabel className="text-slate-700 font-semibold text-sm">
																Phone Number
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
																	<Input
																		{...field}
																		placeholder="+233XXXXXXXXX"
																		className="pl-12 h-11 rounded-lg border-slate-200 focus:border-slate-900 focus:ring-slate-900/20 transition-all"
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
															<FormLabel className="text-slate-700 font-semibold text-sm">
																Password
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
																	<Input
																		{...field}
																		type="password"
																		placeholder="Min. 8 characters"
																		className="pl-12 h-11 rounded-lg border-slate-200 focus:border-slate-900 focus:ring-slate-900/20 transition-all"
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
															<FormLabel className="text-slate-700 font-semibold text-sm">
																Confirm Password
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
																	<Input
																		{...field}
																		type="password"
																		placeholder="Re-enter password"
																		className="pl-12 h-11 rounded-lg border-slate-200 focus:border-slate-900 focus:ring-slate-900/20 transition-all"
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
													<p className="text-xs font-semibold text-slate-700 flex items-center gap-2">
														<Sparkles className="w-4 h-4" />
														Password Requirements
													</p>
													<ul className="text-xs text-slate-600 space-y-1">
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
															<FormLabel className="text-slate-700 font-semibold text-sm block mb-4">
																Are you a student?
															</FormLabel>
															<FormControl>
																<RadioGroup
																	value={field.value.toString()}
																	onValueChange={(value) =>
																		field.onChange(value === "true")
																	}
																	className="space-y-3"
																>
																	<div className="flex items-center space-x-3 border-2 border-slate-200 rounded-lg p-4 hover:bg-slate-50 hover:border-slate-900 cursor-pointer transition-all">
																		<RadioGroupItem value="true" id="student-yes" />
																		<Label
																			htmlFor="student-yes"
																			className="font-semibold cursor-pointer flex-1 text-slate-900"
																		>
																			Yes, I'm a student 🎓
																		</Label>
																	</div>
																	<div className="flex items-center space-x-3 border-2 border-slate-200 rounded-lg p-4 hover:bg-slate-50 hover:border-slate-900 cursor-pointer transition-all">
																		<RadioGroupItem value="false" id="student-no" />
																		<Label
																			htmlFor="student-no"
																			className="font-semibold cursor-pointer flex-1 text-slate-900"
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
															<FormLabel className="text-slate-700 font-semibold text-sm">
																Student ID Number
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
																	<Input
																		{...field}
																		placeholder="UG12345678"
																		className="pl-12 h-11 rounded-lg border-slate-200 focus:border-slate-900 focus:ring-slate-900/20 transition-all"
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
															<FormLabel className="text-slate-700 font-semibold text-sm">
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
																	<SelectTrigger className="h-11 rounded-lg border-slate-200 focus:border-slate-900 focus:ring-slate-900/20 transition-all">
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
															<FormLabel className="text-slate-700 font-semibold text-sm">
																Your Campus
															</FormLabel>
															<Select
																onValueChange={field.onChange}
																value={field.value}
																disabled={!selectedUniversity}
															>
																<FormControl>
																	<SelectTrigger className="h-11 rounded-lg border-slate-200 focus:border-slate-900 focus:ring-slate-900/20 transition-all disabled:opacity-50">
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
												<div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-200">
													<h3 className="font-semibold text-slate-900 text-sm">
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
																className="flex items-center justify-between text-sm border-b border-slate-200/50 pb-2"
															>
																<span className="text-slate-600">
																	{item.label}
																</span>
																<span className="font-semibold text-slate-900">
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
															<div className="flex items-start space-x-3 p-4 border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-900 transition-all cursor-pointer">
																<FormControl>
																	<Checkbox
																		checked={field.value}
																		onCheckedChange={field.onChange}
																		className="mt-1"
																	/>
																</FormControl>
																<FormLabel className="text-sm font-medium text-slate-700 cursor-pointer leading-relaxed">
																	I agree to VarsityMart's Terms and Conditions,
																	Privacy Policy, and Merchant Agreement
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
													className="w-full h-11 rounded-lg border-2 border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-all"
												>
													<ArrowLeft className="w-4 h-4 mr-2" />
													Back
												</Button>
											</div>

											<div
												style={{
													display:
														step > 1 && step != 10
															? "block"
															: "none",
												}}
												className="flex-1"
											>
												<Button
													type="button"
													onClick={handleNext}
													className="w-full h-11 rounded-lg bg-slate-900 hover:bg-slate-800 font-semibold text-white transition-colors"
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
													className="w-full h-11 rounded-lg bg-slate-900 hover:bg-slate-800 font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
						<div className="p-6 sm:p-8 lg:p-12 border-t border-slate-200">
							<p className="text-xs text-slate-500 text-center">
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
					color: rgb(148, 163, 184);
				}
			`}</style>
		</div>
	);
}
