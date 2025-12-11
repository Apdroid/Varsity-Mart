import { MainLayout } from "@/components/layout/main-layout"
import { MessagesPageContent } from "@/components/messages/messages-page-content"

export const metadata = {
  title: "Messages - VarsityMart",
  description: "Your conversations on VarsityMart",
}

export default function MessagesPage() {
  return (
    <MainLayout showFooter={false}>
      <MessagesPageContent />
    </MainLayout>
  )
}
