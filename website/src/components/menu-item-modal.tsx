import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Clock, Minus, Plus, ShoppingCart } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface MenuItem {
  id: number
  name: string
  description: string
  price: string
  image: string
  popular?: boolean
  sizes?: { name: string; price: string }[]
  addOns?: { name: string; price: string }[]
  tags?: string[]
}

interface MenuItemModalProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (
    itemId: number,
    quantity: number,
    size: string,
    addOns: string[],
    specialInstructions: string,
    totalPrice: number,
  ) => void
  restaurantName: string
  deliveryTime: string
}

export function MenuItemModal({
  item,
  isOpen,
  onClose,
  onAddToCart,
  restaurantName,
  deliveryTime,
}: MenuItemModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("Regular")
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [quantity, setQuantity] = useState(1)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    if (item) {
      setSelectedSize(item.sizes?.[0]?.name || "Regular")
      setSelectedAddOns([])
      setSpecialInstructions("")
      setQuantity(1)
    }
  }, [item])

  if (!item) return null

  const sizes = item.sizes || [
    { name: "Regular", price: item.price },
    { name: "Large", price: `GHC ${(Number.parseFloat(item.price.replace("GHC ", "")) + 7).toFixed(0)}` },
  ]

  const addOns = item.addOns || [
    { name: "Extra Egg", price: "+GHC 3" },
    { name: "Extra Wele", price: "+GHC 5" },
    { name: "Fried Fish", price: "+GHC 8" },
  ]

  const tags = item.tags || ["Spicy", "Filling"]

  const toggleAddOn = (addOnName: string) => {
    setSelectedAddOns((prev) => (prev.includes(addOnName) ? prev.filter((a) => a !== addOnName) : [...prev, addOnName]))
  }

  const calculateTotal = () => {
    const sizePrice = sizes.find((s) => s.name === selectedSize)
    const basePrice = sizePrice
      ? Number.parseFloat(sizePrice.price.replace("GHC ", ""))
      : Number.parseFloat(item.price.replace("GHC ", ""))

    const addOnsPrice = selectedAddOns.reduce((total, addOnName) => {
      const addOn = addOns.find((a) => a.name === addOnName)
      if (addOn) {
        const price = Number.parseFloat(addOn.price.replace("+GHC ", "").replace("GHC ", ""))
        return total + price
      }
      return total
    }, 0)

    return (basePrice + addOnsPrice) * quantity
  }

  const handleAddToCart = () => {
    onAddToCart(item.id, quantity, selectedSize, selectedAddOns, specialInstructions, calculateTotal())
    onClose()
  }

  const ModalContent = (
    <div className="flex flex-col h-full max-h-[90vh] md:max-h-[85vh]">
      {/* Item Image with animation */}
      <motion.div
        className="relative h-48 md:h-56 flex-shrink-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={item.image || "/placeholder.svg?height=224&width=400&query=delicious food dish"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.popular && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <Badge className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-500 text-white">Popular</Badge>
          </motion.div>
        )}
      </motion.div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Item Info */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-blue-900 mb-2">{item.name}</h2>
          <p className="text-muted-foreground mb-3">{item.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, i) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                  {tag}
                </Badge>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              From <span className="font-medium text-blue-900">{restaurantName}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {deliveryTime}
            </span>
          </div>
        </motion.div>

        {/* Size Selection */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-blue-900 mb-3">Select Size</h3>
          <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
            <div className="space-y-3">
              {sizes.map((size, i) => (
                <motion.div
                  key={size.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                >
                  <Label
                    htmlFor={`size-${size.name}`}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedSize === size.name
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={size.name} id={`size-${size.name}`} />
                      <span className="font-medium">{size.name}</span>
                    </div>
                    <span className="font-semibold text-blue-600">{size.price}</span>
                  </Label>
                </motion.div>
              ))}
            </div>
          </RadioGroup>
        </motion.div>

        {/* Add-ons */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-semibold text-blue-900 mb-3">Add-ons (Optional)</h3>
          <div className="space-y-3">
            {addOns.map((addOn, i) => (
              <motion.div
                key={addOn.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
              >
                <Label
                  htmlFor={`addon-${addOn.name}`}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedAddOns.includes(addOn.name)
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`addon-${addOn.name}`}
                      checked={selectedAddOns.includes(addOn.name)}
                      onCheckedChange={() => toggleAddOn(addOn.name)}
                    />
                    <span className="font-medium">{addOn.name}</span>
                  </div>
                  <span className="font-semibold text-blue-600">{addOn.price}</span>
                </Label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Special Instructions */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-blue-900 mb-3">Special Instructions (Optional)</h3>
          <Textarea
            placeholder="E.g., Extra spicy, No onions, etc."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="min-h-24 resize-none border-slate-200"
          />
        </motion.div>

        {/* Quantity */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h3 className="font-semibold text-blue-900 mb-3 text-center">Quantity</h3>
          <div className="flex items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-slate-300 bg-transparent"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-5 h-5" />
              </Button>
            </motion.div>
            <motion.span
              key={quantity}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold w-12 text-center"
            >
              {quantity}
            </motion.span>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-slate-300 bg-transparent"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Sticky Footer */}
      <motion.div
        className="border-t bg-white p-4 flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium">Total</span>
          <motion.span
            key={calculateTotal()}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-blue-900"
          >
            GHC {calculateTotal().toFixed(2)}
          </motion.span>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700" onClick={handleAddToCart}>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{item.name}</DialogTitle>
          </DialogHeader>
          {ModalContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader className="sr-only">
          <DrawerTitle>{item.name}</DrawerTitle>
        </DrawerHeader>
        {ModalContent}
      </DrawerContent>
    </Drawer>
  )
}
