import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, FileText, Scale, AlertCircle, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | VarsityMart",
  description: "Read the Terms of Service for using VarsityMart platform.",
}

export default function TermsPage() {
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
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
              <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Welcome to VarsityMart. By accessing or using our platform, you agree to be bound by these Terms of Service.
            </p>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Acceptance of Terms</h2>
              </div>
              <p className="text-muted-foreground">
                By creating an account and using VarsityMart, you accept and agree to be bound by these Terms of Service and our
                Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">User Eligibility</h2>
              </div>
              <p className="text-muted-foreground mb-4">To use VarsityMart, you must:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Be currently enrolled as a student or be affiliated with a university</li>
                <li>Be at least 18 years old or have parental consent</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not have been previously banned from the platform</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Marketplace Rules</h2>
              <p className="text-muted-foreground mb-4">When buying or selling on VarsityMart:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>All listings must be accurate and honest</li>
                <li>Prohibited items (weapons, drugs, counterfeit goods) are strictly forbidden</li>
                <li>Transactions must comply with local laws and university policies</li>
                <li>Buyers and sellers are responsible for meeting in safe, public locations</li>
                <li>Disputes should be resolved directly between parties or reported to administrators</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">User Conduct</h2>
              <p className="text-muted-foreground mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Post false, misleading, or fraudulent content</li>
                <li>Harass, abuse, or threaten other users</li>
                <li>Impersonate any person or entity</li>
                <li>Violate any intellectual property rights</li>
                <li>Attempt to hack, scrape, or compromise the platform</li>
                <li>Use the platform for any illegal activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Fees and Payments</h2>
              <p className="text-muted-foreground">
                VarsityMart may charge fees for certain services, such as premium listings or featured placements. All fees will be
                clearly displayed before you complete a transaction. Payments are processed securely through our payment partners.
                See our{" "}
                <Link href="/help/fees" className="text-primary hover:underline">
                  Fees & Pricing page
                </Link>{" "}
                for details.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
              </div>
              <p className="text-muted-foreground">
                VarsityMart is a platform that connects buyers and sellers. We are not responsible for the quality, safety, or
                legality of items listed, the ability of sellers to complete sales, or the ability of buyers to complete purchases.
                Use the platform at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Account Termination</h2>
              <p className="text-muted-foreground">
                We reserve the right to suspend or terminate your account at any time for violations of these Terms of Service,
                fraudulent activity, or any behavior that harms the community.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms of Service from time to time. We will notify you of significant changes via email or
                platform notifications. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li>Email: legal@varsitymart.com</li>
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
