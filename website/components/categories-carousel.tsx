"use client"
import { Carousel, Card } from "@/components/ui/apple-cards-carousel"

export function CategoriesCarousel() {
  const cards = data.map((card, index) => <Card key={card.src} card={card} index={index} />)

  return (
    <div className="w-full h-full py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-black">
      <h2 className="max-w-7xl pl-4 mx-auto text-2xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200">
        Shop by Category
      </h2>
      <p className="max-w-7xl pl-4 mx-auto mt-4 text-base md:text-lg text-neutral-600 dark:text-neutral-400">
        Find exactly what you need from our wide range of categories
      </p>
      <Carousel items={cards} />
    </div>
  )
}

const CategoryContent = ({ items }: { items: string[] }) => {
  return (
    <div className="bg-gray-50 dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-xl max-w-3xl mx-auto mb-6">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">Popular items in this category</span>
      </p>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-neutral-900 p-4 rounded-lg">
            <p className="text-sm md:text-base text-neutral-700 dark:text-neutral-300">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const data = [
  {
    category: "Textbooks",
    title: "Save up to 80% on textbooks",
    src: "/college-textbooks-on-shelf.jpg",
    content: <CategoryContent items={["Math & Science", "Literature & Arts", "Business & Economics", "Engineering"]} />,
  },
  {
    category: "Electronics",
    title: "Laptops, tablets, and more",
    src: "/laptop-and-tablet-on-desk.jpg",
    content: (
      <CategoryContent
        items={["Laptops & Computers", "Tablets & E-readers", "Phones & Accessories", "Gaming Consoles"]}
      />
    ),
  },
  {
    category: "Furniture",
    title: "Furnish your dorm or apartment",
    src: "/modern-dorm-room-furniture.jpg",
    content: <CategoryContent items={["Desks & Chairs", "Beds & Mattresses", "Storage Solutions", "Decorations"]} />,
  },
  {
    category: "Fashion",
    title: "Style for every occasion",
    src: "/casual-student-fashion-clothes.jpg",
    content: <CategoryContent items={["Casual Wear", "Formal Attire", "Shoes & Accessories", "Athletic Wear"]} />,
  },
  {
    category: "Sports & Fitness",
    title: "Stay active on campus",
    src: "/sports-equipment-and-fitness-gear.jpg",
    content: <CategoryContent items={["Gym Equipment", "Bicycles", "Team Sports Gear", "Outdoor Recreation"]} />,
  },
  {
    category: "School Supplies",
    title: "Everything for your studies",
    src: "/notebooks-pens-school-supplies.jpg",
    content: <CategoryContent items={["Notebooks & Binders", "Art Supplies", "Calculators", "Backpacks & Bags"]} />,
  },
]
