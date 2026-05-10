import type { Metadata } from "next"
import MainLayout from "@/components/layout/main-layout"
import SettingsPageContent from "@/components/account/settings-page-content"

export const metadata: Metadata = {
  title: "Account Settings | VarsityMart",
  description: "Manage your VarsityMart account settings and preferences",
}

export default function SettingsPage() {
  return (
    <MainLayout>
      <SettingsPageContent />
    </MainLayout>
  )
}
