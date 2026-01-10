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
		<div className=" flex flex-col  min-h-dvh ">
			<Activity mode={header ? "visible" : "hidden"}>
				<Header />
			</Activity>
			<main className=" mx-auto flex-1 md:max-w-global ">
				{children}
			</main>
			<Activity mode={footer ? "visible" : "hidden"}>
				<Footer />
			</Activity>
		</div>
	);
}
