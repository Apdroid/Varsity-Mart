import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Briefcase, Heart, Users, TrendingUp, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Careers | VarsityMart",
  description: "Join the VarsityMart team and help revolutionize student marketplaces.",
}

export default function CareersPage() {
  const openPositions = [
    {
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Remote / Hybrid",
      type: "Full-time",
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote / Hybrid",
      type: "Full-time",
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "On-site",
      type: "Full-time",
    },
    {
      title: "Customer Success Specialist",
      department: "Support",
      location: "Remote",
      type: "Full-time",
    },
  ]

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs",
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Professional development and learning budgets",
    },
    {
      icon: Users,
      title: "Great Culture",
      description: "Collaborative environment with amazing team members",
    },
    {
      icon: MapPin,
      title: "Flexible Work",
      description: "Remote-friendly with flexible hours",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us revolutionize how students buy, sell, and connect on campus. We're building something special.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Why Work With Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position) => (
              <div
                key={position.title}
                className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {position.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {position.location}
                      </span>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-8 md:p-12 text-center">
          <Send className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Don't See Your Role?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're always looking for talented people to join our team. Send us your resume and tell us why you'd be a great fit!
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Send Your Resume
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Email us at:{" "}
            <a href="mailto:careers@varsitymart.com" className="text-primary hover:underline">
              careers@varsitymart.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
