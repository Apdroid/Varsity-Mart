"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Star, Clock, MapPin, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Restaurant, MenuItem } from "@/types/models"

const mockRestaurant: Restaurant = {
  id: "1",
  name: "Mama's Kitchen",
  description:
    "Authentic Ghanaian dishes made with love. We use fresh, locally sourced ingredients to bring you the best of home cooking on campus.",
  logo: "/power-bank-black.jpg",
  banner: "/varsity-products.jpg",
  cuisine: ["Local", "Ghanaian"],
  rating: 4.8,
  reviewsCount: 234,
  deliveryTime: "20-30 min",
  deliveryFee: 5,
  minimumOrder: 15,
  isOpen: true,
  operatingHours: {
    monday: { isOpen: true, open: "10:00", close: "21:00" },
    tuesday: { isOpen: true, open: "10:00", close: "21:00" },
    wednesday: { isOpen: true, open: "10:00", close: "21:00" },
    thursday: { isOpen: true, open: "10:00", close: "21:00" },
    friday: { isOpen: true, open: "10:00", close: "22:00" },
    saturday: { isOpen: true, open: "11:00", close: "22:00" },
    sunday: { isOpen: false },
  },
  ownerId: "1",
  owner: {} as any,
  location: {
    id: "1",
    userId: "1",
    label: "Campus",
    street: "Near Main Library",
    city: "University Campus",
    state: "",
    country: "Ghana",
    postalCode: "",
    isDefault: true,
  },
  createdAt: "",
  updatedAt: "",
}

const mockMenu: { category: string; items: MenuItem[] }[] = [
  {
    category: "Popular",
    items: [
      {
        id: "1",
        restaurantId: "1",
        name: "Jollof Rice with Chicken",
        description: "Classic Ghanaian jollof rice served with grilled chicken",
        price: 35,
        image: "/jollof-rice-chicken.jpg",
        category: "Popular",
        isAvailable: true,
        preparationTime: "15 min",
      },
      {
        id: "2",
        restaurantId: "1",
        name: "Banku with Tilapia",
        description: "Fresh banku with grilled tilapia and pepper sauce",
        price: 45,
        image: "/banku-tilapia.jpg",
        category: "Popular",
        isAvailable: true,
        preparationTime: "20 min",
      },
    ],
  },
  {
    category: "Rice Dishes",
    items: [
      {
        id: "3",
        restaurantId: "1",
        name: "Plain Jollof Rice",
        description: "Delicious jollof rice with vegetables",
        price: 20,
        image: "/plain-jollof-rice.jpg",
        category: "Rice Dishes",
        isAvailable: true,
        preparationTime: "15 min",
      },
      {
        id: "4",
        restaurantId: "1",
        name: "Fried Rice with Beef",
        description: "Special fried rice with seasoned beef",
        price: 40,
        image: "/fried-rice-beef.jpg",
        category: "Rice Dishes",
        isAvailable: true,
        preparationTime: "15 min",
      },
      {
        id: "5",
        restaurantId: "1",
        name: "Waakye",
        description: "Rice and beans with fish and eggs",
        price: 30,
        image: "/waakye-meal.jpg",
        category: "Rice Dishes",
        isAvailable: false,
        preparationTime: "15 min",
      },
    ],
  },
  {
    category: "Soups",
    items: [
      {
        id: "6",
        restaurantId: "1",
        name: "Light Soup with Fufu",
        description: "Traditional light soup with pounded fufu",
        price: 35,
        image: "/light-soup-fufu.jpg",
        category: "Soups",
        isAvailable: true,
        preparationTime: "20 min",
      },
      {
        id: "7",
        restaurantId: "1",
        name: "Groundnut Soup",
        description: "Rich groundnut soup with meat",
        price: 40,
        image: "/groundnut-soup.jpg",
        category: "Soups",
        isAvailable: true,
        preparationTime: "20 min",
      },
    ],
  },
  {
    category: "Drinks",
    items: [
      {
        id: "8",
        restaurantId: "1",
        name: "Sobolo",
        description: "Refreshing hibiscus drink",
        price: 8,
        image: "/sobolo-drink.jpg",
        category: "Drinks",
        isAvailable: true,
        preparationTime: "5 min",
      },
      {
        id: "9",
        restaurantId: "1",
        name: "Fresh Fruit Juice",
        description: "Orange, pineapple, or watermelon",
        price: 12,
        image: "/fresh-fruit-juice.jpg",
        category: "Drinks",
        isAvailable: true,
        preparationTime: "5 min",
      },
    ],
  },
]

