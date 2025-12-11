"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, Search, Package } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "Step 1",
    title: "Sign Up & Verify",
    description: "Quick student verification with your campus email. Takes less than 2 minutes.",
  },
  {
    icon: Search,
    step: "Step 2",
    title: "Browse & Chat",
    description: "Explore thousands of items from verified sellers. Chat directly before buying.",
  },
  {
    icon: Package,
    step: "Step 3",
    title: "Order & Track",
    description: "Secure delivery with escrow payment protection. Track your order in real-time.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-12">How Varsity Mart Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600" />

          {steps.map((item, index) => (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center mb-6 shadow-lg">
                <item.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>

              <span className="text-sm font-semibold text-sky-500 mb-2">{item.step}</span>

              <h3 className="text-xl font-bold text-blue-900 mb-3">{item.title}</h3>

              <p className="text-muted-foreground max-w-[280px]">{item.description}</p>

              {index < steps.length - 1 && (
                <div className="md:hidden my-6 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 h-12">
            Get Started Free →
          </Button>
        </div>
      </div>
    </section>
  )
}
