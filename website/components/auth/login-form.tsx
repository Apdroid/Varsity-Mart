"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Loader2, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { authService } from "@/lib/api/services/auth.service";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get("redirect");
	
	const { login, isLoggingIn, loginError } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [isGoogleLoading, setIsGoogleLoading] = useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		try {
			login(data);
		} catch (error) {
			// Error handling is managed by the useAuth hook
		}
	};

	const handleGoogleAuth = () => {
		setIsGoogleLoading(true);
		window.location.href = authService.getGoogleAuthUrl();
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
							<h2 className="text-4xl font-bold text-foreground">
								Welcome Back!
							</h2>
							<p className="text-lg text-muted-foreground max-w-md">
								Sign in to continue shopping, selling, and connecting with your campus community.
							</p>
						</div>

						{/* Features */}
						<div className="space-y-3">
							{[
								"Access your orders and listings",
								"Chat with buyers and sellers",
								"Get personalized deals",
							].map((feature, i) => (
								<div key={i} className="flex items-center gap-3">
									<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary">
										<Check className="h-4 w-4" />
									</div>
									<span className="text-foreground">{feature}</span>
								</div>
							))}
						</div>
					</div>

					{/* Bottom Quote */}
					<div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
						<p className="text-foreground italic">
							"The easiest way to buy and sell on campus. Love how quick transactions are!"
						</p>
						<div className="mt-4 flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
								<User className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="font-medium text-sm">Michael A.</p>
								<p className="text-xs text-muted-foreground">KNUST</p>
							</div>
						</div>
					</div>
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
						{/* Header */}
						<div className="text-center mb-8">
							<h1 className="text-2xl font-bold">Welcome back</h1>
							<p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue</p>
						</div>

						{/* Google OAuth Button */}
						<Button
							type="button"
							variant="outline"
							className="w-full h-12 mb-6"
							onClick={handleGoogleAuth}
							disabled={isGoogleLoading || isLoggingIn}
						>
							{isGoogleLoading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<>
									<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
										<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
										<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
										<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
										<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
									</svg>
									Continue with Google
								</>
							)}
						</Button>

						<div className="relative mb-6">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-border" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">or continue with email</span>
							</div>
						</div>

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-5">
								{loginError && (
									<div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg">
										{(loginError as any)?.response?.data?.message || "Invalid email or password"}
									</div>
								)}

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
													className="h-12"
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
														className="h-12 pr-10"
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
										<FormItem className="flex items-center gap-3">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
													disabled={isLoggingIn}
													className="h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal cursor-pointer !mt-0">
												Remember me for 30 days
											</FormLabel>
										</FormItem>
									)}
								/>

								{/* Submit */}
								<Button type="submit" className="w-full h-12" disabled={isLoggingIn}>
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
							<Link
								href={`/auth/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
								className="text-primary font-medium hover:underline"
							>
								Create account
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
