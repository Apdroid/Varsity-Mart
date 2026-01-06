import type React from "react";
import { Activity } from "react";
import Footer from "@/components/global/footer";
import Header from "@/components/global/header";

export default function StructureProvider({
	header = true,
	footer = true,
	children,
}: {
	children: React.ReactNode;
	header?: boolean;
	footer?: boolean;
	announcement?: boolean;
}) {
	return (
		<div className="container flex flex-col w-full justify-between  min-h-dvh max-w-full my-0">
			<Activity mode={header ? "visible" : "hidden"}>
				<Header />
			</Activity>
			<main className="mx-auto my-0 flex-1 max-w-global bg-slate-700 ">
				{children}
			</main>
			<Activity mode={footer ? "visible" : "hidden"}>
				<Footer />
			</Activity>
		</div>
	);
}
