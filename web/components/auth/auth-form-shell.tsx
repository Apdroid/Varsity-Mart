import { cn } from "@/lib/utils"
import Logo from "@/components/global/logo"
import { Card, CardContent } from "@/components/ui/card"
import { FieldDescription } from "@/components/ui/field"
import type { ComponentProps, ReactNode } from "react"

type AuthFormShellProps = ComponentProps<"div"> & {
	title: string
	description: ReactNode
	children: ReactNode
	showLegalNotice?: boolean
}

export function AuthFormShell({
	className,
	title,
	description,
	children,
	showLegalNotice = true,
	...props
}: AuthFormShellProps) {
	return (
		<div className={cn("flex flex-col gap-6 border-none outline-none", className)} {...props}>
			<Card className="overflow-hidden p-0 outline-none border-none ring-0">
				<CardContent className=" border-none outline-none">
					<div className="p-6 md:p-8">
						<div className="flex flex-col items-center gap-2 text-center">
							<h1 className="text-xl md:text-3xl font-extrabold">{title}</h1>
							<p className="text-balance ">
								{description}
							</p>
						</div>
						{children}
					</div>
				</CardContent>
			</Card>
			{showLegalNotice ? (
				<FieldDescription className="px-6 text-center text-black dark:text-white">
					By clicking continue, you agree to our{" "}
					<a
						href="#"
						className="text-primary transition-all ease-linear hover:font-bold"
					>
						Terms of Service
					</a>{" "}
					and{" "}
					<a
						href="#"
						className="text-primary transition-all ease-linear hover:font-bold"
					>
						Privacy Policy
					</a>
					.
				</FieldDescription>
			) : null}
		</div>
	)
}