interface CartItem {
  item: MenuItem
  quantity: number
}

interface RestaurantDetailContentProps {
  restaurantId: string
}

export function RestaurantDetailContent({ restaurantId }: RestaurantDetailContentProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState(mockMenu[0].category)

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id)
      if (existing) {
        return prev.map((c) => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === itemId)
      if (existing && existing.quantity > 1) {
        return prev.map((c) => (c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c))
      }
      return prev.filter((c) => c.item.id !== itemId)
    })
  }

  const getItemQuantity = (itemId: string) => {
    return cart.find((c) => c.item.id === itemId)?.quantity || 0
  }

  const cartTotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0)
  const cartItemsCount = cart.reduce((acc, c) => acc + c.quantity, 0)

  return (
    <div className="relative">
      {/* Banner */}
      <div className="relative h-48 md:h-64">
        <Image
          src={mockRestaurant.banner || "/placeholder.svg"}
          alt={mockRestaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <Link
          href="/food"
          className="absolute top-4 left-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-foreground hover:bg-background transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Restaurant Info */}
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-24 h-24 rounded-xl border-4 border-background bg-background overflow-hidden shrink-0 shadow-lg">
              <Image
                src={mockRestaurant.logo || "/placeholder.svg"}
                alt={mockRestaurant.name}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{mockRestaurant.name}</h1>
                <Badge variant={mockRestaurant.isOpen ? "default" : "secondary"} className="text-slate">
                  {mockRestaurant.isOpen ? "Open" : "Closed"}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-2">{mockRestaurant.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{mockRestaurant.rating}</span>
                  <span className="text-muted-foreground">({mockRestaurant.reviewsCount})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{mockRestaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{mockRestaurant.location.street}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="sticky top-16 z-10 bg-background border-b border-border -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 overflow-x-auto py-3">
            {mockMenu.map((section) => (
              <Button
                key={section.category}
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-full whitespace-nowrap shrink-0",
                  activeCategory === section.category && "text-primary dark:text-primary",
                )}
                onClick={() => setActiveCategory(section.category)}
              >
                {section.category}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="py-6 pb-32 md:pb-6">
          {mockMenu.map((section) => (
            <div
              key={section.category}
              className={cn("mb-8", activeCategory !== section.category && "hidden md:block")}
            >
              <h2 className="text-lg font-semibold text-foreground mb-4">{section.category}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {section.items.map((item) => {
                  const quantity = getItemQuantity(item.id)
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex gap-4 p-4 rounded-xl border border-border bg-card",
                        !item.isAvailable && "opacity-60",
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-semibold text-foreground">GH₵{item.price}</span>
                          {item.isAvailable ? (
                            quantity > 0 ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 rounded-full bg-transparent"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center font-medium">{quantity}</span>
                                <Button
                                  size="icon"
                                  className="h-8 w-8 rounded-full text-slate-100 hover:text-slate-50"
                                  onClick={() => addToCart(item)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="text-slate-100 hover:text-slate-50 gap-1"
                                onClick={() => addToCart(item)}
                              >
                                <Plus className="h-3 w-3" />
                                Add
                              </Button>
                            )
                          ) : (
                            <Badge variant="secondary">Unavailable</Badge>
                          )}
                        </div>
                      </div>
                      {item.image && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sheet (Mobile) */}
      {cartItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full text-primary hover:text-primary gap-2" size="lg">
                <ShoppingBag className="h-5 w-5" />
                View Cart ({cartItemsCount}) - GH₵{cartTotal}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Your Order</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 overflow-y-auto flex-1">
                {cart.map((cartItem) => (
                  <div key={cartItem.item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={cartItem.item.image || "/placeholder.svg"}
                        alt={cartItem.item.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{cartItem.item.name}</p>
                      <p className="text-sm text-muted-foreground">GH₵{cartItem.item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full bg-transparent"
                        onClick={() => removeFromCart(cartItem.item.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center font-medium">{cartItem.quantity}</span>
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-full text-primary hover:text-primary"
                        onClick={() => addToCart(cartItem.item)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">GH₵{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="text-foreground">GH₵{mockRestaurant.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">GH₵{cartTotal + mockRestaurant.deliveryFee}</span>
                </div>
              </div>

              <Button className="w-full mt-6 text-primary hover:text-primary" size="lg">
                Checkout - GH₵{cartTotal + mockRestaurant.deliveryFee}
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  )
}
