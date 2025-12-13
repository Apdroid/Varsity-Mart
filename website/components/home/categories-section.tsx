import Link from "next/link"
import { Laptop, Shirt, BookOpen, UtensilsCrossed, Sparkles, Dumbbell, Home, Gamepad2 } from "lucide-react"

const categories = [
  {
    name: "Electronics",
    icon: Laptop,
    href: "/search?category=electronics",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  },
  {
    name: "Fashion",
    icon: Shirt,
    href: "/search?category=fashion",
    color: "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400",
  },
  {
    name: "Books",
    icon: BookOpen,
    href: "/search?category=books",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    name: "Food",
    icon: UtensilsCrossed,
    href: "/food",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
  },
  {
    name: "Beauty",
    icon: Sparkles,
    href: "/search?category=beauty",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  },
  {
    name: "Sports",
    icon: Dumbbell,
    href: "/search?category=sports",
    color: "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
  },
  {
    name: "Dorm Essentials",
    icon: Home,
    href: "/search?category=home",
    color: "bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400",
  },
  {
    name: "Gaming",
    icon: Gamepad2,
    href: "/search?category=gaming",
    color: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Browse Categories</h2>
          <Link
            href="/categories"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${category.color}`}>
                <category.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
