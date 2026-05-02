export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
	title: "Forgot Password - VarsityMart",
	description: "Reset your VarsityMart account password",
};

export default function ForgotPasswordPage() {
	return <ForgotPasswordForm />;
}

