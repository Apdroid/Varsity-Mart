"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	description: string;
	className?: string;
	variant?: "login" | "register" | "forgot" | "verify" | "reset";
}

function StudentIllustration({ variant }: { variant: string }) {
	if (variant === "register") {
		return (
			<svg viewBox="0 0 500 400" className="w-full max-w-md" fill="none" xmlns="http://www.w3.org/2000/svg">
				{/* Background Elements */}
				<circle cx="250" cy="200" r="150" className="fill-primary/10" />
				<circle cx="380" cy="80" r="40" className="fill-primary/5" />
				<circle cx="100" cy="320" r="30" className="fill-primary/5" />
				
				{/* Floating Books */}
				<g className="animate-pulse" style={{ animationDuration: "3s" }}>
					<rect x="60" y="100" width="50" height="65" rx="3" className="fill-primary/20" />
					<rect x="63" y="103" width="44" height="4" rx="1" className="fill-primary/40" />
					<rect x="63" y="112" width="35" height="3" rx="1" className="fill-primary/30" />
				</g>
				
				{/* Student Figure - Celebrating */}
				<g>
					{/* Body */}
					<path d="M250 280 L250 340" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
					{/* Arms Up - Celebrating */}
					<path d="M250 300 L210 260" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
					<path d="M250 300 L290 260" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
					{/* Legs */}
					<path d="M250 340 L230 380" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
					<path d="M250 340 L270 380" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
					{/* Head */}
					<circle cx="250" cy="255" r="28" className="fill-primary/20 stroke-foreground" strokeWidth="3" />
					{/* Happy Face */}
					<circle cx="240" cy="252" r="3" className="fill-foreground" />
					<circle cx="260" cy="252" r="3" className="fill-foreground" />
					<path d="M240 265 Q250 275 260 265" className="stroke-foreground" strokeWidth="2" fill="none" strokeLinecap="round" />
					{/* Graduation Cap */}
					<path d="M220 240 L250 225 L280 240 L250 255 Z" className="fill-primary" />
					<rect x="248" y="220" width="4" height="15" className="fill-primary" />
					<circle cx="250" cy="218" r="5" className="fill-primary" />
				</g>
				
				{/* Shopping Bag */}
				<g transform="translate(330, 280)">
					<rect x="0" y="15" width="45" height="50" rx="5" className="fill-primary/80" />
					<path d="M10 15 L10 5 Q22.5 -5 35 5 L35 15" className="stroke-primary-foreground" strokeWidth="3" fill="none" />
					<circle cx="22.5" cy="40" r="8" className="fill-primary-foreground/30" />
				</g>
				
				{/* Confetti */}
				<rect x="180" y="200" width="8" height="8" rx="1" className="fill-primary animate-bounce" style={{ animationDelay: "0s" }} />
				<rect x="300" y="180" width="6" height="6" rx="1" className="fill-primary/60 animate-bounce" style={{ animationDelay: "0.2s" }} />
				<rect x="220" y="170" width="7" height="7" rx="1" className="fill-primary/80 animate-bounce" style={{ animationDelay: "0.4s" }} />
				<circle cx="350" cy="220" r="4" className="fill-primary/50 animate-bounce" style={{ animationDelay: "0.3s" }} />
				<circle cx="160" cy="230" r="5" className="fill-primary/70 animate-bounce" style={{ animationDelay: "0.5s" }} />
			</svg>
		);
	}

	if (variant === "forgot" || variant === "reset") {
		return (
			<svg viewBox="0 0 500 400" className="w-full max-w-md" fill="none" xmlns="http://www.w3.org/2000/svg">
				{/* Background */}
				<circle cx="250" cy="200" r="150" className="fill-primary/10" />
				
				{/* Lock Icon - Large */}
				<g transform="translate(175, 120)">
					<rect x="20" y="70" width="110" height="90" rx="15" className="fill-primary/20 stroke-primary" strokeWidth="4" />
					<path d="M45 70 L45 45 Q75 10 105 45 L105 70" className="stroke-primary" strokeWidth="8" fill="none" strokeLinecap="round" />
					{/* Keyhole */}
					<circle cx="75" cy="110" r="12" className="fill-primary" />
					<rect x="71" y="115" width="8" height="20" rx="2" className="fill-primary" />
				</g>
				
				{/* Student peeking */}
				<g transform="translate(320, 200)">
					<circle cx="30" cy="30" r="25" className="fill-primary/20 stroke-foreground" strokeWidth="3" />
					<circle cx="22" cy="27" r="3" className="fill-foreground" />
					<circle cx="38" cy="27" r="3" className="fill-foreground" />
					<path d="M22 40 Q30 45 38 40" className="stroke-foreground" strokeWidth="2" fill="none" />
					{/* Thinking bubbles */}
					<circle cx="65" cy="15" r="5" className="fill-primary/30" />
					<circle cx="75" cy="5" r="4" className="fill-primary/20" />
					<circle cx="83" cy="-2" r="3" className="fill-primary/10" />
				</g>
				
				{/* Email/Key floating */}
				<g transform="translate(80, 250)" className="animate-pulse" style={{ animationDuration: "2s" }}>
					<rect x="0" y="0" width="60" height="40" rx="5" className="fill-primary/30 stroke-primary/50" strokeWidth="2" />
					<path d="M0 5 L30 25 L60 5" className="stroke-primary/50" strokeWidth="2" fill="none" />
				</g>
			</svg>
		);
	}

	if (variant === "verify") {
		return (
			<svg viewBox="0 0 500 400" className="w-full max-w-md" fill="none" xmlns="http://www.w3.org/2000/svg">
				{/* Background */}
				<circle cx="250" cy="200" r="150" className="fill-primary/10" />
				<circle cx="400" cy="100" r="30" className="fill-primary/5" />
				
				{/* Large Email */}
				<g transform="translate(150, 100)">
					<rect x="0" y="20" width="200" height="140" rx="10" className="fill-card stroke-border" strokeWidth="3" />
					<path d="M0 30 L100 100 L200 30" className="stroke-primary" strokeWidth="4" fill="none" />
					{/* Checkmark in circle */}
					<circle cx="100" cy="100" r="35" className="fill-primary/20 stroke-primary" strokeWidth="3" />
					<path d="M80 100 L95 115 L125 85" className="stroke-primary" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
				</g>
				
				{/* Student Waiting */}
				<g transform="translate(70, 220)">
					<circle cx="30" cy="30" r="25" className="fill-primary/20 stroke-foreground" strokeWidth="3" />
					<circle cx="22" cy="27" r="3" className="fill-foreground" />
					<circle cx="38" cy="27" r="3" className="fill-foreground" />
					<path d="M22 38 L38 38" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
					{/* Phone in hand */}
					<rect x="50" y="60" width="25" height="40" rx="4" className="fill-foreground/20 stroke-foreground" strokeWidth="2" />
				</g>
				
				{/* Notification bells */}
				<g transform="translate(380, 180)" className="animate-bounce" style={{ animationDuration: "1s" }}>
					<path d="M15 0 L15 5 M5 20 Q15 30 25 20 M0 20 L15 5 L30 20 Z" className="fill-primary/60 stroke-primary" strokeWidth="2" />
				</g>
			</svg>
		);
	}

	// Default - Login illustration
	return (
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
	);
}

