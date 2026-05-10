import { MainLayout } from "@/components/layout/main-layout"
import { NotificationsPageContent } from "@/components/notifications/notifications-page-content"

export const metadata = {
  title: "Notifications - VarsityMart",
  description: "Your notifications on VarsityMart",
}

export default function NotificationsPage() {
  return (
    <MainLayout>
      <NotificationsPageContent />
    </MainLayout>
  )
}
