import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Shield,
  Truck,
  Flame,
  Utensils,
} from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Your Campus Marketplace",
    subtitle: "Buy, Sell & Order Food - All in One Place",
    cta: "Get Started Free",
    ctaSecondary: "Browse Products",
    gradient: "from-[#1e3a8a] via-[#1e40af] to-[#0f172a]",
    backgroundImage: "/placeholder.svg?height=800&width=1600",
  },
  {
    id: 2,
    title: "Hot Deals & Most Popular",
    subtitle: "Discover trending products and exclusive student discounts",
    cta: "View Deals",
    ctaSecondary: "See Trending",
    gradient: "from-[#0ea5e9] via-[#3b82f6] to-[#1e3a8a]",
    icon: Flame,
    backgroundImage: "/placeholder.svg?height=800&width=1600",
  },
  {
    id: 3,
    title: "Campus Restaurants",
    subtitle: "Order from your favorite campus eateries - delivered fast",
    cta: "Order Food",
    ctaSecondary: "See Restaurants",
    gradient: "from-[#0f172a] via-[#1e3a8a] to-[#0ea5e9]",
    icon: Utensils,
    backgroundImage: "/placeholder.svg?height=800&width=1600",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const slide = slides[currentSlide]
  const SlideIcon = slide.icon

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${slide.gradient} transition-all duration-700`}>
      <div className="absolute inset-0">
        <img
          src={slide.backgroundImage || "/placeholder.svg"}
          alt=""
          className="w-full h-full object-cover opacity-20 transition-opacity duration-700"
        />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7dd3fc] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="text-center">
          {/* Location Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="mb-6 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Ashesi University
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Ashesi University</DropdownMenuItem>
              <DropdownMenuItem>University of Ghana</DropdownMenuItem>
              <DropdownMenuItem>KNUST</DropdownMenuItem>
              <DropdownMenuItem>University of Cape Coast</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Slide Icon */}
          {SlideIcon && (
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <SlideIcon className="w-8 h-8 text-[#7dd3fc]" />
              </div>
            </div>
          )}

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance transition-all duration-500">
            {slide.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto text-pretty transition-all duration-500">
            {slide.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-[#7dd3fc] hover:bg-[#a5f3fc] text-[#0f172a] font-semibold text-lg px-8 h-12"
            >
              {slide.cta}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white font-semibold text-lg px-8 h-12"
            >
              {slide.ctaSecondary}
            </Button>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Trust Badges - Only show on first slide */}
          {currentSlide === 0 && (
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-[#7dd3fc]" />
                <span className="text-sm font-medium">Verified Students Only</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Shield className="w-5 h-5 text-[#7dd3fc]" />
                <span className="text-sm font-medium">Secure Escrow Payments</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Truck className="w-5 h-5 text-[#7dd3fc]" />
                <span className="text-sm font-medium">Fast Campus Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
