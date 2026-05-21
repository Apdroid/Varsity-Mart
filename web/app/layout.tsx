import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { DownloadAppCard } from "@/components/global/download-app-card";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { CampusProvider } from "@/providers/campus-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProfileGate } from "@/components/global/profile-gate";
import { CampusPicker } from "@/components/global/campus-picker";


const fontSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-jarkata",
})
const fontMono = Open_Sans({
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
						<CampusProvider>
							<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
								<TooltipProvider>
									<ThemeProvider>
										<ProfileGate>
											<main className="min-h-screen">
												{children}
											</main>
										</ProfileGate>
										<CampusPicker />
										<DownloadAppCard />
										<Toaster richColors theme="system" position="bottom-right" />
									</ThemeProvider>
								</TooltipProvider>
							</GoogleOAuthProvider>
						</CampusProvider>
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	)
}
