"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, ShoppingBag, CreditCard, Truck, UserCircle, Shield, Store } from "lucide-react"

export default function HelpPageContent() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { icon: ShoppingBag, title: "Buying", count: 8 },
    { icon: Store, title: "Selling", count: 6 },
    { icon: CreditCard, title: "Payments", count: 5 },
    { icon: Truck, title: "Delivery", count: 7 },
    { icon: UserCircle, title: "Account", count: 6 },
    { icon: Shield, title: "Safety", count: 4 },
  ]

  const faqs = [
    {
      category: "Buying",
      questions: [
        {
          q: "How do I place an order on VarsityMart?",
          a: "Browse products, add items to your cart, and proceed to checkout. Select your delivery location (hostel or pickup point), choose a payment method, and confirm your order. You'll receive a confirmation email with order details.",
        },
        {
          q: "Can I cancel my order?",
          a: "Yes, you can cancel your order within 1 hour of placing it, provided it hasn't been shipped yet. Go to your Orders page and click 'Cancel Order'. After shipping, you'll need to contact the seller directly.",
        },
        {
          q: "How do I contact a seller?",
          a: "On any product page, click the 'Message Seller' button to start a conversation. You can also find the seller's profile and contact them from there. All messages are kept within the VarsityMart platform for your safety.",
        },
      ],
    },
    {
      category: "Selling",
      questions: [
        {
          q: "How do I start selling on VarsityMart?",
          a: "Create an account with your student email, verify your identity through our KYC process, and click 'Start Selling'. You can then create product listings with photos, descriptions, and prices.",
        },
        {
          q: "What can I sell on VarsityMart?",
          a: "You can sell textbooks, electronics, fashion items, room essentials, study materials, and more. All items must be legal, safe, and appropriate for a campus marketplace. Prohibited items include weapons, alcohol, and counterfeit goods.",
        },
        {
          q: "How do I get paid for my sales?",
          a: "Earnings are deposited to your VarsityMart wallet after the buyer confirms delivery. You can withdraw to your bank account at any time. Processing takes 1-2 business days.",
        },
      ],
    },
    {
      category: "Payments",
      questions: [
        {
          q: "What payment methods are accepted?",
          a: "We accept bank transfers, debit cards (Visa, Mastercard, Verve), and VarsityMart wallet balance. All transactions are processed securely through our payment partners.",
        },
        {
          q: "Is my payment information secure?",
          a: "Yes, we use industry-standard encryption and never store your full card details. All payments are processed through certified payment gateways with fraud protection.",
        },
      ],
    },
    {
      category: "Delivery",
      questions: [
        {
          q: "How long does delivery take?",
          a: "For on-campus deliveries, orders typically arrive within 1-2 hours during business hours. Off-campus deliveries may take 1-3 days depending on location.",
        },
        {
          q: "Can I track my order?",
          a: "Yes! Once your order is shipped, you'll receive tracking updates via SMS and email. You can also track your order in real-time from the Orders page in your account.",
        },
        {
          q: "What if my order doesn't arrive?",
          a: "Contact our support team immediately. We'll investigate with the seller and delivery partner. If the item can't be located, you'll receive a full refund.",
        },
      ],
    },
    {
      category: "Account",
      questions: [
        {
          q: "How do I verify my student status?",
          a: "During registration, enter your university email address (ending in .edu.ng or similar). We'll send a verification link. You can also upload your student ID for additional verification.",
        },
        {
          q: "I forgot my password. How do I reset it?",
          a: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a reset link. The link expires after 24 hours for security.",
        },
      ],
    },
    {
      category: "Safety",
      questions: [
        {
          q: "How does VarsityMart protect buyers?",
          a: "We hold payment in escrow until you confirm delivery and satisfaction. If there's an issue, our dispute resolution team will help. All sellers are verified students.",
        },
        {
          q: "What should I do if I encounter a scam?",
          a: "Report the user immediately through their profile or contact support. Never complete transactions outside VarsityMart, share personal banking details, or meet in isolated locations.",
        },
      ],
    },
  ]

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-muted-foreground mb-6">Find answers to your questions or contact our support team</p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((category) => (
            <Card key={category.title} className="text-center cursor-pointer hover:border-blue-300 transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <category.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.count} articles</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{searchQuery ? "Search Results" : "Frequently Asked Questions"}</h2>

        {filteredFaqs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No results found for &quot;{searchQuery}&quot;</p>
              <p className="text-sm mt-2">Try different keywords or browse our categories above</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredFaqs.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.category}-${index}`}>
                        <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-4">Our support team is available to assist you with any questions</p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
