import { CartIcon } from "@/components/ui/cart";
import Link from "next/link";
export default function Logo() {
	return (
		<Link
			href="/"
			className="logo flex leading-tight font-bold items-center gap-3 px-2"
		>
			<CartIcon className="text-primary text-4xl" />
			<span className="logo-text hidden  items-center text-xl md:flex">
				Varsity<strong className="text-primary font-bold -leading-1.5">Mart</strong>
			</span>
		</Link>
	);
}
