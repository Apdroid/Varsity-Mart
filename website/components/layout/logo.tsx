import Link from "next/link";

export default function Logo() {
	return (
		<Link href="/" className="flex items-center gap-2 shrink-0 ml-2 ">
			<div className="flex h-9 w-9 items-center justify-center rounded-full font-sans text-primary bg-primary/20  font-extrabold text-2xl">
				V
			</div>
			<span className="text-xl font-black font-mono text-foreground  hidden sm:block">
				VarsityMart
			</span>
		</Link>
	);
}
