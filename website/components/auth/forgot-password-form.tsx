"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import Link from "next/link";
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

const forgotPasswordSchema = z.object({
	email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: ForgotPasswordFormValues) => {
		setIsLoading(true);
		setError(null);
		try {
			await authService.forgotPassword(data.email);
			setIsSubmitted(true);
		} catch (err: any) {
			setError(err?.response?.data?.message || "Failed to send reset link. Please try again.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	if (isSubmitted) {
		return (
			<AuthLayout
				title="Check your email"
				description="We've sent you a password reset link"
				variant="verify"
			>
				<div className="text-center space-y-6">
					{/* Success Icon */}
					<div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
						<CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
					</div>

					{/* Email info */}
					<div className="space-y-2">
						<p className="text-sm text-muted-foreground">
							We sent a password reset link to
						</p>
						<p className="font-medium text-foreground">{form.getValues("email")}</p>
					</div>

					{/* Instructions */}
					<p className="text-sm text-muted-foreground">
						Click the link in the email to reset your password. If you don't see it, check your spam folder.
					</p>

					{/* Actions */}
					<div className="space-y-3 pt-2">
						<Button
							variant="outline"
							className="w-full"
							onClick={() => {
								setIsSubmitted(false);
								form.reset();
							}}
						>
							<Mail className="w-4 h-4 mr-2" />
							Resend email
						</Button>

						<Link href="/auth/login" className="block">
							<Button variant="ghost" className="w-full">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to sign in
							</Button>
						</Link>
					</div>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title="Forgot password?"
			description="No worries, we'll send you reset instructions"
			variant="forgot"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
					{error && (
						<div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg">
							{error}
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
										disabled={isLoading}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Submit */}
					<Button type="submit" className="w-full h-11" disabled={isLoading}>
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

			{/* Back to login */}
			<Link
				href="/auth/login"
				className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to sign in
			</Link>
		</AuthLayout>
	);
}
