import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Sparkles } from "lucide-react"

const quickCategories = ["Hot Wings", "Pizza", "Burgers", "Coffee", "Snacks"]

export function NightShopBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date()
      const hours = now.getHours()
      const open = hours >= 22 || hours < 3
      setIsOpen(open)

      if (!open) {
        const target = new Date()
        if (hours >= 3) {
          target.setHours(22, 0, 0, 0)
        } else {
          target.setDate(target.getDate() - 1)
          target.setHours(22, 0, 0, 0)
        }
        const diff = target.getTime() - now.getTime()
        const h = Math.floor(diff / (1000 * 60 * 60))
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeRemaining(`Opens in ${h}h ${m}m`)
      } else {
        setTimeRemaining("")
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="night-shop" className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-black" />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          <Badge
            className={`text-sm px-4 py-1.5 ${
              isOpen
                ? "bg-green-500/20 text-green-400 border-green-500/30"
                : "bg-red-500/20 text-red-400 border-red-500/30"
            } border`}
          >
            <span className={`w-2 h-2 rounded-full mr-2 ${isOpen ? "bg-green-400" : "bg-red-400"} animate-pulse`} />
            {isOpen ? "Open Now" : timeRemaining}
          </Badge>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <Moon className="w-8 h-8 md:w-10 md:h-10 text-[#7dd3fc]" />
          <h2 className="text-3xl md:text-5xl font-bold text-white">NIGHT SHOP</h2>
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-[#7dd3fc]" />
        </div>

        <p className="text-[#7dd3fc] text-lg md:text-xl mb-2">Open 10 PM - 3 AM</p>
        <p className="text-blue-300/80 text-base md:text-lg mb-8">Late night cravings? We&apos;ve got you covered!</p>

        {/* Quick Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {quickCategories.map((cat) => (
            <Badge
              key={cat}
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-4 py-2 text-sm cursor-pointer transition-colors"
            >
              {cat}
            </Badge>
          ))}
        </div>

        <Button size="lg" className="bg-[#3b82f6] hover:bg-[#0ea5e9] text-white font-semibold text-lg px-8 h-12">
          Explore Night Menu
        </Button>
      </div>
    </section>
  )
}
