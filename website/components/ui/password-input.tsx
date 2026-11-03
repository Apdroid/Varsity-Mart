
"use client"

import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const PasswordInput = ({ className, ...props }: React.ComponentProps<"input">) => {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<div className="w-full  space-y-2">
			<div className="relative w-full">
				<Input
					className={cn(`bg-accent p-6 w-full`, className)}
					id="password-toggle"
					placeholder="Enter your password" type={showPassword ? "text" : "password"}
					{...props}
				/>
				<Button
					className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
					onClick={() => setShowPassword(!showPassword)}
					size="icon"
					type="button"
					variant="ghost"
				>
					{showPassword ? (
						<EyeIcon size={32} weight="bold" className="h-4 w-4 text-muted-foreground" />
					) : (
						<EyeSlashIcon size={32} weight="bold" className="h-4 w-4 text-muted-foreground" />
					)}
				</Button>
			</div>
		</div>
	)
}

export default PasswordInput
