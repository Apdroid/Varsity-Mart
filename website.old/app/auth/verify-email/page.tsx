export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const metadata: Metadata = {
	title: "Verify Email - VarsityMart",
	description: "Verify your VarsityMart email address",
};

export default function VerifyEmailPage() {
	return (
		<Suspense>
			<VerifyEmailForm />
		</Suspense>
	);
}
