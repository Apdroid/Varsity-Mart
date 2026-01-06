import Link from "next/link";

export default function Announcements() {
	return (
		<div className="w-full bg-accent p-1.5 flex items-center justify-center text-center">
			<small>We have a new domain 🎉 !! <Link href="https://varsitymart.org" className="border-b-1 border-b-primary hover:text-primary">VarsityMart.org</Link></small>
		</div>
	);
}
