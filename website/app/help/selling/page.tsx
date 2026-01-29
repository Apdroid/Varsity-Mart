import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, BookOpen, Package, Camera, DollarSign, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Seller Guide | VarsityMart Help",
  description: "Learn how to sell on VarsityMart and maximize your sales.",
}

export default function SellingGuidePage() {
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
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Seller Guide</h1>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            Everything you need to know about selling on VarsityMart. Follow these tips to make successful sales!
          </p>

          <div className="space-y-8">
            {/* Getting Started */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                Getting Started
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">1. Create Your Account</h3>
                  <p>Sign up with your university email to verify you're a student. This builds trust with buyers.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">2. Complete Your Profile</h3>
                  <p>Add a profile photo and bio. Buyers are more likely to trust sellers with complete profiles.</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">3. Start Listing Items</h3>
                  <p>Click "Start Selling" from the navigation menu or dashboard to create your first listing.</p>
                </div>
              </div>
            </section>

            {/* Creating Great Listings */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Camera className="h-6 w-6 text-primary" />
                Creating Great Listings
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong className="text-foreground">Take Quality Photos:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use natural lighting and clean backgrounds</li>
                  <li>Show the item from multiple angles</li>
                  <li>Include close-ups of any defects or wear</li>
                  <li>First photo should be your best shot - it appears in search results</li>
                </ul>
                <p><strong className="text-foreground">Write Clear Descriptions:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be honest about condition and any flaws</li>
                  <li>Include brand, model, size, and other relevant details</li>
                  <li>Mention if original packaging or accessories are included</li>
                  <li>Specify pickup location or delivery options</li>
                </ul>
              </div>
            </section>

            {/* Pricing */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                Pricing Your Items
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>Set competitive prices to sell faster:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Research similar items on VarsityMart to see market prices</li>
                  <li>Consider the item's age, condition, and original price</li>
                  <li>Price slightly below market value for quick sales</li>
                  <li>Be willing to negotiate, but set a minimum price in mind</li>
                  <li>
                    Check our{" "}
                    <Link href="/help/fees" className="text-primary hover:underline">
                      Fees & Pricing page
                    </Link>{" "}
                    to understand any platform fees
                  </li>
                </ul>
              </div>
            </section>

            {/* Managing Sales */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                Managing Your Sales
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong className="text-foreground">Respond Quickly:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Reply to messages within 24 hours</li>
                  <li>Be friendly and professional in all communications</li>
                  <li>Answer questions thoroughly and honestly</li>
                </ul>
                <p><strong className="text-foreground">Safe Meetups:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Meet in public, well-lit areas on campus</li>
                  <li>Bring a friend if you feel uncomfortable</li>
                  <li>Exchange items in daylight hours when possible</li>
                  <li>
                    Review our{" "}
                    <Link href="/help/safety" className="text-primary hover:underline">
                      Safety Guidelines
                    </Link>
                  </li>
                </ul>
              </div>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Shipping Options
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>For items you're willing to ship:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Package items securely with bubble wrap or padding</li>
                  <li>Include tracking information for buyers</li>
                  <li>Ship within 2-3 days of receiving payment</li>
                  <li>Consider offering local pickup as an alternative</li>
                </ul>
              </div>
            </section>

            {/* Best Practices */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-primary" />
                Best Practices
              </h2>
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Keep your listings up to date - mark items as sold when they're gone</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Be responsive and professional in all interactions</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Refresh your listings periodically to boost visibility</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Build a positive reputation with good service and communication</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Report any suspicious buyers or scam attempts immediately</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 p-6 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Ready to Start Selling?</h3>
              <p className="text-muted-foreground mb-4">List your first item and reach thousands of students on campus!</p>
              <Link
                href="/sell"
                className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
              >
                Create Listing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
