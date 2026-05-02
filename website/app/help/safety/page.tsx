import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Shield, Users, MapPin, Eye, AlertTriangle, CheckCircle, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Safety Guidelines | VarsityMart Help",
  description: "Stay safe while buying and selling on VarsityMart with these important safety tips.",
}

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/help"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Help Center
        </Link>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Safety Guidelines</h1>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-8 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Your Safety is Our Priority</h3>
              <p className="text-sm text-muted-foreground">
                Follow these guidelines to ensure safe transactions. If something feels wrong, trust your instincts and walk away.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Meeting Safely */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Safe Meeting Locations
              </h2>
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Recommended Locations
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                    <li>Campus libraries and student centers</li>
                    <li>University coffee shops or cafeterias</li>
                    <li>Campus security offices or police stations</li>
                    <li>Well-lit outdoor areas with foot traffic</li>
                    <li>Campus bookstores or retail areas</li>
                  </ul>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Avoid These Locations
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                    <li>Private residences or dorm rooms (especially for first meetings)</li>
                    <li>Isolated or poorly lit areas</li>
                    <li>Empty parking lots or buildings</li>
                    <li>Locations far from campus or unfamiliar areas</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Best Practices:</h3>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Always meet during daylight hours when possible</li>
                    <li>• Bring a friend or let someone know where you're going</li>
                    <li>• Share your meeting location with a trusted contact</li>
                    <li>• Keep your phone charged and accessible</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Recognizing Scams */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                Recognizing Scams
              </h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">Watch out for these common red flags:</p>
                
                <div className="space-y-3">
                  <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
                    <p className="font-semibold text-foreground mb-1">🚩 Too Good to Be True Prices</p>
                    <p className="text-sm text-muted-foreground">
                      If a MacBook is listed for $200, it's likely a scam. Research typical prices for items.
                    </p>
                  </div>

                  <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
                    <p className="font-semibold text-foreground mb-1">🚩 Requests to Move Off-Platform</p>
                    <p className="text-sm text-muted-foreground">
                      Scammers may ask you to communicate via text, email, or other apps to avoid detection.
                    </p>
                  </div>

                  <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
                    <p className="font-semibold text-foreground mb-1">🚩 Payment Before Inspection</p>
                    <p className="text-sm text-muted-foreground">
                      Never pay for items (especially via wire transfer or gift cards) before seeing them in person.
                    </p>
                  </div>

                  <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
                    <p className="font-semibold text-foreground mb-1">🚩 Overpayment Schemes</p>
                    <p className="text-sm text-muted-foreground">
                      Buyer sends too much money and asks for a refund of the difference - classic scam.
                    </p>
                  </div>

                  <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
                    <p className="font-semibold text-foreground mb-1">🚩 Urgency or Pressure</p>
                    <p className="text-sm text-muted-foreground">
                      "I need it today" or "My friend will pick it up" - scammers create urgency to bypass caution.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Safety */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                Safe Payment Practices
              </h2>
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">✅ Recommended Payment Methods:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                    <li>Cash in person (count before handing over item)</li>
                    <li>VarsityMart's integrated payment system (buyer protection)</li>
                    <li>Venmo, CashApp, or Zelle ONLY after inspecting item in person</li>
                    <li>University payment systems if available</li>
                  </ul>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">❌ Never Use:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground text-sm">
                    <li>Wire transfers (Western Union, MoneyGram)</li>
                    <li>Gift cards or prepaid cards</li>
                    <li>Cryptocurrency for local transactions</li>
                    <li>Personal checks from strangers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Personal Information */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Protecting Your Information
              </h2>
              <div className="bg-muted/50 rounded-lg p-4">
                <ul className="space-y-3 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Keep Communication on Platform:</strong> Use VarsityMart's messaging
                    system until you're ready to meet
                  </li>
                  <li>
                    <strong className="text-foreground">Don't Share Personal Details:</strong> Avoid giving out your home
                    address, full name, or student ID before meeting
                  </li>
                  <li>
                    <strong className="text-foreground">Verify University Email:</strong> Look for verified student badges on
                    profiles
                  </li>
                  <li>
                    <strong className="text-foreground">Check Seller/Buyer History:</strong> Review ratings and previous
                    transactions
                  </li>
                </ul>
              </div>
            </section>

            {/* Reporting Issues */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Phone className="h-6 w-6 text-primary" />
                If Something Goes Wrong
              </h2>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <p className="text-muted-foreground mb-4">If you encounter suspicious activity or feel unsafe:</p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Report Immediately:</strong> Use our{" "}
                      <Link href="/report" className="text-primary hover:underline">
                        Report Issue
                      </Link>{" "}
                      form
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Contact Campus Security:</strong> Don't hesitate to call if you feel
                      threatened
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Email Safety Team:</strong> safety@varsitymart.com
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Document Everything:</strong> Take screenshots of suspicious messages
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Final Reminder */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Trust Your Instincts</h3>
              <p className="text-muted-foreground mb-4">
                If something doesn't feel right, it probably isn't. Your safety is more important than any transaction.
              </p>
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <Link href="/contact" className="text-primary hover:underline font-medium">
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
