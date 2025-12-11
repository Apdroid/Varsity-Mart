import type React from "react"
import { Header } from "./header"
import { Footer } from "./footer"

interface MainLayoutProps {
  children: React.ReactNode
  showFooter?: boolean
}

export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Header is fixed: h-16 (64px) + h-12 (48px) = 112px total */}
      <main className="flex-1 pt-[112px]">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}

export default MainLayout
