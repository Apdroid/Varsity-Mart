import type React from "react"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  footerText: string
  footerLink: string
  footerLinkText: string
}

export function AuthLayout({ children, title, description, footerText, footerLink, footerLinkText }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-lg">
              V
            </div>
            <span className="text-2xl font-bold text-foreground">VarsityMart</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {/* Form */}
          {children}

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link href={footerLink} className="font-medium text-emerald-600 hover:text-emerald-700">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-emerald-600 to-emerald-800 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4">Your Campus Marketplace</h2>
          <p className="text-emerald-100 text-lg mb-8">
            Buy, sell, and discover amazing deals from verified students on your campus. Safe, fast, and
            student-friendly.
          </p>
          <div className="space-y-4">
            {["Verified student sellers", "Secure escrow payments", "Campus-wide delivery", "24/7 chat support"].map(
              (feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{feature}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
