"use client";

import React from "react";
import { Edit3Icon, EyeIcon, LogIn, Redo2Icon, Trash2Icon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
	const [open, setOpen] = React.useState(true);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger>
				<Avatar>
					{/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
					<AvatarFallback><UserIcon size={28}/></AvatarFallback>
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
