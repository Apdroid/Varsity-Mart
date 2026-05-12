import type { ReactNode } from "react"
import Logo from "../global/logo"

type AuthPageShellProps = {
	children: ReactNode
}

export function AuthPageShell({ children }: AuthPageShellProps) {
	return (
		<div className="flex my-20 flex-col items-center justify-center bg-cover ">
			<div className="w-full max-w-sm md:max-w-xl mx-auto my-5 align-center">
			<Logo variant="auth" className="my-10 mx-auto"/>
			{children}
			</div>
		</div>
	)
}
