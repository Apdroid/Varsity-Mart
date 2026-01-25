import
    React from "react"
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {Providers} from "@/components/providers";
import NextTopLoader from "nextjs-toploader"

const fontSans = Inter({subsets: ['latin'], variable: '--font-sans'});

export const metadata: Metadata = {
    title: "VarsityMart Admin Dashboard",
    description: "Comprehensive admin dashboard for managing VarsityMart platform",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={fontSans.variable} suppressHydrationWarning>
        <body className="antialiased bg-background text-foreground">
        <NextTopLoader/>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
