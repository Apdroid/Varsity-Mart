"use client"
import { AuthFormShell } from "@/components/auth/auth-form-shell"
import { Button } from "@/components/ui/button"
import { FieldDescription, FieldGroup } from "@/components/ui/field"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Google } from "@lobehub/icons"
import { Input } from "@/components/ui/input"
import { loginSchema, type LoginSchema } from "@/lib/validation/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GoogleLogin } from "@react-oauth/google"
import type { ComponentProps } from "react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import PasswordInput from "../ui/password-input"
import { useAuth } from "@/providers/auth-provider"

export function LoginForm({ className, ...props }: ComponentProps<"div">) {
	const [emailMode, setEmailMode] = useState(false)
	const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
	const googleBtnRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const { googleLogin, login } = useAuth()

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
		defaultValues: {
			email: "",
			password: "",
		},
	})
	const { errors, isSubmitting } = form.formState

	const onSubmit = async (data: LoginSchema) => {
		const result = await login(data)
		if (result.success) {
			toast.success("Welcome back!")
			router.push("/")
		} else {
			toast.error(result.error || "Login failed")
		}
	}

	const handleGoogleSignIn = () => {
		googleBtnRef.current?.querySelector<HTMLElement>("div[role='button']")?.click()
	}

	const handleGoogleSuccess = async (credential: string) => {
		setIsGoogleSubmitting(true)
		try {
			const result = await googleLogin(credential)
			if (!result.success) {
				toast.error(result.error || "Google sign-in failed")
				return
			}
			toast.success("Signed in with Google")
			if (result.profileComplete === false) {
				router.push("/complete-profile")
				return
			}
			router.push("/")
		} catch (err) {
			const message = err instanceof Error ? err.message : "Google sign-in failed"
			toast.error(message)
		} finally {
			setIsGoogleSubmitting(false)
		}
	}

	return (
		<AuthFormShell
			className={className}
			title="Welcome back"
			description={
				<>
					Sign in to your{" "}
					<b className="font-bold text-black dark:text-primary">Varsity Mart</b>{" "}
					account
				</>
			}
			{...props}
		>
			{!emailMode ? (
				<div className="mt-6 flex animate-in fade-in flex-col gap-4 duration-200">
					<div ref={googleBtnRef} className="hidden">
						<GoogleLogin
							onSuccess={(res) => {
								if (res.credential) handleGoogleSuccess(res.credential)
							}}
							onError={() => {
								toast.error("Google sign-in failed")
								setIsGoogleSubmitting(false)
							}}
						/>
					</div>
					<Button
						variant="outline"
						type="button"
						onClick={handleGoogleSignIn}
						disabled={isGoogleSubmitting}
						className="bg-vm-platinum border-border  gap-4 p-6  rounded-full"
					>
						{isGoogleSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Google.Color size={40} />}
						<span>Continue with Google</span>
					</Button>
					<Button
						type="button"
						onClick={() => setEmailMode(true)}
						className="gap-3 p-6 text-base rounded-full"
					>
						<Mail className="h-5 w-5" />
						<span>Sign in with email</span>
					</Button>
					<FieldDescription className="mt-2 text-center text-black dark:text-white">
						Don&apos;t have an account?{" "}
						<Link href="/register" className="text-primary">
							Sign up
						</Link>
					</FieldDescription>
				</div>
			) : (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						noValidate
						className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-200"
					>
						<FieldGroup>
							<button
								type="button"
								onClick={() => setEmailMode(false)}
								className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								<ArrowLeft className="h-3.5 w-3.5" />
								All sign-in options
							</button>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem data-invalid={!!errors.email}>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="john.doe@university.edu.gh"
												className="bg-accent rounded-full border-none p-6"
												autoComplete="email"
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
										<div className="flex items-center">
											<FormLabel>Password</FormLabel>
											<Link
												href="/forgot"
												className="ml-auto text-sm text-primary underline-offset-2 transition-all ease-linear hover:underline dark:text-primary"
											>
												Forgot password?
											</Link>
										</div>
										<FormControl>
											<PasswordInput autoComplete="current-password" className="rounded-full" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormItem>
								<Button
									type="submit"
									disabled={isSubmitting}
									className="text-base p-6 rounded-full"
								>
									{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Sign in
								</Button>
							</FormItem>
							<FieldDescription className="text-center text-black dark:text-white">
								Don&apos;t have an account?{" "}
								<Link href="/register" className="text-primary">
									Sign up
								</Link>
							</FieldDescription>
						</FieldGroup>
					</form>
				</Form>
			)}
		</AuthFormShell>
	)
}
