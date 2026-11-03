import { Suspense } from "react"
import { AuthPageShell } from "@/components/auth/auth-page-shell"
import { ResetForm } from "@/components/auth/reset-form"
import { Skeleton } from "@/components/ui/skeleton"

function ResetFormFallback() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-48" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
		</div>
	)
}

export default function ResetPage() {
	return (
		<AuthPageShell>
			<Suspense fallback={<ResetFormFallback />}>
				<ResetForm />
			</Suspense>
		</AuthPageShell>
	)
}
