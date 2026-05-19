"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import Header from "./global/header"
import Footer from "./global/footer"

function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	const pathname = usePathname()
	const hideExact = React.useMemo(
		() => new Set(["/login", "/register", "/forgot", "/reset", "/verify-email","/complete-profile"]),
		[]
	)
	const hidePrefix = ["/messages"]
	const showHeader =
		!pathname ||
		(!hideExact.has(pathname) && !hidePrefix.some((p) => pathname.startsWith(p)))

	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="light"
			disableTransitionOnChange
			{...props}
		>
			{showHeader && <Header />}
			{children}
			{showHeader && <Footer />}
		</NextThemesProvider>
	)
}


export { ThemeProvider }
