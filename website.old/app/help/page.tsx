import type { Metadata } from "next"
import MainLayout from "@/components/layout/main-layout"
import HelpPageContent from "@/components/help/help-page-content"

export const metadata: Metadata = {
  title: "Help Center | VarsityMart",
  description: "Find answers to frequently asked questions about VarsityMart",
}

export default function HelpPage() {
  return (
    <MainLayout>
      <HelpPageContent />
    </MainLayout>
  )
}
