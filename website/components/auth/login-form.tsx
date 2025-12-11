"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema } from "@/data/auth/login-schema";

export function LoginForm() {
	const router = useRouter();
	const { setIsAuthenticated } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
	});

	const onSubmit = async (data: { email: string; password: string; rememberMe: boolean }) => {
		setIsLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setIsLoading(false);
		setIsAuthenticated(true);
		router.push("/account");
	};

	const handleGoogleAuth = () => {
		// Handle Google OAuth
		console.log("Google auth clicked");
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4 lg:p-0">
			<div className="w-full max-w-6xl">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl lg:rounded-none overflow-hidden shadow-2xl lg:shadow-none">
					{/* Left side - Image */}
					<div className="hidden lg:flex flex-col justify-between bg-slate-900 relative overflow-hidden h-screen sticky top-0">
						{/* Background image */}
						<div className="absolute inset-0 z-0">
							<Image
								src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1200&fit=crop"
								alt="Students studying"
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
									Welcome back! Sign in to continue
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
					</div>

					{/* Right side - Form */}
					<div className="bg-background flex flex-col justify-center min-h-screen lg:min-h-auto lg:h-screen overflow-y-auto">
						<div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
							<div className="w-full max-w-md">
								{/* Mobile header */}
								<div className="lg:hidden mb-8">
									<h1 className="text-3xl font-black text-foreground mb-1">
										VarsityMart
									</h1>
									<p className="text-muted-foreground text-sm">Sign in to your account</p>
								</div>

								<Card className="border-border shadow-lg">
									<CardHeader className="space-y-1">
										<CardTitle className="text-2xl font-bold text-foreground">
											Welcome back
										</CardTitle>
										<CardDescription className="text-muted-foreground">
											Enter your credentials to access your account
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Form {...form}>
											<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
												{/* Google OAuth */}
												<Button
													type="button"
													onClick={handleGoogleAuth}
													variant="outline"
													className="w-full h-11 text-base font-semibold border-2 border-border hover:bg-accent transition-all rounded-lg"
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
														<Separator />
													</div>
													<div className="relative flex justify-center">
														<span className="px-3 bg-background text-xs text-muted-foreground font-semibold">
															OR
														</span>
													</div>
												</div>

												{/* Email Field */}
												<FormField
													control={form.control}
													name="email"
													render={({ field }) => (
														<FormItem>
															<FormLabel className="text-foreground font-semibold text-sm">
																Email address
															</FormLabel>
															<FormControl>
																<div className="relative group">
																	<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
																	<Input
																		{...field}
																		type="email"
																		placeholder="you@campus.edu"
																		className="pl-12 h-11 rounded-lg border-border focus:border-primary focus:ring-primary/20 transition-all"
																		autoFocus
																	/>
																</div>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												{/* Password Field */}
												<FormField
													control={form.control}
													name="password"
													render={({ field }) => (
														<FormItem>
															<div className="flex items-center justify-between">
																<FormLabel className="text-foreground font-semibold text-sm">
																	Password
																</FormLabel>
																<Link
																	href="/auth/forgot-password"
																	className="text-sm text-primary hover:text-primary/80 transition-colors"
																>
																	Forgot password?
																</Link>
															</div>
															<FormControl>
																<div className="relative group">
																	<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
																	<Input
																		{...field}
																		type={showPassword ? "text" : "password"}
																		placeholder="Enter your password"
																		className="pl-12 pr-12 h-11 rounded-lg border-border focus:border-primary focus:ring-primary/20 transition-all"
																	/>
																	<Button
																		type="button"
																		variant="ghost"
																		size="icon"
																		className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
																		onClick={() => setShowPassword(!showPassword)}
																	>
																		{showPassword ? (
																			<EyeOff className="h-4 w-4 text-muted-foreground" />
																		) : (
																			<Eye className="h-4 w-4 text-muted-foreground" />
																		)}
																	</Button>
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
														<FormItem>
															<div className="flex items-center gap-2">
																<FormControl>
																	<Checkbox
																		checked={field.value}
																		onCheckedChange={field.onChange}
																	/>
																</FormControl>
																<FormLabel className="text-sm font-normal cursor-pointer text-muted-foreground">
																	Remember me for 30 days
																</FormLabel>
															</div>
														</FormItem>
													)}
												/>

												{/* Submit Button */}
												<Button
													type="submit"
													className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 transition-colors rounded-lg"
													disabled={isLoading}
												>
													{isLoading ? (
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
										<div className="mt-6 text-center text-sm text-muted-foreground">
											Don&apos;t have an account?{" "}
											<Link
												href="/auth/register"
												className="text-primary hover:text-primary/80 font-semibold transition-colors"
											>
												Sign up
											</Link>
										</div>
									</CardContent>
								</Card>

								{/* Footer */}
								<div className="mt-8 text-center">
									<p className="text-xs text-muted-foreground">
										🔒 Your data is encrypted and secure
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
