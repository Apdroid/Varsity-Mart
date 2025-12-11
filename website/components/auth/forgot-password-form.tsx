"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/data/auth/forgot-password-schema";

export function ForgotPasswordForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const form = useForm({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: { email: string }) => {
		setIsLoading(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setIsLoading(false);
		setIsSubmitted(true);
	};

	if (isSubmitted) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4 lg:p-0">
				<div className="w-full max-w-6xl">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl lg:rounded-none overflow-hidden shadow-2xl lg:shadow-none">
						{/* Left side - Image */}
						<div className="hidden lg:flex flex-col justify-between bg-card dark:bg-card relative overflow-hidden h-screen sticky top-0">
							<div className="absolute inset-0 z-0">
								<Image
									src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1200&fit=crop"
									alt="Students studying"
									fill
									className="object-cover opacity-50"
									priority
								/>
								<div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/50 to-foreground/70 dark:from-foreground/40 dark:via-foreground/60 dark:to-foreground/80"></div>
							</div>

							<div className="relative z-10 p-12 space-y-8">
								<div>
									<h1 className="text-5xl font-black text-card-foreground mb-2">
										VarsityMart
									</h1>
									<p className="text-xl text-card-foreground/80 font-light">
										Check your email
									</p>
								</div>
							</div>
						</div>

						{/* Right side - Success Message */}
						<div className="bg-background flex flex-col justify-center min-h-screen lg:min-h-auto lg:h-screen overflow-y-auto">
							<div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
								<div className="w-full max-w-md">
									<Card className="border-border shadow-lg">
										<CardHeader className="space-y-1 text-center">
											<div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
												<Mail className="w-8 h-8 text-primary" />
											</div>
											<CardTitle className="text-2xl font-bold text-foreground">
												Check your email
											</CardTitle>
											<CardDescription className="text-muted-foreground">
												We&apos;ve sent a password reset link to{" "}
												<span className="font-semibold text-foreground">
													{form.getValues("email")}
												</span>
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<p className="text-sm text-muted-foreground text-center">
												Click the link in the email to reset your password. If
												you don&apos;t see it, check your spam folder.
											</p>

											<div className="pt-4 space-y-3">
												<Button
													onClick={() => {
														setIsSubmitted(false);
														form.reset();
													}}
													variant="outline"
													className="w-full h-11 text-base font-semibold border-2 border-border hover:bg-accent transition-all rounded-lg"
												>
													Resend email
												</Button>

												<Link href="/auth/login">
													<Button
														variant="ghost"
														className="w-full h-11 text-base font-semibold text-primary hover:text-primary/80 transition-colors"
													>
														<ArrowLeft className="w-4 h-4 mr-2" />
														Back to login
													</Button>
												</Link>
											</div>
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4 lg:p-0">
			<div className="w-full max-w-6xl">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl lg:rounded-none overflow-hidden shadow-2xl lg:shadow-none">
					{/* Left side - Image */}
					<div className="hidden lg:flex flex-col justify-between bg-card dark:bg-card relative overflow-hidden h-screen sticky top-0">
						{/* Background image */}
						<div className="absolute inset-0 z-0">
							<Image
								src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1200&fit=crop"
								alt="Students studying"
								fill
								className="object-cover opacity-50"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/50 to-foreground/70 dark:from-foreground/40 dark:via-foreground/60 dark:to-foreground/80"></div>
						</div>

						{/* Content overlay */}
						<div className="relative z-10 p-12 space-y-8">
							<div>
								<h1 className="text-5xl font-black text-card-foreground mb-2">
									VarsityMart
								</h1>
								<p className="text-xl text-card-foreground/80 font-light">
									Reset your password
								</p>
							</div>

							{/* Stats */}
							<div className="space-y-4">
								<div className="border-l-4 border-card-foreground pl-4">
									<p className="text-4xl font-black text-card-foreground">50K+</p>
									<p className="text-card-foreground/70 text-sm mt-1">
										Active Students
									</p>
								</div>
								<div className="border-l-4 border-card-foreground pl-4">
									<p className="text-4xl font-black text-card-foreground">10K+</p>
									<p className="text-card-foreground/70 text-sm mt-1">
										Quality Products
									</p>
								</div>
								<div className="border-l-4 border-card-foreground pl-4">
									<p className="text-4xl font-black text-card-foreground">
										Verified
									</p>
									<p className="text-card-foreground/70 text-sm mt-1">
										100% Secure
									</p>
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
									<p className="text-muted-foreground text-sm">
										Reset your password
									</p>
								</div>

								<Card className="border-border shadow-lg">
									<CardHeader className="space-y-1">
										<CardTitle className="text-2xl font-bold text-foreground">
											Forgot password?
										</CardTitle>
										<CardDescription className="text-muted-foreground">
											Enter your email address and we&apos;ll send you a link to
											reset your password
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Form {...form}>
											<form
												onSubmit={form.handleSubmit(onSubmit)}
												className="space-y-4"
											>
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

												{/* Submit Button */}
												<Button
													type="submit"
													className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 transition-colors rounded-lg text-primary-foreground"
													disabled={isLoading}
												>
													{isLoading ? (
														<>
															<Loader2 className="mr-2 h-4 w-4 animate-spin" />
															Sending...
														</>
													) : (
														"Send reset link"
													)}
												</Button>
											</form>
										</Form>

										{/* Back to login link */}
										<div className="mt-6 text-center">
											<Link
												href="/auth/login"
												className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors inline-flex items-center gap-2"
											>
												<ArrowLeft className="w-4 h-4" />
												Back to login
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

