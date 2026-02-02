export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = {
	title: "Create Account - VarsityMart",
	description: "Create your VarsityMart account",
};

export default function RegisterPage() {
	return <RegisterForm />;
}
