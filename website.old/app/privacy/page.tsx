import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, UserCheck, Database, Cookie } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | VarsityMart",
  description: "Learn how VarsityMart protects your privacy and handles your data.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
              <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              At VarsityMart, we take your privacy seriously. This policy explains how we collect, use, and protect your information.
            </p>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
              </div>
              <p className="text-muted-foreground mb-4">We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information (name, email, university, student ID)</li>
                <li>Profile information and preferences</li>
                <li>Product listings and transaction data</li>
                <li>Messages and communications</li>
                <li>Payment and billing information</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">How We Use Your Information</h2>
              </div>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Protect against fraudulent or illegal activity</li>
                <li>Personalize your experience on the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Data Security</h2>
              </div>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your personal information. This includes encryption,
                secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure,
                and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Your Rights</h2>
              </div>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access and review your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Cookie className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Cookies and Tracking</h2>
              </div>
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to improve your experience, analyze usage patterns, and deliver
                personalized content. You can control cookies through your browser settings. For more information, see our{" "}
                <Link href="/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li>Email: privacy@varsitymart.com</li>
                <li>
                  Visit our{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    Contact Page
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
