import type { Metadata } from "next"
import MainLayout from "@/components/layout/main-layout"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  BookOpen,
  Laptop,
  Shirt,
  Bed,
  ShoppingBag,
  Utensils,
  Smartphone,
  Headphones,
  Dumbbell,
  Palette,
  Music,
  Camera,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Categories | VarsityMart",
  description: "Browse all product categories on VarsityMart",
}

export default function CategoriesPage() {
  const categories = [
    {
      name: "Textbooks",
      icon: BookOpen,
      count: 2340,
      color: "bg-blue-100 text-blue-600",
      href: "/search?category=textbooks",
    },
    {
      name: "Electronics",
      icon: Laptop,
      count: 1856,
      color: "bg-purple-100 text-purple-600",
      href: "/search?category=electronics",
    },
    { name: "Fashion", icon: Shirt, count: 3421, color: "bg-pink-100 text-pink-600", href: "/search?category=fashion" },
    {
      name: "Room Essentials",
      icon: Bed,
      count: 987,
      color: "bg-green-100 text-green-600",
      href: "/search?category=room-essentials",
    },
    {
      name: "Accessories",
      icon: ShoppingBag,
      count: 1543,
      color: "bg-orange-100 text-orange-600",
      href: "/search?category=accessories",
    },
    {
      name: "Food & Snacks",
      icon: Utensils,
      count: 654,
      color: "bg-red-100 text-red-600",
      href: "/search?category=food",
    },
    {
      name: "Phones & Tablets",
      icon: Smartphone,
      count: 876,
      color: "bg-cyan-100 text-cyan-600",
      href: "/search?category=phones",
    },
    {
      name: "Audio",
      icon: Headphones,
      count: 432,
      color: "bg-indigo-100 text-indigo-600",
      href: "/search?category=audio",
    },
    {
      name: "Sports & Fitness",
      icon: Dumbbell,
      count: 321,
      color: "bg-emerald-100 text-emerald-600",
      href: "/search?category=sports",
    },
    {
      name: "Art Supplies",
      icon: Palette,
      count: 234,
      color: "bg-amber-100 text-amber-600",
      href: "/search?category=art",
    },
    {
      name: "Musical Instruments",
      icon: Music,
      count: 156,
      color: "bg-rose-100 text-rose-600",
      href: "/search?category=music",
    },
    {
      name: "Photography",
      icon: Camera,
      count: 198,
      color: "bg-slate-100 text-slate-600",
      href: "/search?category=photography",
    },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Categories</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find everything you need for campus life. From textbooks to tech, fashion to food.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div
                    className={`h-16 w-16 rounded-2xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count.toLocaleString()} items</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
