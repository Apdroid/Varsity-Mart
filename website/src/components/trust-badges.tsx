import { Lock, UserCheck, Banknote, Headphones } from "lucide-react"

const badges = [
  {
    icon: Lock,
    title: "Secure Payment",
    description: "Bank level encryption",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: UserCheck,
    title: "Student Verified",
    description: "Campus email required",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: Banknote,
    title: "Escrow Protection",
    description: "Money back guarantee",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're always here",
    color: "bg-purple-50 text-purple-600",
  },
]

export function TrustBadges() {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-12">Why Students Trust Us</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${badge.color} flex items-center justify-center mb-4`}
              >
                <badge.icon className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h3 className="font-semibold text-blue-900 mb-1">{badge.title}</h3>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
