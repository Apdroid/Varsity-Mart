import { UserCheck, Search, MessageCircle, Package, Store } from "lucide-react"

const steps = [
  {
    title: "Sign Up & Verify",
    description:
      "Create your VarsityMart account using your campus email and complete a fast KYC verification process. We verify students to keep the marketplace safe, real, and scam-free. Verification takes less than two minutes and unlocks full access to buying, selling, and opening shops.",
    icon: UserCheck,
  },
  {
    title: "Browse & Discover",
    description:
      "Explore a vibrant campus marketplace featuring night-shop essentials, food from student-run restaurants, affordable gadgets, fashion, books, and more. Every seller is verified, and every listing is designed for students—no scammers, no overpriced items, just real campus deals.",
    icon: Search,
  },
  {
    title: "Chat & Negotiate",
    description:
      "Message sellers instantly to ask questions, negotiate prices, or arrange pick-ups. Our in-app chat is fast, secure, and student-friendly, helping you confirm item quality and availability before placing an order.",
    icon: MessageCircle,
  },
  {
    title: "Order & Track",
    description:
      "Make purchases securely with mobile money and enjoy escrow-protected payments that guarantee safe delivery. Track every order—from restaurant meals to night-shop items—in real time with intuitive delivery status updates and alerts.",
    icon: Package,
  },
  {
    title: "Open Your Shop",
    description:
      "Want to sell? Launch your own campus shop, mini-restaurant, or service listing directly inside VarsityMart. Upload items, set prices, accept mobile money payments, and manage orders from your dashboard. Perfect for hustlers, cooks, creators, and student entrepreneurs.",
    icon: Store,
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 px-4 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started with VarsityMart in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950">
                    <step.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Step {index + 1}</span>
                </div>
                <h3 className="font-semibold text-lg text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
