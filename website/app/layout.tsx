import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import type { Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import type React from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { UniversityProvider } from "@/components/providers/university-provider";
import { AuthGuard } from "@/lib/api/auth-guard";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

const fontHeading = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-heading",
	display: "swap",
	weight: ["400", "500", "600", "700", "800"],
});

const fontBody = Bricolage_Grotesque({
	subsets: ["latin"],
	variable: "--font-body",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

const fontMono = IBM_Plex_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
	weight: ["400", "500", "600"],
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
				url: "/icon-light-32x32.png",
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
				className={`${fontHeading.variable} ${fontBody.variable} ${fontMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					disableTransitionOnChange
				>
					<QueryProvider>
						<UniversityProvider>
							<AuthGuard>
								{children}
							</AuthGuard>
						</UniversityProvider>
					</QueryProvider>
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	);
}
