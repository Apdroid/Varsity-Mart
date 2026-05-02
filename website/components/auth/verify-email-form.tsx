"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/api/services/auth.service";

const verifySchema = z.object({
	code: z.string().length(6, "Code must be 6 digits").regex(/^\d{6}$/, "Code must contain only numbers"),
});

const resendSchema = z.object({
	email: z.string().email("Please enter a valid email"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;
type ResendFormValues = z.infer<typeof resendSchema>;

type Status = "idle" | "verifying" | "verified" | "error" | "resending" | "resent";

export function VerifyEmailForm() {
	const searchParams = useSearchParams();
	const codeFromUrl = searchParams.get("code");

	const [status, setStatus] = useState<Status>("idle");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showResend, setShowResend] = useState(false);
	const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const form = useForm<VerifyFormValues>({
		resolver: zodResolver(verifySchema),
		defaultValues: { code: codeFromUrl ?? "" },
	});

	const resendForm = useForm<ResendFormValues>({
		resolver: zodResolver(resendSchema),
		defaultValues: { email: "" },
	});

	const verifyCode = async (code: string) => {
		setStatus("verifying");
		setErrorMessage(null);
		try {
			await authService.verifyEmail(code);
			setStatus("verified");
		} catch (err: any) {
			setErrorMessage(
				err?.response?.data?.message || "Invalid or expired verification code.",
			);
			setStatus("error");
		}
	};

	// Initialize OTP values from URL code if present
	useEffect(() => {
		if (codeFromUrl) {
			const digits = codeFromUrl.replace(/\D/g, "").slice(0, 6).split("");
			setOtpValues(digits.concat(Array(6 - digits.length).fill("")));
		}
	}, [codeFromUrl]);

	// Auto-verify when a code arrives via URL (e.g. from email link)
	useEffect(() => {
		if (codeFromUrl) {
			verifyCode(codeFromUrl);
		}
	}, [codeFromUrl]);

	const handleOtpChange = (index: number, value: string) => {
		if (value.length > 1) {
			// Handle paste
			const digits = value.replace(/\D/g, "").slice(0, 6).split("");
			const newValues = [...otpValues];
			digits.forEach((digit, i) => {
				if (index + i < 6) newValues[index + i] = digit;
			});
			setOtpValues(newValues);
			form.setValue("code", newValues.join(""));
			const nextIndex = Math.min(index + digits.length, 5);
			inputRefs.current[nextIndex]?.focus();
			return;
		}

		if (!/^\d*$/.test(value)) return;

		const newValues = [...otpValues];
		newValues[index] = value;
		setOtpValues(newValues);
		form.setValue("code", newValues.join(""));

		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === "Backspace" && !otpValues[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const onSubmit = async (data: VerifyFormValues) => {
		await verifyCode(data.code);
	};

	const onResend = async (data: ResendFormValues) => {
		setStatus("resending");
		setErrorMessage(null);
		try {
			await authService.resendVerification(data.email);
			setStatus("resent");
		} catch (err: any) {
			setErrorMessage(
				err?.response?.data?.message || "Failed to resend verification email.",
			);
			setStatus("error");
		}
	};

	const resetToIdle = () => {
		setStatus("idle");
		setErrorMessage(null);
		setShowResend(false);
	};

	if (status === "verifying" && codeFromUrl) {
		return (
			<AuthLayout title="Verifying your email" description="Please wait a moment...">
				<div className="flex flex-col items-center justify-center py-8 space-y-4">
					<Loader2 className="h-10 w-10 animate-spin text-primary" />
					<p className="text-sm text-muted-foreground">
						Verifying your email address...
					</p>
				</div>
			</AuthLayout>
		);
	}

	if (status === "verified") {
		return (
			<AuthLayout
				title="Email Verified"
				description="Your email address has been confirmed"
			>
				<div className="space-y-6 text-center py-4">
					<div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
						<CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
					</div>
					<p className="text-sm text-muted-foreground">
						Your email has been successfully verified. You can now sign in to your
						account.
					</p>
					<Button asChild className="w-full">
						<Link href="/auth/login">Sign In</Link>
					</Button>
				</div>
			</AuthLayout>
		);
	}

	if (status === "resent") {
		return (
			<AuthLayout
				title="Check your email"
				description="A new verification link has been sent"
			>
				<div className="space-y-6 text-center">
					<div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
						<Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
					</div>
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							We sent a new verification email to
						</p>
						<p className="font-medium text-foreground">
							{resendForm.getValues("email")}
						</p>
					</div>
					<p className="text-sm text-muted-foreground">
						Click the link in the email to verify your address. Check your spam
						folder if you don't see it.
					</p>
					<Button variant="ghost" className="w-full" onClick={resetToIdle}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back
					</Button>
				</div>
			</AuthLayout>
		);
	}

	if (showResend) {
		return (
			<AuthLayout
				title="Resend verification"
				description="Enter your email to receive a new verification link"
			>
				<Form {...resendForm}>
					<form onSubmit={resendForm.handleSubmit(onResend)} className="space-y-5">
						{errorMessage && (
							<div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
								{errorMessage}
							</div>
						)}
						<FormField
							control={resendForm.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="you@university.edu"
											autoComplete="email"
											disabled={status === "resending"}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full h-11"
							disabled={status === "resending"}
						>
							{status === "resending" ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Sending...
								</>
							) : (
								<>
									<Mail className="mr-2 h-4 w-4" />
									Send verification email
								</>
							)}
						</Button>
					</form>
				</Form>

				<button
					type="button"
					onClick={resetToIdle}
					className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
				>
					<ArrowLeft className="w-4 h-4" />
					Back
				</button>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title="Verify your email"
			description="Enter the verification code sent to your email"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
					{errorMessage && (
						<div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
							{errorMessage}
						</div>
					)}
					<FormField
						control={form.control}
						name="code"
						render={() => (
							<FormItem>
								<FormLabel>Verification Code</FormLabel>
								<FormControl>
									<div className="flex justify-center gap-2">
										{Array.from({ length: 6 }).map((_, index) => (
											<input
												key={index}
												ref={(el) => { inputRefs.current[index] = el; }}
												type="text"
												inputMode="numeric"
												maxLength={6}
												value={otpValues[index]}
												onChange={(e) => handleOtpChange(index, e.target.value)}
												onKeyDown={(e) => handleKeyDown(index, e)}
												disabled={status === "verifying"}
												className="w-12 h-14 text-center text-xl font-semibold border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
												autoComplete={index === 0 ? "one-time-code" : "off"}
											/>
										))}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="w-full h-11"
						disabled={status === "verifying"}
					>
						{status === "verifying" ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Verifying...
							</>
						) : (
							"Verify Email"
						)}
					</Button>
				</form>
			</Form>

			<div className="mt-6 space-y-3">
				<p className="text-sm text-center text-muted-foreground">
					Didn't receive a code?
				</p>
				<Button
					variant="outline"
					className="w-full"
					onClick={() => {
						setShowResend(true);
						setErrorMessage(null);
					}}
				>
					<RefreshCw className="w-4 h-4 mr-2" />
					Resend verification email
				</Button>
				<Link
					href="/auth/login"
					className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to sign in
				</Link>
			</div>
		</AuthLayout>
	);
}
