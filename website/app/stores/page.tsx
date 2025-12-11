import { MainLayout } from "@/components/layout/main-layout"
import { StoresPageContent } from "@/components/stores/stores-page-content"
import { StoresHero } from "@/components/home/stores-hero"

export const metadata = {
  title: "Stores - VarsityMart",
  description: "Browse campus stores on VarsityMart",
}

export default function StoresPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StoresHero />
      </div>
      <StoresPageContent />
    </MainLayout>
  )
}
