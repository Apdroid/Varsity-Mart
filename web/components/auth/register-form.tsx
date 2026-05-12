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
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState, type ComponentProps } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useAuth } from "@/providers/auth-provider"
import { getGoogleIdToken } from "@/lib/auth/google"
import { useUpdateProfile } from "@/hooks/queries/use-user"
import type { User } from "@/lib/api/types"

const universities = [
	"University of Ghana",
	"KNUST",
	"University of Cape Coast",
	"Ashesi University",
] as const

const campuses = ["Legon", "Main Campus", "Kumasi", "Cape Coast", "Berekuso"] as const

const STEP1_FIELDS: (keyof RegisterSchema)[] = ["firstName", "lastName", "email", "password"]

type RegisterMode = "choice" | "email" | "google-complete"

type GoogleCompletionFormData = {
	firstName: string
	lastName: string
	phone: string
	university: string
	campus: string
	studentId: string
}

function hasValue(value?: string | null) {
	return Boolean(value && value.trim().length > 0)
}

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

function getMissingFlags(user: User | null) {
	return {
		firstName: !hasValue(user?.firstName),
		lastName: !hasValue(user?.lastName),
		phone: !hasValue(user?.phone),
		university: !hasValue(user?.university),
		campus: !hasValue(user?.campus),
		studentId: Boolean(user?.isStudent) && !hasValue(user?.studentId),
	}
}

