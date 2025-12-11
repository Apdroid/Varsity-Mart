"use client"

import { Smartphone, BookOpen, Shirt, Pizza, Home, Pencil, Gamepad2, Bike } from "lucide-react"

const categories = [
  { icon: Smartphone, name: "Electronics", count: "1.2k items", color: "bg-blue-50 text-blue-600" },
  { icon: BookOpen, name: "Books", count: "856 items", color: "bg-amber-50 text-amber-600" },
  { icon: Shirt, name: "Fashion", count: "2.3k items", color: "bg-pink-50 text-pink-600" },
  { icon: Pizza, name: "Food", count: "340 stores", color: "bg-orange-50 text-orange-600" },
  { icon: Home, name: "Housing", count: "128 listings", color: "bg-sky-50 text-sky-600" },
  { icon: Pencil, name: "Stationery", count: "654 items", color: "bg-purple-50 text-purple-600" },
  { icon: Gamepad2, name: "Gaming", count: "432 items", color: "bg-red-50 text-red-600" },
  { icon: Bike, name: "Services", count: "89 providers", color: "bg-teal-50 text-teal-600" },
]

export function QuickCategories() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 text-center">Shop by Category</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
          {categories.map((category) => (
            <a
              key={category.name}
              href="#"
              className="group flex flex-col items-center p-4 md:p-6 rounded-xl bg-white border border-border hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                <category.icon className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <span className="font-semibold text-blue-900 text-sm md:text-base text-center">{category.name}</span>
              <span className="text-xs text-muted-foreground mt-1">{category.count}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