function getIllustrationContent(variant: string) {
	switch (variant) {
		case "register":
			return {
				heading: "Join the Campus Community",
				subheading: "Create your account and start buying, selling, and connecting with students across campus.",
				features: [
					"Buy & sell textbooks, electronics, and more",
					"Connect directly with campus sellers",
					"Exclusive student deals and offers",
				],
			};
		case "forgot":
			return {
				heading: "Forgot Your Password?",
				subheading: "No worries! It happens to the best of us. We'll help you get back into your account.",
				features: [
					"Quick and secure recovery",
					"Reset link sent to your email",
					"Back to shopping in minutes",
				],
			};
		case "reset":
			return {
				heading: "Reset Your Password",
				subheading: "Choose a strong password to keep your account secure.",
				features: [
					"Use at least 8 characters",
					"Mix letters, numbers & symbols",
					"Don't reuse old passwords",
				],
			};
		case "verify":
			return {
				heading: "Check Your Email",
				subheading: "We've sent a verification link to your inbox. Click it to activate your account.",
				features: [
					"Check spam folder if not found",
					"Link expires in 24 hours",
					"Resend if needed",
				],
			};
		default:
			return {
				heading: "Welcome Back, Scholar!",
				subheading: "Sign in to continue your campus marketplace journey.",
				features: [
					"Access your orders and listings",
					"Chat with buyers and sellers",
					"Get personalized campus deals",
				],
			};
	}
}

export function AuthLayout({ children, title, description, className, variant = "login" }: AuthLayoutProps) {
	const content = getIllustrationContent(variant);

	return (
		<div className="min-h-screen flex">
			{/* Left Side - Illustration Panel */}
			<div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-gradient-to-br from-primary/5 via-background to-primary/10 relative overflow-hidden">
				{/* Decorative background pattern */}
				<div className="absolute inset-0 opacity-30">
					<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
								<circle cx="20" cy="20" r="1" className="fill-primary/20" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid)" />
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
						<StudentIllustration variant={variant} />
						
						<div className="mt-8 text-center max-w-md">
							<h2 className="text-2xl xl:text-3xl font-bold text-foreground mb-3">
								{content.heading}
							</h2>
							<p className="text-muted-foreground">
								{content.subheading}
							</p>
						</div>

						{/* Feature list */}
						<div className="mt-8 space-y-3">
							{content.features.map((feature, i) => (
								<div key={feature} className="flex items-center gap-3 text-sm">
									<div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary">
										<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
											<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<span className="text-foreground">{feature}</span>
								</div>
							))}
						</div>
					</div>

					{/* Bottom - Stats or Trust indicators */}
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
				<main className="flex-1 flex items-center justify-center p-6 sm:p-8">
					<div className={cn("w-full max-w-md", className)}>
						{/* Title Section */}
						<div className="text-center mb-8">
							<h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{title}</h1>
							<p className="text-muted-foreground text-sm sm:text-base">{description}</p>
						</div>

						{/* Form Card */}
						<div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
							{children}
						</div>
					</div>
				</main>

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
