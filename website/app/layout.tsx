import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter, Manrope, Raleway } from "next/font/google";
import type React from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { UniversityProvider } from "@/components/providers/university-provider";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

const fontSans = Raleway({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
	weight: ["300", "400", "600", "700", "800"],
});
const fontMono = Manrope({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
	weight: ["300", "400", "600", "700", "800"],
});
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
	weight: ["300", "400", "600", "700", "800", "900"],
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

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={` antialiased ${fontMono.className} ${fontSans.className} ${inter.className}  `}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<QueryProvider>
						<UniversityProvider>
							{children}
						</UniversityProvider>
					</QueryProvider>
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	);
}
