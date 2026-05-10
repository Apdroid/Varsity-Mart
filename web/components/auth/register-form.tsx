"use client"

import { AuthFormShell } from "@/components/auth/auth-form-shell"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	FieldDescription,
	FieldGroup,
	FieldSeparator,
} from "@/components/ui/field"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import PasswordInput from "@/components/ui/password-input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { registerSchema, type RegisterSchema } from "@/lib/validation/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Google } from "@lobehub/icons"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"

const universities = [
	"University of Ghana",
	"KNUST",
	"University of Cape Coast",
	"Ashesi University",
] as const

const campuses = ["Legon", "Main Campus", "Kumasi", "Cape Coast", "Berekuso"] as const

const STEP1_FIELDS: (keyof RegisterSchema)[] = ["firstName", "lastName", "email", "password"]

function getPasswordStrength(password: string) {
	if (!password) return { score: 0, label: "", color: "" }
	let score = 0
	if (password.length >= 8) score++
	if (/[A-Z]/.test(password)) score++
	if (/[0-9]/.test(password)) score++
	if (/[^A-Za-z0-9]/.test(password)) score++
	const levels = [
		{ label: "Very weak", color: "bg-red-500" },
		{ label: "Weak", color: "bg-orange-400" },
		{ label: "Fair", color: "bg-yellow-400" },
		{ label: "Strong", color: "bg-green-500" },
	]
	return { score, ...(levels[score - 1] ?? { label: "", color: "" }) }
}

