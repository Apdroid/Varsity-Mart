import type { Metadata } from "next"
import MainLayout from "@/components/layout/main-layout"
import ContactPageContent from "@/components/contact/contact-page-content"

export const metadata: Metadata = {
  title: "Contact Us | VarsityMart",
  description: "Get in touch with VarsityMart support team",
}

export default function ContactPage() {
  return (
    <MainLayout>
      <ContactPageContent />
    </MainLayout>
  )
}
