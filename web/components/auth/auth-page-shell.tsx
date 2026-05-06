import type { ReactNode } from "react"

type AuthPageShellProps = {
	children: ReactNode
}

export function AuthPageShell({ children }: AuthPageShellProps) {
	return (
		<div className="flex my-20 flex-col items-center justify-center bg-[linear-gradient(to_right,rgba(0,0,0,0.8),rgba(0,0,0,0.8)), url('/auth_bg.jpg')] bg-cover ">
			<div className="w-full max-w-sm md:max-w-xl">{children}</div>
		</div>
	)
}