export function RegisterForm({ className, ...props }: ComponentProps<"div">) {
	const [step, setStep] = useState(1)

	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		mode: "onBlur",
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			studentEmail: "",
			phone: "",
			password: "",
			studentId: "",
			isStudent: true,
			university: "University of Ghana",
			campus: "Legon",
			agreeToTerms: false,
			authMethod: "credentials",
			profilePic: "string",
		},
	})
	const { errors, isSubmitting } = form.formState
	const isStudent = form.watch("isStudent")
	const password = form.watch("password")
	const { score, label, color } = getPasswordStrength(password)

	const handleSubmit = (values: RegisterSchema) => {
		const payload = {
			firstName: values.firstName,
			lastName: values.lastName,
			email: values.email,
			studentEmail: values.studentEmail,
			phone: values.phone,
			password: values.password,
			studentId: values.studentId,
			isStudent: values.isStudent,
			university: values.university,
			campus: values.campus,
			agreeToTerms: values.agreeToTerms,
			authMethod: values.authMethod,
			profilePic: values.profilePic,
		}
		void payload
	}

	const handleNext = async () => {
		const valid = await form.trigger(STEP1_FIELDS)
		if (valid) setStep(2)
	}

	return (
		<AuthFormShell
			className={className}
			title="Create your campus account"
			description={
				<>
					Join{" "}
					<b className="font-bold text-black dark:text-primary">Varsity Mart</b>{" "}
					to buy and sell faster in your campus community
				</>
			}
			{...props}
		>
			<div className="mt-4 flex gap-1.5">
				{[1, 2].map((s) => (
					<div
						key={s}
						className={cn(
							"h-1 flex-1 rounded-full transition-colors duration-300",
							s <= step ? "bg-primary" : "bg-muted"
						)}
					/>
				))}
			</div>
			<p className="mt-1.5 text-xs text-muted-foreground">
				Step {step} of 2 — {step === 1 ? "Personal info" : "Campus details"}
			</p>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					noValidate
					className="mt-4"
				>
					<FieldGroup>
						{step === 1 ? (
							<>
								<FormItem>
									<Button
										variant="outline"
										type="button"
										className="gap-4 rounded-full bg-transparent p-6"
									>
										<Google.Color size={40} />
										<span>Continue with Google</span>
									</Button>
								</FormItem>
								<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
									Or with email
								</FieldSeparator>
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem data-invalid={!!errors.firstName}>
											<FormLabel>First name</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="John"
													autoFocus
													autoComplete="given-name"
													className="p-6 rounded-full"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem data-invalid={!!errors.lastName}>
											<FormLabel>Last name</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="Doe"
													autoComplete="family-name"
													className="p-6 rounded-full"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem data-invalid={!!errors.email}>
											<FormLabel>Email address</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="john.doe@example.com"
													autoComplete="email"
													className="p-6 rounded-full"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem data-invalid={!!errors.password}>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<PasswordInput
													autoComplete="new-password"
													className="p-6 rounded-full"
													{...field}
												/>
											</FormControl>
											{password && (
												<div className="space-y-1.5">
													<div className="flex gap-1">
														{[1, 2, 3, 4].map((i) => (
															<div
																key={i}
																className={cn(
																	"h-1 flex-1 rounded-full transition-all duration-300",
																	i <= score ? color : "bg-muted"
																)}
															/>
														))}
													</div>
													<p className="text-xs text-muted-foreground">{label}</p>
												</div>
											)}
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormItem>
									<Button
										type="button"
										onClick={handleNext}
										className="text-md p-6 rounded-full"
									>
										Continue
									</Button>
								</FormItem>
							</>
						) : (
							<>
								<button
									type="button"
									onClick={() => setStep(1)}
									className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									<ArrowLeft className="h-3.5 w-3.5" />
									Back
								</button>
								<FormField
									control={form.control}
									name="phone"
									render={({ field }) => (
										<FormItem data-invalid={!!errors.phone}>
											<FormLabel>Phone number</FormLabel>
											<FormControl>
												<Input
													type="tel"
													placeholder="+233201234567"
													autoFocus
													autoComplete="tel"
													className="p-6 rounded-full"
													{...field}
												/>
											</FormControl>
											<FormDescription>Include country code for delivery contact.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="isStudent"
									render={({ field }) => (
										<FormItem className="flex-row items-center justify-between rounded-lg border border-border/70 px-4 py-3">
											<div className="space-y-1">
												<FormLabel>I am a student</FormLabel>
												<FormDescription className="text-xs">
													Switch off if you are registering as a vendor or staff.
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value}
													onCheckedChange={(checked) => {
														const nextValue = checked === true
														field.onChange(nextValue)
														if (!nextValue) {
															form.setValue("studentEmail", "")
															form.setValue("studentId", "")
														}
													}}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								{isStudent && (
									<FormField
										control={form.control}
										name="studentEmail"
										render={({ field }) => (
											<FormItem data-invalid={!!errors.studentEmail}>
												<FormLabel>Student email (optional)</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="john.doe@university.edu.gh"
														autoComplete="email"
														className="p-6 rounded-full"
														{...field}
													/>
												</FormControl>
												<FormDescription>
													Add your student email to unlock student-only benefits.
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
								<FormField
									control={form.control}
									name="studentId"
									render={({ field }) => (
										<FormItem data-invalid={!!errors.studentId}>
											<FormLabel>Student ID</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder="UGBS123456"
													className="p-6 rounded-full"
													disabled={!isStudent}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="university"
									render={({ field }) => (
										<FormItem data-invalid={!!errors.university}>
											<FormLabel>University</FormLabel>
											<Select value={field.value} onValueChange={field.onChange}>
												<FormControl>
													<SelectTrigger className="h-12 w-full px-4">
														<SelectValue placeholder="Select university" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{universities.map((university) => (
														<SelectItem key={university} value={university}>
															{university}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="campus"
									render={({ field }) => (
										<FormItem data-invalid={!!errors.campus}>
											<FormLabel>Campus</FormLabel>
											<Select value={field.value} onValueChange={field.onChange}>
												<FormControl>
													<SelectTrigger className="h-12 w-full px-4">
														<SelectValue placeholder="Select campus" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{campuses.map((campus) => (
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
								<FormField
									control={form.control}
									name="agreeToTerms"
									render={({ field }) => (
										<FormItem className="flex-row items-start gap-3 rounded-lg  px-4 py-3">
											<FormControl>
												<div className="flex gap-4 space-y-1.5">
													<Checkbox
														checked={field.value}
														onCheckedChange={(checked) => field.onChange(checked === true)}
														className="mt-1 "
													/>
													<div className="font-normal">
														I agree to Varsity Mart&apos;s{" "}
														<Link href="/terms" className="text-primary underline-offset-2 hover:underline">
															Terms
														</Link>{" "}
														and{" "}
														<Link href="/privacy" className="text-primary underline-offset-2 hover:underline">
															Privacy Policy
														</Link>
													</div>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormItem>
									<Button
										type="submit"
										disabled={isSubmitting}
										className="text-md p-6"
									>
										Create account
									</Button>
								</FormItem>
							</>
						)}
						<FieldDescription className="text-center text-black dark:text-white">
							Already have an account?{" "}
							<Link href="/login" className="text-primary">
								Sign in
							</Link>
						</FieldDescription>
					</FieldGroup>
				</form>
			</Form>
		</AuthFormShell>
	)
}
