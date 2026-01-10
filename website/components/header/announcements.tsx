import Link from "next/link";

export default function Announcements() {
	return (
		<div className="w-full bg-accent px-4 py-3 flex items-center justify-center text-center">
			<small className="text-sm">We have a new domain 🎉 !! <Link href="https://varsitymart.org" className="border-b-2 border-b-primary hover:text-primary font-semibold mx-1">VarsityMart.org</Link></small>
		</div>
	);
}
