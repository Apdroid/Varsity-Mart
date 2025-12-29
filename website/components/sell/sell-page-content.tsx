import Link from "next/link"
import { Store, UtensilsCrossed, Package, ArrowRight, Check, Shield, Wallet, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const sellerTypes = [
  {
    id: "products",
    title: "Sell Products",
    description: "List gadgets, books, fashion, and other items for sale",
    icon: Package,
    href: "/sell/products",
    features: ["Unlimited listings", "Set your own prices", "In-app chat with buyers", "Secure escrow payments"],
  },
  {
    id: "store",
    title: "Open a Store",
    description: "Create your own branded campus store with multiple products",
    icon: Store,
    href: "/sell/store",
    features: ["Custom store page", "Inventory management", "Sales analytics", "Promotional tools"],
  },
  {
    id: "food",
    title: "Sell Food",
    description: "Start a campus restaurant or night shop",
    icon: UtensilsCrossed,
    href: "/sell/food",
    features: ["Menu management", "Order notifications", "Delivery tracking", "Customer reviews"],
  },
]

const benefits = [
  {
    icon: Shield,
    title: "Verified Marketplace",
    description: "Only verified students can buy and sell, ensuring trust and safety",
  },
  {
    icon: Wallet,
    title: "Secure Payments",
    description: "Escrow-protected transactions with mobile money support",
  },
  {
    icon: Users,
    title: "Campus Community",
    description: "Access thousands of students looking for products and services",
  },
]

export function SellPageContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Start Your Campus Business</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Join thousands of student entrepreneurs selling products, running stores, and operating food businesses on
          VarsityMart.
        </p>
      </div>

      {/* Seller Types */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {sellerTypes.map((type) => (
          <Card key={type.id} className="relative group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 mb-4">
                <type.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{type.title}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {type.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 gap-2">
                <Link href={type.href}>
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-muted/50 rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">Why Sell on VarsityMart?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 mx-auto mb-4">
                <benefit.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">Have questions about selling on VarsityMart?</p>
        <Button variant="outline" asChild className="bg-transparent">
          <Link href="/help/selling">View Seller Guide</Link>
        </Button>
      </div>
    </div>
  )
}
