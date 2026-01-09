import type { Metadata } from "next";
import StructureProvider from "@/providers/structure-provider";

export const metadata: Metadata = {
	title: "Home - Varisty Mart",
};

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <StructureProvider>{children}</StructureProvider>;
}
