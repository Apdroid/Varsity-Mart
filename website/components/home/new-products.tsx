import { mockProducts } from "@/data/products/products";
import ProductCard from "../main/product-card";

export default function Newproducts() {
	return (
		<div className="my-6 mx-auto">
			<h1 className="text-2xl font-bold">Products by your Peers</h1>
			{mockProducts.slice(0, 1).map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
