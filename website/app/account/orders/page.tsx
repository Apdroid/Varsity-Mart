import { OrdersPageContent } from "@/components/account/orders-page-content";
import { MainLayout } from "@/components/layout/main-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Orders - VarsityMart",
	description: "View and track your orders",
};

export default function OrdersPage() {
	return (
		<MainLayout>
			<OrdersPageContent />
		</MainLayout>
	);
}
