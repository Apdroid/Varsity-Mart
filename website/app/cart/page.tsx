import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";
import { MainLayout } from "@/components/layout/main-layout";

export const metadata: Metadata = {
	title: "Shopping Cart - VarsityMart",
	description: "Review your shopping cart",
};

export default function CartPage() {
	return (
		<MainLayout>
			<CartPageContent />
		</MainLayout>
	);
}
