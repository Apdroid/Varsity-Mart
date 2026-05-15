import { AuthPageShell } from "@/components/auth/auth-page-shell"
import { AuthFormShell } from "@/components/auth/auth-form-shell"
import { CompleteProfileForm } from "@/components/auth/complete-profile-form"

export default function CompleteProfilePage() {
	return (
		<AuthPageShell>
			<AuthFormShell
				title="Almost there"
				description="Fill in a few more details to complete your campus profile"
				showLegalNotice={false}
			>
				<CompleteProfileForm />
			</AuthFormShell>
		</AuthPageShell>
	)
}
