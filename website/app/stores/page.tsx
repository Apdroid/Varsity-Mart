import { MainLayout } from "@/components/layout/main-layout"
import { StoresPageContent } from "@/components/stores/stores-page-content"

export const metadata = {
  title: "Stores - VarsityMart",
  description: "Browse campus stores on VarsityMart",
}

export default function StoresPage() {
  return (
    <MainLayout>
      <StoresPageContent />
    </MainLayout>
  )
}
