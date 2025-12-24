"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginButton({
	className,
}: React.HTMLAttributes<HTMLButtonElement>) {
	const router = useRouter();
	return (
		<Button className={className} onClick={() => router.push("/auth/login")}>
			Login
		</Button>
	);
}

export function LogoutButton({
	className,
}: React.HTMLAttributes<HTMLButtonElement>) {
	const router = useRouter();
	return (
		<Button className={className} onClick={() => router.push("/auth/logout")}>
			Logout
		</Button>
	);
}
