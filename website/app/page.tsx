import { CategoryGrid } from "@/components/home/category-grid";
import Newproducts from "@/components/home/new-products";
import RestStalls from "@/components/home/rest-stalls";

export default function Page() {
	return (
		<div className="max-w-460">
			<section className="category-grid my-10 mx-auto">
				<CategoryGrid />
			</section>
			<section className="my-20 mx-auto">
			<Newproducts />
			</section>
			<section className="my-20 mx-auto">
			<RestStalls/>
			</section>
		</div>
	);
}
