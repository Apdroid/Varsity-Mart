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
import { useUniversities, useCampusesByUniversity } from "@/hooks/queries/use-campus"
import { cn } from "@/lib/utils"
import { registerSchema, type RegisterSchema } from "@/lib/validation/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Google } from "@lobehub/icons"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type ComponentProps } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useAuth } from "@/providers/auth-provider"
import { getGoogleIdToken } from "@/lib/auth/google"

const STEP1_FIELDS: (keyof RegisterSchema)[] = ["firstName", "lastName", "email", "password"]

type RegisterMode = "choice" | "email"

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
	const [mode, setMode] = useState<RegisterMode>("choice")
	const [step, setStep] = useState(1)
	const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
	const router = useRouter()
	const { register, googleLogin } = useAuth()

	const { data: universities = [], isLoading: universitiesLoading } = useUniversities()

	const form = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		mode: "onBlur",
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			password: "",
			universityId: "",
			campusId: "",
			agreeToTerms: false,
			authMethod: "credentials",
			profilePic: "string",
		},
	})

	const { errors, isSubmitting } = form.formState
	const password = form.watch("password")
	const universityId = form.watch("universityId")
	const { score, label, color } = getPasswordStrength(password)

	const { data: campuses = [], isLoading: campusesLoading } = useCampusesByUniversity(universityId)

	const handleSubmit = async (values: RegisterSchema) => {
		const result = await register({
			firstName: values.firstName,
			lastName: values.lastName,
			email: values.email,
			phone: values.phone,
			password: values.password,
			confirmPassword: values.password,
			campus_id: values.campusId,
			agreeToTerms: values.agreeToTerms,
			authMethod: values.authMethod,
			profilePic: values.profilePic,
		})
		if (result.success) {
			toast.success("Account created! Please check your email to verify your account.")
			router.push("/verify-email")
			return
		}
		
		// Check if it's an email already exists error
		if (result.error?.includes("email already exists")) {
			form.setError("email", {
				type: "manual",
				message: result.error
			})
			setStep(1)
		} else {
			toast.error(result.error || "Registration failed")
		}
	}

	const handleNext = async () => {
		const valid = await form.trigger(STEP1_FIELDS)
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

			if (result.profileComplete === false) {
				toast.message("Almost done — complete your missing details.")
				router.push("/complete-profile")
				return
			}

			toast.success("Account ready! Signed in with Google.")
			router.push("/")
		} catch (err) {
			const message = err instanceof Error ? err.message : "Google sign-up failed"
			toast.error(message)
		} finally {
			setIsGoogleSubmitting(false)
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

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
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
											name="universityId"
											render={({ field }) => (
												<FormItem data-invalid={!!errors.universityId}>
													<FormLabel>University</FormLabel>
													<Select
														value={field.value}
														onValueChange={(val) => {
															field.onChange(val)
															form.setValue("campusId", "")
														}}
													>
														<FormControl>
															<SelectTrigger className="h-auto w-full rounded-full px-6 py-4">
																<SelectValue placeholder={universitiesLoading ? "Loading…" : "Select university"} />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{universities.map((u) => (
																<SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="campusId"
											render={({ field }) => (
												<FormItem data-invalid={!!errors.campusId}>
													<FormLabel>Campus</FormLabel>
													<Select
														value={field.value}
														onValueChange={field.onChange}
														disabled={!universityId || campusesLoading}
													>
														<FormControl>
															<SelectTrigger className="h-auto w-full rounded-full px-6 py-4">
																<SelectValue placeholder={campusesLoading ? "Loading…" : "Select campus"} />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{campuses.map((c) => (
																<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
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
												disabled={isSubmitting}
												className="text-md p-6"
											>
												{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
