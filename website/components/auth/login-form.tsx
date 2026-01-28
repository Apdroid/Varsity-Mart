"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AuthLayout } from "@/components/auth/auth-layout";
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
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
	const router = useRouter();
	const { login, isLoggingIn, loginError } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		login(data);
	};

	// const handleGoogleAuth = async () => {
	// 	setIsLoading(true);
	// 	try {
	// 		// Simulate Google OAuth
	// 		await new Promise((resolve) => setTimeout(resolve, 1000));
	// 		setIsAuthenticated(true);
	// 		router.push("/account");
	// 	} catch (error) {
	// 		console.error(error);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	return (
		<AuthLayout
			title="Welcome back"
			description="Sign in to your account to continue"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-5">
					{loginError && (
						<div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
							{(loginError as any)?.response?.data?.message || "Invalid email or password"}
						</div>
					)}
					{/* Google Sign In */}
					{/*<Button*/}
					{/*	type="button"*/}
					{/*	variant="outline"*/}
					{/*	className="w-full h-11 font-medium"*/}
					{/*	onClick={handleGoogleAuth}*/}
					{/*	disabled={isLoading}*/}
					{/*>*/}
					{/*	<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">*/}
					{/*		<path*/}
					{/*			fill="#4285F4"*/}
					{/*			d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"*/}
					{/*		/>*/}
					{/*		<path*/}
					{/*			fill="#34A853"*/}
					{/*			d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"*/}
					{/*		/>*/}
					{/*		<path*/}
					{/*			fill="#FBBC05"*/}
					{/*			d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"*/}
					{/*		/>*/}
					{/*		<path*/}
					{/*			fill="#EA4335"*/}
					{/*			d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"*/}
					{/*		/>*/}
					{/*	</svg>*/}
					{/*	Continue with Google*/}
					{/*</Button>*/}

					{/* Divider */}
					{/*<div className="relative">*/}
					{/*	<div className="absolute inset-0 flex items-center">*/}
					{/*		<span className="w-full border-t border-border" />*/}
					{/*	</div>*/}
					{/*	<div className="relative flex justify-center text-xs uppercase">*/}
					{/*		<span className="bg-card px-2 text-muted-foreground">or</span>*/}
					{/*	</div>*/}
					{/*</div>*/}

					{/* Email */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="you@university.edu"
										autoComplete="email"
										disabled={isLoggingIn}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Password */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between">
									<FormLabel>Password</FormLabel>
									<Link
										href="/auth/forgot-password"
										className="text-xs text-primary hover:underline"
									>
										Forgot password?
									</Link>
								</div>
								<FormControl>
									<div className="relative">
										<Input
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											autoComplete="current-password"
											disabled={isLoggingIn}
											{...field}
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Remember Me */}
					<FormField
						control={form.control}
						name="rememberMe"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={isLoggingIn}
									/>
								</FormControl>
								<FormLabel className="text-sm font-normal cursor-pointer !mt-0">
									Remember me for 30 days
								</FormLabel>
							</FormItem>
						)}
					/>

					{/* Submit */}
					<Button type="submit" className="w-full h-11" disabled={isLoggingIn}>
						{isLoggingIn ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Signing in...
							</>
						) : (
							"Sign in"
						)}
					</Button>
				</form>
			</Form>

			{/* Sign up link */}
			<p className="mt-6 text-center text-sm text-muted-foreground">
				Don't have an account?{" "}
				<Link href="/auth/register" className="text-primary font-medium hover:underline">
					Create account
				</Link>
			</p>
		</AuthLayout>
	);
}
