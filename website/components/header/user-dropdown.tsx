"use client";

import { LogIn } from "lucide-react";
import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { UserIcon } from "../ui/user";

export default function UserDropdown() {
	const [open, setOpen] = React.useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger>
				<Avatar>
					{/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
					<AvatarFallback>
						<UserIcon size={20} />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel>You are Not Signed In</DropdownMenuLabel>
					<DropdownMenuItem>
						<Button className="w-full">
							<LogIn />
							Log In
						</Button>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
