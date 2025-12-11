"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Star, ChevronRight, BadgeCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockStores } from "@/data/stores/stores"

export function StoresPageContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Stores</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Campus Stores</h1>
          <p className="text-muted-foreground">Discover verified student-run businesses on campus</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search stores..." className="pl-10" />
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStores.map((store) => (
          <Link
            key={store.id}
            href={`/stores/${store.id}`}
            className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Banner */}
            <div className="relative h-32 bg-gradient-to-br text-primary text-primary dark:text-primary dark:text-primary">
              {store.banner && (
                <Image src={store.banner || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
              )}
              {!store.isOpen && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <Badge variant="secondary">Currently Closed</Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-3 -mt-10 relative">
                <div className="w-16 h-16 rounded-xl border-4 border-card bg-background overflow-hidden shrink-0">
                  <Image
                    src={store.logo || "/placeholder.svg?height=64&width=64&query=store logo"}
                    alt={store.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="pt-8 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {store.name}
                    </h3>
                    {store.isVerified && <BadgeCheck className="h-4 w-4 text-primary shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{store.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{store.rating}</span>
                  <span className="text-muted-foreground">({store.reviewsCount})</span>
                </div>
                <span className="text-sm text-muted-foreground">{store.productsCount} products</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
