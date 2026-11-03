import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

/**
 * Inline error for auth forms. Render it directly above the submit button so
 * the message appears where the user is already looking after pressing it,
 * instead of in a corner toast. The icon and text mean it never relies on
 * colour alone, and Alert's role="alert" announces it to screen readers.
 */
export function FormError({ message, className }: { message?: string | null; className?: string }) {
	if (!message) return null
	return (
		<Alert
			variant="destructive"
			className={cn(
				"animate-in fade-in slide-in-from-top-1 border-destructive/40 bg-destructive/5 duration-150",
				className
			)}
		>
			<AlertCircle aria-hidden="true" />
			<AlertDescription className="font-medium text-destructive">{message}</AlertDescription>
		</Alert>
	)
}
