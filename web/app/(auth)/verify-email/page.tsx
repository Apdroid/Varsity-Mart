"use client"

import { AuthPageShell } from "@/components/auth/auth-page-shell"
import { AuthFormShell } from "@/components/auth/auth-form-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/providers/auth-provider"
import { Loader2, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

const RESEND_COOLDOWN = 60

export default function VerifyEmailPage() {
	const { user, verifyEmail, resendVerification } = useAuth()
	const router = useRouter()
	const [code, setCode] = useState("")
	const [isVerifying, setIsVerifying] = useState(false)
	const [isResending, setIsResending] = useState(false)
	const [cooldown, setCooldown] = useState(0)
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current)
		}
	}, [])

	const startCooldown = () => {
		setCooldown(RESEND_COOLDOWN)
		timerRef.current = setInterval(() => {
			setCooldown((prev) => {
				if (prev <= 1) {
					clearInterval(timerRef.current!)
					timerRef.current = null
					return 0
				}
				return prev - 1
			})
		}, 1000)
	}

	const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (code.length < 6) {
			toast.error("Please enter the full 6-digit code")
			return
		}
		setIsVerifying(true)
		const result = await verifyEmail({ verification_code: code })
		setIsVerifying(false)
		if (result.success) {
			toast.success("Email verified! Welcome aboard.")
			router.replace("/")
		} else {
			toast.error(result.error || "Verification failed. Check the code and try again.")
		}
	}

	const handleResend = async () => {
		if (cooldown > 0 || isResending) return
		setIsResending(true)
		const result = await resendVerification(user?.email)
		setIsResending(false)
		if (result.success) {
			toast.success("A new code has been sent to your email.")
			startCooldown()
		} else {
			toast.error(result.error || "Failed to resend code. Please try again.")
		}
	}

	const email = user?.email ?? "your email address"

	return (
		<AuthPageShell>
			<AuthFormShell
				title="Check your inbox"
				description={
					<>
						We sent a 6-digit code to{" "}
						<span className="font-semibold text-foreground">{email}</span>
					</>
				}
				showLegalNotice={false}
			>
				<div className="mx-auto mb-6 mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-vm-tangerine/10">
					<Mail className="h-7 w-7 text-vm-tangerine" />
				</div>

				<form onSubmit={handleVerify} className="space-y-4">
					<Input
						type="text"
						inputMode="numeric"
						pattern="[0-9]*"
						maxLength={6}
						placeholder="000000"
						value={code}
						onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
						className="h-14 text-center text-2xl font-mono tracking-[0.5em] rounded-2xl"
						autoFocus
						autoComplete="one-time-code"
					/>

					<Button
						type="submit"
						disabled={isVerifying || code.length < 6}
						className="w-full rounded-full p-6 text-base"
					>
						{isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Verify email
					</Button>
				</form>

				<p className="mt-6 text-center text-sm text-muted-foreground">
					Didn&apos;t receive the code?{" "}
					<button
						type="button"
						onClick={handleResend}
						disabled={cooldown > 0 || isResending}
						className="font-medium text-primary underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isResending
							? "Sending..."
							: cooldown > 0
							? `Resend in ${cooldown}s`
							: "Resend code"}
					</button>
				</p>
			</AuthFormShell>
		</AuthPageShell>
	)
}