export function RegisterForm({ className, ...props }: ComponentProps<"div">) {
	const [mode, setMode] = useState<RegisterMode>("choice")
	const [step, setStep] = useState(1)
	const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
	const [googleUser, setGoogleUser] = useState<User | null>(null)
	const router = useRouter()
	const { register, googleLogin, refreshUser } = useAuth()
	const updateProfileMutation = useUpdateProfile()

	const manualForm = useForm<RegisterSchema>({
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

	const googleCompletionForm = useForm<GoogleCompletionFormData>({
		mode: "onBlur",
		defaultValues: {
			firstName: "",
			lastName: "",
			phone: "",
			university: "University of Ghana",
			campus: "Legon",
			studentId: "",
		},
	})

	const missing = useMemo(() => getMissingFlags(googleUser), [googleUser])
	const manualErrors = manualForm.formState.errors
	const manualIsSubmitting = manualForm.formState.isSubmitting
	const isStudent = manualForm.watch("isStudent")
	const password = manualForm.watch("password")
	const { score, label, color } = getPasswordStrength(password)

	const handleManualSubmit = async (values: RegisterSchema) => {
		const result = await register({
			firstName: values.firstName,
			lastName: values.lastName,
			email: values.email,
			phone: values.phone,
			password: values.password,
			confirmPassword: values.password,
			studentId: values.studentId || undefined,
			isStudent: values.isStudent,
			university: values.university,
			campus: values.campus,
			agreeToTerms: values.agreeToTerms,
			authMethod: values.authMethod,
			profilePic: values.profilePic,
		})
		if (result.success) {
			toast.success("Account created! Please check your email to verify your account.")
			router.push("/verify-email")
			return
		}
		toast.error(result.error || "Registration failed")
	}

	const handleNext = async () => {
		const valid = await manualForm.trigger(STEP1_FIELDS)
		if (valid) setStep(2)
	}

	const handleGoogleContinue = async () => {
		const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
		if (!clientId) {
			toast.error("Google sign-in is not configured")
			return
		}

		setIsGoogleSubmitting(true)
		try {
			const idToken = await getGoogleIdToken(clientId)
			const result = await googleLogin(idToken)
			if (!result.success) {
				toast.error(result.error || "Google sign-up failed")
				return
			}

			const user = result.user ?? null
			setGoogleUser(user)
			googleCompletionForm.reset({
				firstName: user?.firstName || "",
				lastName: user?.lastName || "",
				phone: user?.phone || "",
				university: user?.university || "University of Ghana",
				campus: user?.campus || "Legon",
				studentId: user?.studentId || "",
			})

			const requiredMissing = getMissingFlags(user)
			const needsCompletion =
				result.profileComplete === false ||
				requiredMissing.firstName ||
				requiredMissing.lastName ||
				requiredMissing.phone ||
				requiredMissing.university ||
				requiredMissing.campus ||
				requiredMissing.studentId

			if (!needsCompletion) {
				toast.success("Account ready! Signed in with Google.")
				router.push("/")
				return
			}

			setMode("google-complete")
			toast.message("Almost done — complete your missing details.")
		} catch (err) {
			const message = err instanceof Error ? err.message : "Google sign-up failed"
			toast.error(message)
		} finally {
			setIsGoogleSubmitting(false)
		}
	}

	const handleGoogleCompletionSubmit = async (values: GoogleCompletionFormData) => {
		if (!googleUser) {
			toast.error("Google session not found. Please continue with Google again.")
			setMode("choice")
			return
		}

		const phone = values.phone.trim()
		const university = values.university.trim()
		const campus = values.campus.trim()

		if (missing.phone && phone.length < 8) {
			googleCompletionForm.setError("phone", { message: "Enter a valid phone number." })
			return
		}
		if (missing.university && !university) {
			googleCompletionForm.setError("university", { message: "Select your university." })
			return
		}
		if (missing.campus && !campus) {
			googleCompletionForm.setError("campus", { message: "Select your campus." })
			return
		}
		if (missing.studentId && values.studentId.trim().length < 3) {
			googleCompletionForm.setError("studentId", { message: "Student ID must be at least 3 characters." })
			return
		}

		try {
			await updateProfileMutation.mutateAsync({
				firstName: missing.firstName ? values.firstName.trim() : undefined,
				lastName: missing.lastName ? values.lastName.trim() : undefined,
				phone: missing.phone ? phone : undefined,
				university: missing.university ? university : undefined,
				campus: missing.campus ? campus : undefined,
				studentId: missing.studentId ? values.studentId.trim() : undefined,
			})
			await refreshUser()
			toast.success("Profile completed successfully.")
			router.push("/")
		} catch {
			toast.error("Failed to complete profile")
		}
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
			{mode === "choice" ? (
				<div className="mt-6 flex animate-in fade-in flex-col gap-4 duration-200">
					<Button
						variant="outline"
						type="button"
						onClick={handleGoogleContinue}
						disabled={isGoogleSubmitting}
						className="gap-4 rounded-full border-none p-6 outline-none"
					>
						{isGoogleSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Google.Color size={40} />}
						<span>Continue with Google</span>
					</Button>
					<Button
						type="button"
						onClick={() => setMode("email")}
						className="gap-3 rounded-full p-6 text-base"
					>
						<Mail className="h-5 w-5" />
						<span>Sign up with email</span>
					</Button>
					<FieldDescription className="mt-2 text-center text-black dark:text-white">
						Already have an account?{" "}
						<Link href="/login" className="text-primary">
							Sign in
						</Link>
					</FieldDescription>
				</div>
			) : mode === "google-complete" ? (
				<Form {...googleCompletionForm}>
					<form
						onSubmit={googleCompletionForm.handleSubmit(handleGoogleCompletionSubmit)}
						noValidate
						className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-200"
					>
						<FieldGroup>
							<button
								type="button"
								onClick={() => setMode("choice")}
								className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<ArrowLeft className="h-3.5 w-3.5" />
								Back
							</button>
							{missing.firstName && (
								<FormField
									control={googleCompletionForm.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First name</FormLabel>
											<FormControl>
												<Input autoFocus className="rounded-full p-6" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							{missing.lastName && (
								<FormField
									control={googleCompletionForm.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last name</FormLabel>
											<FormControl>
												<Input className="rounded-full p-6" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							{missing.phone && (
								<FormField
									control={googleCompletionForm.control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone number</FormLabel>
											<FormControl>
												<Input type="tel" placeholder="+233201234567" className="rounded-full p-6" {...field} />
											</FormControl>
											<FormDescription>Used for delivery updates and order contact.</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							{missing.university && (
								<FormField
									control={googleCompletionForm.control}
									name="university"
									render={({ field }) => (
										<FormItem>
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
							)}
							{missing.campus && (
								<FormField
									control={googleCompletionForm.control}
									name="campus"
									render={({ field }) => (
										<FormItem>
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
							)}
							{missing.studentId && (
								<FormField
									control={googleCompletionForm.control}
									name="studentId"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Student ID</FormLabel>
											<FormControl>
												<Input placeholder="UGBS123456" className="rounded-full p-6" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<FormItem>
								<Button type="submit" disabled={updateProfileMutation.isPending} className="p-6 text-base rounded-full">
									{updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Complete profile
								</Button>
							</FormItem>
						</FieldGroup>
					</form>
				</Form>
			) : (
				<>
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

					<Form {...manualForm}>
						<form
							onSubmit={manualForm.handleSubmit(handleManualSubmit)}
							noValidate
							className="mt-4"
						>
							<FieldGroup>
								{step === 1 ? (
									<>
										<button
											type="button"
											onClick={() => setMode("choice")}
											className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
										>
											<ArrowLeft className="h-3.5 w-3.5" />
											All sign-up options
										</button>
										<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
											Sign up with email
										</FieldSeparator>
										<FormField
											control={manualForm.control}
											name="firstName"
											render={({ field }) => (
												<FormItem data-invalid={!!manualErrors.firstName}>
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
											control={manualForm.control}
											name="lastName"
											render={({ field }) => (
												<FormItem data-invalid={!!manualErrors.lastName}>
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
											control={manualForm.control}
											name="email"
											render={({ field }) => (
												<FormItem data-invalid={!!manualErrors.email}>
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
											control={manualForm.control}
											name="password"
											render={({ field }) => (
												<FormItem data-invalid={!!manualErrors.password}>
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
											control={manualForm.control}
											name="phone"
											render={({ field }) => (
												<FormItem data-invalid={!!manualErrors.phone}>
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
											control={manualForm.control}
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
																	manualForm.setValue("studentEmail", "")
																	manualForm.setValue("studentId", "")
																}
															}}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										{isStudent && (
											<FormField
												control={manualForm.control}
												name="studentEmail"
												render={({ field }) => (
													<FormItem data-invalid={!!manualErrors.studentEmail}>
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
											control={manualForm.control}
											name="studentId"
											render={({ field }) => (
												<FormItem data-invalid={!!manualErrors.studentId}>
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
											control={manualForm.control}
											name="university"
											render={({ field }) => (
												<FormItem data-invalid={!!manualErrors.university}>
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
											control={manualForm.control}
											name="campus"
											render={({ field }) => (
												<FormItem data-invalid={!!manualErrors.campus}>
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
											control={manualForm.control}
											name="agreeToTerms"
											render={({ field }) => (
												<FormItem className="flex-row items-start gap-3 rounded-lg px-4 py-3">
													<FormControl>
														<div className="flex gap-4 space-y-1.5">
															<Checkbox
																checked={field.value}
																onCheckedChange={(checked) => field.onChange(checked === true)}
																className="mt-1"
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
												disabled={manualIsSubmitting}
												className="text-md p-6"
											>
												{manualIsSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
				</>
			)}
		</AuthFormShell>
	)
}
