import { CartIcon } from "@/components/ui/cart";
import Link from "next/link";
export default function Logo() {
	return (
		<Link
			href="/"
			className="logo flex leading-tight font-bold items-center space-x-2 "
		>
			<CartIcon className="text-primary text-4xl" size={40}/>
			<span className="logo-text hidden">
				Varsity{" "}
				<strong className="text-primary font-bold -leading-1.5">Mart</strong>
			</span>
		</Link>
	);
}
