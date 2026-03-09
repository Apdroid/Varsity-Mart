"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
	User,
	Package,
	Heart,
	MessageCircle,
	Bell,
	Settings,
	Store,
	LogOut,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/queries/useAuth";

type Props = {
	trigger: ReactNode;
	defaultOpen?: boolean;
	align?: "start" | "center" | "end";
};

const ProfileDropdown = ({ trigger, defaultOpen, align = "start" }: Props) => {
	const { user, logout, isAuthenticated } = useAuth();
	const [, setUser] = useState({});
	const [mounted, setMounted] = useState(false);

	// Ensure component is mounted on client
	useEffect(() => {
		setMounted(true);
	}, []);

	// Debug logs
	useEffect(() => {
		setUser({ user });
		console.log("👤 ProfileDropdown - Mounted:", mounted);
		console.log("👤 ProfileDropdown - User data:", user);
		console.log("👤 ProfileDropdown - isAuthenticated:", isAuthenticated);
	}, [user, isAuthenticated, mounted]);

	const handleLogout = () => {
		console.log("🚪 ProfileDropdown - Logout clicked");
		logout();
	};

	// Don't render dropdown until mounted and user is available
	if (!mounted || !user) {
		return <>{trigger}</>;
	}



	const userInitial = user.firstName?.charAt(0)?.toUpperCase() ||
		user.email?.charAt(0)?.toUpperCase() ||
		"U";
	console.log(user);

	return (
		<DropdownMenu defaultOpen={defaultOpen}>
			<DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align={align || "start"}>
				<DropdownMenuLabel className="flex items-center gap-3 px-3 py-2.5 font-normal">
					<div className="relative">
						<Avatar className="size-9">
							<AvatarImage src={user.avatarUrl || undefined} alt={user.firstName || "User"} />
							<AvatarFallback className="bg-primary/10 text-primary font-semibold">
								{userInitial}
							</AvatarFallback>
						</Avatar>
						<span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2" />
					</div>
					<div className="flex flex-1 flex-col items-start min-w-0">
						<span className="text-foreground text-sm font-semibold truncate w-full">
							{user.firstName || "User"}
						</span>
						<span className="text-muted-foreground text-xs truncate w-full">
							{user.email || ""}
						</span>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/account" className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer">
							<User className="h-4 w-4" />
							<span>My Account</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/account/orders" className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer">
							<Package className="h-4 w-4" />
							<span>My Orders</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/wishlist" className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer">
							<Heart className="h-4 w-4" />
							<span>Wishlist</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/messages" className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer">
							<MessageCircle className="h-4 w-4" />
							<span>Messages</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/notifications" className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer">
							<Bell className="h-4 w-4" />
							<span>Notifications</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/sell" className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer">
							<Store className="h-4 w-4" />
							<span>Sell / Create Store</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/account/settings" className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer">
							<Settings className="h-4 w-4" />
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					variant="destructive"
					className="px-3 py-2 text-sm cursor-pointer"
					onClick={handleLogout}
				>
					<LogOut className="h-4 w-4" />
					<span>Logout</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProfileDropdown;
