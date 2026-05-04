import Link from "next/link";

export default function Logo() {
	return (
		<Link href="/" className="flex items-center gap-2.5 shrink-0 group">
			<div className="flex h-9 w-9 items-center justify-center rounded-xl font-sans bg-primary text-primary-foreground font-black text-xl shadow-sm transition-transform group-hover:scale-105">
				V
			</div>
			<div className="hidden sm:flex flex-col">
				<span className="text-lg font-black tracking-tight text-foreground leading-none">
					VarsityMart
				</span>
				<span className="text-[10px] text-muted-foreground font-medium leading-none mt-0.5">
					Campus Marketplace
				</span>
			</div>
		</Link>
	);
}
