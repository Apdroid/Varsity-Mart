export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import CompleteProfileForm from "@/components/auth/complete-profile-form";

export const metadata: Metadata = {
	title: "Complete Your Profile - VarsityMart",
	description: "Complete your profile to start using VarsityMart",
};

export default function CompleteProfilePage() {
	return <CompleteProfileForm />;
}
