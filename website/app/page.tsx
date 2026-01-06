import { CategoryGrid } from "@/components/home/category-grid";
import Newproducts from "@/components/home/new-products";

export default function Page() {
	return (
		<div className="max-w-460">
			<CategoryGrid />
			<Newproducts />
		</div>
	);
}
