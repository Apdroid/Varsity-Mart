"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { useAuth } from "@/hooks/queries/useAuth";
import { authService } from "@/lib/api/services/auth.service";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email"),
	password: z.string().min(1, "Password is required"),
	rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
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
		login(data);
	};

	const handleGoogleAuth = () => {
		setIsGoogleLoading(true);
		window.location.href = authService.getGoogleAuthUrl();
	};

	return (
		<div className="min-h-screen flex">
			{/* Left Side - Illustration Panel */}
			<div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
				{/* Decorative background pattern */}
				<div className="absolute inset-0 opacity-30">
					<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<pattern id="grid-login" width="40" height="40" patternUnits="userSpaceOnUse">
								<circle cx="20" cy="20" r="1" className="fill-primary/20" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid-login)" />
					</svg>
				</div>

				<div className="relative z-10 flex flex-col justify-between p-8 xl:p-12 w-full">
					{/* Logo */}
					<Link href="/" className="inline-flex items-center gap-2.5 text-foreground hover:text-primary transition-colors w-fit group">
						<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
							<ShoppingBag className="h-5 w-5" />
						</div>
						<span className="font-bold text-xl tracking-tight">VarsityMart</span>
					</Link>

					{/* Center - Illustration & Content */}
					<div className="flex-1 flex flex-col items-center justify-center py-8">
						{/* Student Campus Illustration */}
						<svg viewBox="0 0 500 400" className="w-full max-w-md" fill="none" xmlns="http://www.w3.org/2000/svg">
							{/* Background circles */}
							<circle cx="250" cy="200" r="150" className="fill-primary/10" />
							<circle cx="400" cy="320" r="60" className="fill-primary/5" />
							<circle cx="80" cy="80" r="45" className="fill-primary/5" />
							
							{/* Campus Building */}
							<g transform="translate(280, 140)">
								<rect x="0" y="40" width="120" height="100" className="fill-card stroke-border" strokeWidth="2" />
								<polygon points="60,0 120,40 0,40" className="fill-primary/20 stroke-primary/40" strokeWidth="2" />
								{/* Windows */}
								<rect x="15" y="55" width="25" height="30" rx="2" className="fill-primary/20" />
								<rect x="50" y="55" width="25" height="30" rx="2" className="fill-primary/20" />
								<rect x="85" y="55" width="20" height="30" rx="2" className="fill-primary/20" />
								{/* Door */}
								<rect x="45" y="100" width="30" height="40" rx="3" className="fill-primary/30" />
								{/* Flag */}
								<line x1="60" y1="0" x2="60" y2="-20" className="stroke-foreground" strokeWidth="2" />
								<rect x="60" y="-20" width="20" height="12" className="fill-primary" />
							</g>
							
							{/* Student with backpack */}
							<g transform="translate(120, 180)">
								{/* Backpack */}
								<rect x="35" y="50" width="35" height="45" rx="8" className="fill-primary/40" />
								<rect x="40" y="55" width="25" height="10" rx="3" className="fill-primary/60" />
								{/* Body */}
								<path d="M50 85 L50 140" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
								{/* Arms */}
								<path d="M50 100 L25 115" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
								<path d="M50 100 L75 120" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
								{/* Legs - Walking */}
								<path d="M50 140 L35 180" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
								<path d="M50 140 L70 175" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
								{/* Head */}
								<circle cx="50" cy="60" r="25" className="fill-primary/20 stroke-foreground" strokeWidth="3" />
								{/* Face */}
								<circle cx="42" cy="57" r="3" className="fill-foreground" />
								<circle cx="58" cy="57" r="3" className="fill-foreground" />
								<path d="M42 68 Q50 75 58 68" className="stroke-foreground" strokeWidth="2" fill="none" strokeLinecap="round" />
								{/* Hair/Cap */}
								<path d="M30 50 Q50 35 70 50" className="stroke-foreground" strokeWidth="3" fill="none" />
							</g>
							
							{/* Shopping items floating */}
							<g className="animate-pulse" style={{ animationDuration: "2.5s" }}>
								{/* Book */}
								<rect x="350" y="280" width="35" height="45" rx="3" className="fill-primary/30 stroke-primary/50" strokeWidth="2" />
								<line x1="355" y1="290" x2="380" y2="290" className="stroke-primary/50" strokeWidth="2" />
								<line x1="355" y1="300" x2="375" y2="300" className="stroke-primary/40" strokeWidth="2" />
							</g>
							
							{/* Coffee cup */}
							<g transform="translate(90, 300)">
								<rect x="0" y="10" width="30" height="35" rx="3" className="fill-primary/20 stroke-primary/40" strokeWidth="2" />
								<path d="M30 18 Q45 20 45 30 Q45 40 30 42" className="stroke-primary/40" strokeWidth="2" fill="none" />
								<path d="M8 5 Q15 0 22 5" className="stroke-primary/30" strokeWidth="2" fill="none" />
							</g>
							
							{/* Login Arrow */}
							<g transform="translate(200, 300)">
								<circle cx="25" cy="25" r="25" className="fill-primary/20" />
								<path d="M15 25 L35 25 M28 18 L35 25 L28 32" className="stroke-primary" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
							</g>
						</svg>
						
						<div className="mt-8 text-center max-w-md">
							<h2 className="text-2xl xl:text-3xl font-bold text-foreground mb-3">
								Welcome Back, Scholar!
							</h2>
							<p className="text-muted-foreground">
								Sign in to continue your campus marketplace journey.
							</p>
						</div>

						{/* Feature list */}
						<div className="mt-8 space-y-3">
							{[
								"Access your orders and listings",
								"Chat with buyers and sellers",
								"Get personalized campus deals",
							].map((feature) => (
								<div key={feature} className="flex items-center gap-3 text-sm">
									<div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary">
										<Check className="w-3 h-3" />
									</div>
									<span className="text-foreground">{feature}</span>
								</div>
							))}
						</div>
					</div>

					{/* Bottom - Stats */}
					<div className="flex items-center justify-center gap-8 text-center">
						<div>
							<p className="text-2xl font-bold text-primary">10K+</p>
							<p className="text-xs text-muted-foreground">Active Students</p>
						</div>
						<div className="w-px h-8 bg-border" />
						<div>
							<p className="text-2xl font-bold text-primary">50+</p>
							<p className="text-xs text-muted-foreground">Universities</p>
						</div>
						<div className="w-px h-8 bg-border" />
						<div>
							<p className="text-2xl font-bold text-primary">100K+</p>
							<p className="text-xs text-muted-foreground">Items Traded</p>
						</div>
					</div>
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="flex-1 flex flex-col min-h-screen bg-background">
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
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
								{loginError && (
									<div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg">
										{(loginError as any)?.response?.data?.message || "Invalid email or password"}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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
								<FormLabel className="text-sm font-normal !mt-0">Remember me</FormLabel>
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={isLoggingIn}>
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

			<p className="mt-4 text-center text-sm text-muted-foreground">
				Don't have an account?{" "}
				<Link
					href={`/auth/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
					className="text-primary hover:underline"
				>
					Create account
				</Link>
			</p>
		</AuthLayout>
	);
}
