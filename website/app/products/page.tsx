import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductsPageContent } from "@/components/products/products-page-content";
import { ProductsHero } from "@/components/home/products-hero";

export const metadata: Metadata = {
	title: "Products - VarsityMart",
	description: "Browse all products on VarsityMart",
};

export default function ProductsPage() {
	return (
		<MainLayout>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<ProductsHero />
			</div>
			<ProductsPageContent />
		</MainLayout>
	);
}
