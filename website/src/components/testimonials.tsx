"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    text: "Varsity Mart made selling my old textbooks so easy! Got verified buyers within hours and the escrow payment gave me peace of mind.",
    name: "Kwame Asante",
    year: "Year 3, Computer Science",
    avatar: "/african-male-student-portrait.jpg",
  },
  {
    id: 2,
    text: "The Night Shop is a lifesaver during exam season! Fast delivery and great food options when everything else is closed.",
    name: "Ama Mensah",
    year: "Year 2, Business Admin",
    avatar: "/african-female-student-portrait.png",
  },
  {
    id: 3,
    text: "Found my laptop at half the retail price from a graduating senior. The verification system made me feel safe buying expensive items.",
    name: "Kofi Osei",
    year: "Year 1, Engineering",
    avatar: "/african-male-student-smiling-portrait.jpg",
  },
]

const stats = [
  { value: "5,000+", label: "Verified Students" },
  { value: "15,000+", label: "Products Listed" },
  { value: "98%", label: "Satisfaction" },
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-12">What Students Are Saying</h2>

        <div className="hidden md:grid grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-blue-900 mb-6 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-blue-900">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.year}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="md:hidden mb-12">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-blue-900 mb-6 leading-relaxed min-h-[100px]">
                &ldquo;{testimonials[activeIndex].text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={testimonials[activeIndex].avatar || "/placeholder.svg"}
                    alt={testimonials[activeIndex].name}
                  />
                  <AvatarFallback>{testimonials[activeIndex].name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-blue-900">{testimonials[activeIndex].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[activeIndex].year}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" size="icon" onClick={prevTestimonial}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === activeIndex ? "bg-blue-600" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={nextTestimonial}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-4xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
