"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function RegisterForm() {
	const [step, setStep] = useState(1);
	const [authMethod, setAuthMethod] = useState("");

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

	const handleGoogleAuth = () => {
		setAuthMethod("google");
		// Simulate Google OAuth response
		const googleUserData = {
			fullName: "John Mensah",
			email: "john.mensah@gmail.com",
			profile_pic: "https://github.com/shadcn.png",
		};

		setValue("auth_method", "google");
		setValue("fullName", googleUserData.fullName);
		setValue("email", googleUserData.email);
		setValue("profile_pic", googleUserData.profile_pic);

		setStep(4); // Skip to phone
	};

	const handleCredentialsAuth = () => {
		setAuthMethod("credentials");
		setValue("auth_method", "credentials");
		setStep(2);
	};

	const handleNext = async () => {
		let fieldsToValidate = [];
		let isValid = false;

		switch (step) {
			case 1:
				if (!authMethod) return;
				setStep(step + 1);
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
				setStep(isStudent ? 7 : 8);
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

			// Skip password step for Google auth
			if (step === 4 && authMethod === "google") {
				nextStep = 6;
			}

			setStep(nextStep);
		}
	};

	const handleBack = () => {
		let prevStep = step - 1;

		// Skip password step backwards if Google auth
		if (step === 6 && authMethod === "google") {
			prevStep = 4;
		}

		// Skip student ID backwards if not student
		if (step === 8 && !isStudent) {
			prevStep = 6;
		}

		setStep(prevStep);
	};
	const {setIsAuthenticated} = useAuth();

	const onSubmit = (data) => {
		const { confirmPassword, ...submissionData } = data;
		console.log("Form Submitted:", submissionData);
		setIsAuthenticated(true)
		alert("Registration successful! Check console for data.");
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
		<div className="min-h-screen bg-primary/5 flex items-center bg-linear-to-t from-primary/15 to-transparent justify-center p-4">
			<Card className="w-full max-w-xl md:p-20 relative shadow-lg border-0" >
				<CardHeader className="space-y-3 pb-4">
					{authMethod === "google" && profilePic && step > 1 && (
						<div className="flex items-center justify-center">
							<Image
								width={200}
								height={200}
								src={profilePic}
								alt="Profile"
								className="w-16 h-16 rounded-full border-2 border-primary/20"
							/>
						</div>
					)}
					<div className="w-full rounded-full h-1.5">
						<div
							className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out"
							style={{ width: `${progress}%` }}
						/>
					</div>
					<CardTitle className="text-xl font-semibold text-center ">
						{step === 1 && "Welcome! Let's get started"}
						{step === 2 && "What's your name?"}
						{step === 3 && "What's your email?"}
						{step === 4 && "Your phone number?"}
						{step === 5 && "Create a password"}
						{step === 6 && "Are you a student?"}
						{step === 7 && "Your student ID"}
						{step === 8 && "Which university?"}
						{step === 9 && "Which campus?"}
						{step === 10 && "Almost done!"}
					</CardTitle>
					<p className="text-xs text-center text-foreground">
						Step {getCurrentStepNumber()} of {getTotalSteps()}
					</p>
				</CardHeader>

				<CardContent className="space-y-6 pb-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Step 1: Auth Method */}
							{step === 1 && (
								<div className="space-y-3">
									<Button
										type="button"
										onClick={handleGoogleAuth}
										variant="outline"
										className="w-full h-12 text-base bg-accent border-2"
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

									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-t " />
										</div>
										<div className="relative flex justify-center text-xs">
											<span className="px-2">OR</span>
										</div>
									</div>

									<Button
										type="button"
										onClick={handleCredentialsAuth}
										className="w-full h-12 text-base bg-primary/90 hover:bg-primary/90"
									>
										<Mail className="w-5 h-5 mr-2" />
										Continue with Email
									</Button>
								</div>
							)}

							{/* Step 2: Full Name */}
							{step === 2 && (
								<FormField
									control={form.control}
									name="fullName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<div className="relative">
													<UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
													<Input
														{...field}
														placeholder="John Doe"
														className="pl-10 h-11"
														autoFocus
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{/* Step 3: Email */}
							{step === 3 && (
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email Address</FormLabel>
											<FormControl>
												<div className="relative">
													<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
													<Input
														{...field}
														type="email"
														placeholder="john.doe@university.edu.gh"
														className="pl-10 h-11"
														autoFocus
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{/* Step 4: Phone */}
							{step === 4 && (
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone Number</FormLabel>
											<FormControl>
												<div className="relative">
													<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
													<Input
														{...field}
														placeholder="+233XXXXXXXXX"
														className="pl-10 h-11"
														autoFocus
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{/* Step 5: Password */}
							{step === 5 && authMethod === "credentials" && (
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<div className="relative">
														<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
														<Input
															{...field}
															type="password"
															placeholder="Min. 8 characters"
															className="pl-10 h-11"
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
												<FormLabel>Confirm Password</FormLabel>
												<FormControl>
													<div className="relative">
														<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
														<Input
															{...field}
															type="password"
															placeholder="Re-enter password"
															className="pl-10 h-11"
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}

							{/* Step 6: Student Status */}
							{step === 6 && (
								<FormField
									control={form.control}
									name="isStudent"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Student Status</FormLabel>
											<FormControl>
												<RadioGroup
													value={field.value.toString()}
													onValueChange={(value) => field.onChange(value === "true")}
													className="space-y-2"
												>
													<div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent cursor-pointer">
														<RadioGroupItem value="true" id="student-yes" />
														<Label
															htmlFor="student-yes"
															className="font-normal cursor-pointer flex-1"
														>
															Yes, I'm a student
														</Label>
													</div>
													<div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent cursor-pointer">
														<RadioGroupItem value="false" id="student-no" />
														<Label
															htmlFor="student-no"
															className="font-normal cursor-pointer flex-1"
														>
															No, I'm not a student
														</Label>
													</div>
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{/* Step 7: Student ID */}
							{step === 7 && isStudent && (
								<FormField
									control={form.control}
									name="studentId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Student ID</FormLabel>
											<FormControl>
												<div className="relative">
													<GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 " />
													<Input
														{...field}
														placeholder="UG12345678"
														className="pl-10 h-11"
														autoFocus
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}

							{/* Step 8: University */}
							{step === 8 && (
								<FormField
									control={form.control}
									name="university"
									render={({ field }) => (
										<FormItem>
											<FormLabel>University</FormLabel>
											<Select
												onValueChange={(value) => {
													field.onChange(value);
													setValue("campus", ""); // Reset campus when university changes
												}}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger className="h-11 w-full">
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
							)}

							{/* Step 9: Campus */}
							{step === 9 && (
								<FormField
									control={form.control}
									name="campus"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Campus</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
												disabled={!selectedUniversity}
											>
												<FormControl>
													<SelectTrigger className="h-11 w-full">
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

							{/* Step 10: Review & Terms */}
							{step === 10 && (
								<div className="space-y-4">
									<div className="bg-accent p-4 rounded-lg space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="">Name:</span>
											<span className="font-medium">{watch("fullName")}</span>
										</div>
										<div className="flex justify-between">
											<span className="">Email:</span>
											<span className="font-medium ">{watch("email")}</span>
										</div>
										<div className="flex justify-between">
											<span className="">Phone:</span>
											<span className="font-medium ">{watch("phone")}</span>
										</div>
										<div className="flex justify-between">
											<span className="">Status:</span>
											<span className="font-medium">
												{isStudent ? "Student" : "Non-Student"}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="">University:</span>
											<span className="font-medium text-xs">{watch("university")}</span>
										</div>
									</div>

									<FormField
										control={form.control}
										name="agreeToTerms"
										render={({ field }) => (
											<FormItem>
												<div className="flex items-start space-x-2 p-3 border rounded-lg">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
															className="mt-0.5"
														/>
													</FormControl>
													<FormLabel className="text-sm font-normal leading-tight cursor-pointer">
														I agree to the Terms and Conditions and Privacy Policy
													</FormLabel>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}

							{/* Navigation */}
							<div className="flex gap-3 pt-2">
								<div
									style={{ display: step > 1 ? "block" : "none" }}
									className="flex-1"
								>
									<Button
										type="button"
										onClick={handleBack}
										variant="outline"
										className="w-full h-11"
									>
										<ArrowLeft className="w-4 h-4 mr-2" />
										Back
									</Button>
								</div>

								<div
									style={{ display: step > 1 && step != 10 ? "block" : "none" }}
									className="flex-1"
								>
									<Button
										type="button"
										onClick={handleNext}
										className="w-full h-11 bg-primary hover:bg-primary/90"
									>
										Continue
										<ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</div>

								<div
									style={{ display: step === 10 ? "block" : "none" }}
									className="flex-1"
								>
									<Button
										type="submit"
										className="w-full h-11 bg-primary hover:bg-primary/90"
										disabled={!watch("agreeToTerms")}
									>
										<CheckCircle2 className="w-4 h-4 mr-2" />
										Complete
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
