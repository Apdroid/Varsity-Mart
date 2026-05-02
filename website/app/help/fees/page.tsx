import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, DollarSign, CreditCard, TrendingUp, Info, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Fees & Pricing | VarsityMart Help",
  description: "Understand VarsityMart's fee structure and pricing options.",
}

export default function FeesPage() {
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
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Fees & Pricing</h1>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            VarsityMart's transparent fee structure helps you understand exactly what you'll pay or earn.
          </p>

          <div className="space-y-8">
            {/* Basic Listings */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                Free for Students
              </h2>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <p className="text-lg font-semibold text-foreground mb-2">
                  Basic Listings: 100% FREE
                </p>
                <p className="text-muted-foreground mb-4">
                  We believe in keeping things simple for students. That's why basic listings are completely free - no hidden fees,
                  no surprises.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>List unlimited items for free</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>No commission on direct sales</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Keep 100% of your sale price</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Access to messaging and buyer tools</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Premium Features */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Optional Premium Features
              </h2>
              <p className="text-muted-foreground mb-4">
                Boost your listings with optional premium features to sell faster:
              </p>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground">Featured Listing</h3>
                    <span className="text-lg font-bold text-primary">$2.99</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Boost your listing to the top of search results and category pages for 7 days
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    <li>2-3x more views on average</li>
                    <li>Highlighted with "Featured" badge</li>
                    <li>Priority placement in search</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground">Listing Boost</h3>
                    <span className="text-lg font-bold text-primary">$0.99</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Refresh your listing to appear as "newly posted" for 48 hours
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Perfect for older listings</li>
                    <li>Appears in "Recently Added"</li>
                    <li>Can be used multiple times</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground">Gallery Spotlight</h3>
                    <span className="text-lg font-bold text-primary">$4.99</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Featured placement on homepage carousel for 3 days
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    <li>Maximum visibility</li>
                    <li>Homepage exposure to all users</li>
                    <li>Best for high-value items</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Payment Processing */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" />
                Payment Processing (Optional)
              </h2>
              <p className="text-muted-foreground mb-4">
                If you choose to use VarsityMart's integrated payment system instead of cash:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-foreground">Processing Fee</h3>
                  <span className="text-lg font-bold text-primary">2.9% + $0.30</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Standard payment processing rate (covers payment gateway costs)
                </p>
                <div className="bg-background rounded p-3 text-sm">
                  <p className="text-muted-foreground mb-1">Example:</p>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Item Price:</span>
                    <span>$50.00</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Processing Fee:</span>
                    <span>-$1.75</span>
                  </div>
                  <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border mt-2">
                    <span>You Receive:</span>
                    <span className="text-primary">$48.25</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Seller Dashboard */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Understanding Your Fees
              </h2>
              <div className="bg-muted/50 rounded-lg p-4">
                <ul className="space-y-3 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">No Listing Fees:</strong> Create as many listings as you want for free
                  </li>
                  <li>
                    <strong className="text-foreground">No Monthly Fees:</strong> We don't charge subscription or membership fees
                  </li>
                  <li>
                    <strong className="text-foreground">No Hidden Charges:</strong> All optional fees are clearly displayed before
                    you purchase
                  </li>
                  <li>
                    <strong className="text-foreground">Cash Transactions:</strong> If you accept cash in person, there are zero
                    fees
                  </li>
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">When do I pay fees?</h3>
                  <p className="text-sm text-muted-foreground">
                    Premium features are paid upfront when you purchase them. Payment processing fees are automatically deducted
                    from your sale amount.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Can I get a refund on premium features?</h3>
                  <p className="text-sm text-muted-foreground">
                    Premium features are non-refundable once activated. However, if your item sells before the promotion ends, the
                    remaining time carries no additional cost.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">Are there any bulk discounts?</h3>
                  <p className="text-sm text-muted-foreground">
                    Contact our{" "}
                    <Link href="/contact" className="text-primary hover:underline">
                      support team
                    </Link>{" "}
                    if you're a store owner listing multiple items regularly.
                  </p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Still Have Questions?</h3>
              <p className="text-muted-foreground mb-4">Our support team is here to help!</p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
