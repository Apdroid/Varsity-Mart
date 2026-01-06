import { CartIcon } from "@/components/ui/cart";
export default function Logo() {
	return (
		<h1 className="logo flex leading-tight font-bold items-center space-x-2 ">
			<CartIcon className="text-primary"/>
			Varsity <strong className="text-primary font-bold -leading-1.5">Mart</strong>
		</h1>
	);
}
