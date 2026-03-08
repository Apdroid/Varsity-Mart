"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
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

const resetPasswordSchema = z.object({
	password: z.string().min(8, "Password must be at least 8 characters"),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
	const searchParams = useSearchParams();
	const reset_token = searchParams.get("token");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: ResetPasswordFormValues) => {
		if (!reset_token) {
			setError("Reset token is missing. Please check your email link.");
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			await authService.resetPassword(reset_token, data.password, data.confirmPassword);
			setIsSubmitted(true);
		} catch (err: any) {
			setError(err?.response?.data?.message || "Failed to reset password. The link may have expired.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	if (isSubmitted) {
		return (
			<AuthLayout title="Password Reset" description="Your password has been successfully reset">
				<div className="space-y-6 py-4">
					<div className="flex flex-col items-center justify-center text-center space-y-4">
						<div className="h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
							<CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
						</div>
						<div>
							<h3 className="text-lg font-semibold">Password Reset Successfully!</h3>
							<p className="text-sm text-muted-foreground mt-2">
								You can now sign in with your new password.
							</p>
						</div>
					</div>
					<Button asChild className="w-full">
						<Link href="/auth/login">Sign In</Link>
					</Button>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout title="Reset Password" description="Enter your new password below">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					{error && (
						<div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md">
							{error}
						</div>
					)}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<div className="relative">
										<KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											type="password"
											placeholder="Enter new password"
											className="pl-10"
											{...field}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<div className="relative">
										<KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											type="password"
											placeholder="Confirm new password"
											className="pl-10"
											{...field}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Resetting Password...
							</>
						) : (
							"Reset Password"
						)}
					</Button>

					<div className="text-center">
						<Link
							href="/auth/login"
							className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
						>
							<ArrowLeft className="h-3 w-3" />
							Back to Sign In
						</Link>
					</div>
				</form>
			</Form>
		</AuthLayout>
	);
}
