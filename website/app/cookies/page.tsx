import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Cookie, Settings, Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Cookie Policy | VarsityMart",
  description: "Learn about how VarsityMart uses cookies and tracking technologies.",
}

export default function CookiesPage() {
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
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Cookie Policy</h1>
              <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              This Cookie Policy explains how VarsityMart uses cookies and similar tracking technologies.
            </p>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">What Are Cookies?</h2>
              </div>
              <p className="text-muted-foreground">
                Cookies are small text files that are stored on your device when you visit a website. They help websites remember
                your preferences, improve your experience, and provide analytics about how the site is used.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Essential Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies are necessary for the website to function properly. They enable core functionality such as
                    security, authentication, and session management. You cannot opt-out of these cookies.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Performance Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies collect information about how visitors use our website, such as which pages are most popular
                    and if users encounter errors. This helps us improve the website's performance.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Functionality Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies allow the website to remember choices you make (such as your username, language, or region) and
                    provide enhanced, personalized features.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Targeting/Advertising Cookies</h3>
                  <p className="text-muted-foreground">
                    These cookies are used to deliver content more relevant to you and your interests. They may be used to limit
                    the number of times you see an advertisement and measure the effectiveness of campaigns.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We may use third-party services that set cookies on our behalf, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Analytics services (e.g., Google Analytics) to understand website usage</li>
                <li>Payment processors for secure transaction handling</li>
                <li>Social media platforms for sharing and integration features</li>
                <li>Advertising partners to deliver relevant ads</li>
              </ul>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Managing Cookies</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies through their settings.
                  However, blocking all cookies may prevent some features from working properly.
                </li>
                <li>
                  <strong>Opt-Out Tools:</strong> You can opt out of targeted advertising cookies through industry opt-out pages.
                </li>
                <li>
                  <strong>Cookie Preferences:</strong> You can manage your cookie preferences through our cookie consent banner
                  when you first visit the site.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons.
                Please review this page periodically for the latest information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about our use of cookies, please contact us:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li>Email: privacy@varsitymart.com</li>
                <li>
                  Visit our{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    Contact Page
                  </Link>
                </li>
                <li>
                  Read our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
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
