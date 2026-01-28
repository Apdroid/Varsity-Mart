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
      {/* Header: promo banner (28px on md+) + main nav (56-64px) + categories (44px on lg) */}
      <main className="flex-1 pt-[104px] md:pt-[128px] lg:pt-[139px]">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
}

export default MainLayout
