"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Truck } from "lucide-react"
import Link from "next/link"

const restaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    rating: 4.8,
    reviews: 234,
    deliveryTime: "15-25 min",
    cuisine: "Pizza",
    minOrder: "GH₵ 20",
    freeDelivery: true,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    name: "Campus Grill House",
    rating: 4.9,
    reviews: 189,
    deliveryTime: "20-30 min",
    cuisine: "Burgers",
    minOrder: "GH₵ 25",
    freeDelivery: true,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    name: "Mama's Kitchen",
    rating: 4.7,
    reviews: 312,
    deliveryTime: "25-35 min",
    cuisine: "Local Food",
    minOrder: "GH₵ 15",
    freeDelivery: false,
    image: "/placeholder.svg?height=200&width=400",
  },
]

export function PopularRestaurants() {
  return (
    <section id="restaurants" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900">Popular Restaurants</h2>
          <Link href="/restaurants" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
            See All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-md h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {restaurant.freeDelivery && (
                      <Badge className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-600 text-white">
                        <Truck className="w-3 h-3 mr-1" />
                        Free Delivery
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{restaurant.name}</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{restaurant.rating}</span>
                        <span className="text-muted-foreground text-sm">({restaurant.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Clock className="w-4 h-4" />
                        {restaurant.deliveryTime}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                        {restaurant.cuisine}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Min: {restaurant.minOrder}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
