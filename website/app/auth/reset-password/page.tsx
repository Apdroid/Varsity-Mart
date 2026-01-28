import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
	title: "Reset Password - VarsityMart",
	description: "Set a new password for your VarsityMart account",
};

export default function ResetPasswordPage() {
	return <ResetPasswordForm />;
}
