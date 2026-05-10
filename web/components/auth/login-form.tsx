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
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import PasswordInput from "../ui/password-input"

export function LoginForm({ className, ...props }: ComponentProps<"div">) {
	const [emailMode, setEmailMode] = useState(false)

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		mode: "onBlur",
		defaultValues: {
			email: "",
			password: "",
		},
	})
	const { errors, isSubmitting } = form.formState

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
					<Button
						variant="outline"
						type="button"
						className="gap-4 p-6 outline-none border-none rounded-full"
					>
						<Google.Color size={40} />
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
						onSubmit={form.handleSubmit(() => {})}
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
