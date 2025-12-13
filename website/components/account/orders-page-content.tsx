"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Package, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockOrders = [
  {
    id: "ORD-001",
    orderNumber: "VM-2024-001",
    status: "delivered",
    date: "Jan 10, 2024",
    total: 4500,
    items: [{ name: 'MacBook Pro 13" M2', image: "/silver-macbook-on-desk.png", price: 4500, quantity: 1 }],
  },
  {
    id: "ORD-002",
    orderNumber: "VM-2024-002",
    status: "shipped",
    date: "Jan 8, 2024",
    total: 650,
    items: [{ name: "Wireless Earbuds - Sony", image: "/wireless-earbuds-sony.jpg", price: 650, quantity: 1 }],
  },
  {
    id: "ORD-003",
    orderNumber: "VM-2024-003",
    status: "processing",
    date: "Jan 5, 2024",
    total: 85,
    items: [{ name: "Calculus Textbook", image: "/calculus-textbook.png", price: 85, quantity: 1 }],
  },
  {
    id: "ORD-004",
    orderNumber: "VM-2024-004",
    status: "cancelled",
    date: "Jan 2, 2024",
    total: 120,
    items: [{ name: "Vintage Denim Jacket", image: "/denim-jacket-vintage.jpg", price: 120, quantity: 1 }],
  },
]

const statusColors = {
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400",
}

export function OrdersPageContent() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = activeTab === "all" ? mockOrders : mockOrders.filter((order) => order.status === activeTab)

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/account" className="hover:text-foreground">
          Account
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Orders</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Orders</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search orders..." className="pl-10" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="border border-border rounded-xl overflow-hidden bg-card">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/50 border-b border-border">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order Number</p>
                      <p className="font-medium text-foreground">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium text-foreground">GH₵{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]} variant="secondary">
                    {order.status}
                  </Badge>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × GH₵{item.price.toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="bg-transparent shrink-0">
                        <Link href={`/account/orders/${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg text-foreground mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">You don&apos;t have any orders in this category yet.</p>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
