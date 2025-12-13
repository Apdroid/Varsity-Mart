import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Noto_Sans, Poppins } from "next/font/google";
import type React from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { CartProvider } from "@/lib/stores/cart.store";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

const fontSans = Noto_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
	weight: ["300", "400", "600", "700"],
});

const fontMono = Poppins({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
	weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
	title: "VarsityMart - Campus Marketplace",
	description:
		"The student marketplace for buying, selling, and discovering campus deals",
	icons: {
		icon: [
			{
				url: "/icon-light-32x32.png",
				media: "(prefers-color-scheme: light)",
			},
			{
				url: "/icon-dark-32x32.png",
				media: "(prefers-color-scheme: dark)",
			},
			{
				url: "/icon.svg",
				type: "image/svg+xml",
			},
		],
		apple: "/apple-icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={` antialiased ${fontSans.className} ${fontMono.className}`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<QueryProvider>
						<CartProvider>{children}</CartProvider>
					</QueryProvider>
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	);
}
