import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { DownloadAppCard } from "@/components/global/download-app-card";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";


const fontSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-jarkata",
})

const fontMono = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
})

export const metadata: Metadata = {
	title: {
		default: "VarsityMart | University Marketplace",
		template: "%s | Varsity Mart"
	}
}


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn("antialiased ", fontSans.variable, fontMono.variable)}
		>
			<body>
				<QueryProvider>
					<AuthProvider>
						<TooltipProvider>
							<ThemeProvider>
								{children}
								<DownloadAppCard />
								<Toaster richColors position="bottom-right" />
							</ThemeProvider>
						</TooltipProvider>
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	)
}
