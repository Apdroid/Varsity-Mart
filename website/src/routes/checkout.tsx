import { createFileRoute, Link } from "@tanstack/react-router";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	Banknote,
	CheckCircle2,
	Clock,
	CreditCard,
	MapPin,
	Minus,
	Plus,
	ShoppingBag,
	Smartphone,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart-context";

export const Route = createFileRoute("/checkout")({
	component: CheckoutPage,
});

export default function CheckoutPage() {
	const { items, removeItem, updateQuantity, clearCart, totalPrice } =
		useCart();
	const [deliveryMethod, setDeliveryMethod] = useState("delivery");
	const [paymentMethod, setPaymentMethod] = useState("momo");
	const [orderPlaced, setOrderPlaced] = useState(false);

	const deliveryFee = deliveryMethod === "delivery" ? 8 : 0;
	const serviceFee = 2;
	const finalTotal = totalPrice + deliveryFee + serviceFee;

	const handlePlaceOrder = () => {
		setOrderPlaced(true);
		clearCart();
	};

	if (orderPlaced) {
		return (
			<div className="min-h-screen bg-slate-50">
				<Navbar />
				<main className="max-w-2xl mx-auto px-4 py-16">
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.4, ease: "easeOut" }}
						className="text-center"
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
						>
							<CheckCircle2 className="w-12 h-12 text-green-600" />
						</motion.div>
						<h1 className="text-3xl font-bold text-blue-900 mb-4">
							Order Placed Successfully!
						</h1>
						<p className="text-muted-foreground mb-8">
							Your order has been received and is being prepared. You'll receive
							updates on your order status.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link to="/restaurants">
								<Button className="bg-blue-600 hover:bg-blue-700">
									Continue Shopping
								</Button>
							</Link>
							<Link to="/">
								<Button variant="outline">Back to Home</Button>
							</Link>
						</div>
					</motion.div>
				</main>
				<Footer />
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="min-h-screen bg-slate-50">
				<Navbar />
				<main className="max-w-2xl mx-auto px-4 py-16">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center"
					>
						<div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<ShoppingBag className="w-12 h-12 text-slate-400" />
						</div>
						<h1 className="text-2xl font-bold text-blue-900 mb-4">
							Your cart is empty
						</h1>
						<p className="text-muted-foreground mb-8">
							Add some delicious items from our restaurants to get started!
						</p>
						<Link to="/restaurants">
							<Button className="bg-blue-600 hover:bg-blue-700">
								Browse Restaurants
							</Button>
						</Link>
					</motion.div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<Navbar />
			<main className="max-w-6xl mx-auto px-4 py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<Link
						to="/restaurants"
						className="inline-flex items-center gap-2 text-muted-foreground hover:text-blue-600 mb-4 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Continue Shopping
					</Link>
					<h1 className="text-3xl font-bold text-blue-900">Checkout</h1>
				</motion.div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Left Column - Cart Items & Delivery Info */}
					<div className="lg:col-span-2 space-y-6">
						{/* Cart Items */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							<Card>
								<CardHeader>
									<CardTitle className="text-blue-900">
										Your Order ({items.length} items)
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<AnimatePresence>
										{items.map((item, index) => (
											<motion.div
												key={`${item.id}-${item.size}-${JSON.stringify(item.addOns)}`}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												exit={{ opacity: 0, x: 20, height: 0 }}
												transition={{ delay: index * 0.05 }}
												className="flex gap-4 p-4 bg-slate-50 rounded-xl"
											>
												<img
													src={
														item.image ||
														"/placeholder.svg?height=80&width=80&query=food dish"
													}
													alt={item.name}
													className="w-20 h-20 rounded-lg object-cover"
												/>
												<div className="flex-1">
													<div className="flex justify-between items-start mb-1">
														<h3 className="font-semibold text-blue-900">
															{item.name}
														</h3>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
															onClick={() =>
																removeItem(item.id, item.size, item.addOns)
															}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
													<p className="text-sm text-muted-foreground mb-1">
														{item.restaurantName}
													</p>
													{item.size && (
														<p className="text-xs text-muted-foreground">
															Size: {item.size}
														</p>
													)}
													{item.addOns && item.addOns.length > 0 && (
														<p className="text-xs text-muted-foreground">
															Add-ons: {item.addOns.join(", ")}
														</p>
													)}
													{item.specialInstructions && (
														<p className="text-xs text-muted-foreground italic">
															Note: {item.specialInstructions}
														</p>
													)}
													<div className="flex items-center justify-between mt-3">
														<div className="flex items-center gap-2">
															<Button
																variant="outline"
																size="icon"
																className="h-8 w-8 rounded-full bg-transparent"
																onClick={() =>
																	updateQuantity(
																		item.id,
																		item.quantity - 1,
																		item.size,
																		item.addOns,
																	)
																}
															>
																<Minus className="w-3 h-3" />
															</Button>
															<span className="w-8 text-center font-medium">
																{item.quantity}
															</span>
															<Button
																variant="outline"
																size="icon"
																className="h-8 w-8 rounded-full bg-transparent"
																onClick={() =>
																	updateQuantity(
																		item.id,
																		item.quantity + 1,
																		item.size,
																		item.addOns,
																	)
																}
															>
																<Plus className="w-3 h-3" />
															</Button>
														</div>
														<span className="font-bold text-blue-600">
															GHC {item.totalPrice.toFixed(2)}
														</span>
													</div>
												</div>
											</motion.div>
										))}
									</AnimatePresence>
								</CardContent>
							</Card>
						</motion.div>

						{/* Delivery Method */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Card>
								<CardHeader>
									<CardTitle className="text-blue-900">
										Delivery Method
									</CardTitle>
								</CardHeader>
								<CardContent>
									<RadioGroup
										value={deliveryMethod}
										onValueChange={setDeliveryMethod}
									>
										<div className="grid sm:grid-cols-2 gap-4">
											<Label
												htmlFor="delivery"
												className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
													deliveryMethod === "delivery"
														? "border-blue-600 bg-blue-50"
														: "border-slate-200 hover:border-slate-300"
												}`}
											>
												<RadioGroupItem value="delivery" id="delivery" />
												<div className="flex-1">
													<span className="font-medium">Delivery</span>
													<p className="text-sm text-muted-foreground">
														25-35 min • GHC 8
													</p>
												</div>
												<MapPin className="w-5 h-5 text-blue-600" />
											</Label>
											<Label
												htmlFor="pickup"
												className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
													deliveryMethod === "pickup"
														? "border-blue-600 bg-blue-50"
														: "border-slate-200 hover:border-slate-300"
												}`}
											>
												<RadioGroupItem value="pickup" id="pickup" />
												<div className="flex-1">
													<span className="font-medium">Pickup</span>
													<p className="text-sm text-muted-foreground">
														15-20 min • Free
													</p>
												</div>
												<Clock className="w-5 h-5 text-blue-600" />
											</Label>
										</div>
									</RadioGroup>

									{deliveryMethod === "delivery" && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="mt-6 space-y-4"
										>
											<div>
												<Label
													htmlFor="address"
													className="text-sm font-medium"
												>
													Delivery Address
												</Label>
												<div className="relative mt-1">
													<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
													<Input
														id="address"
														placeholder="Enter your delivery address"
														className="pl-10"
													/>
												</div>
											</div>
											{/* Google Maps Embed */}
											<div className="rounded-xl overflow-hidden border border-slate-200 h-48">
												<iframe
													src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.6668736098!2d-1.5614!3d6.6745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdb9610b0b0b0b0b%3A0x0!2sKNUST!5e0!3m2!1sen!2sgh!4v1234567890"
													width="100%"
													height="100%"
													style={{ border: 0 }}
													allowFullScreen
													loading="lazy"
													referrerPolicy="no-referrer-when-downgrade"
													title="Delivery Location"
												/>
											</div>
											<Textarea
												placeholder="Additional delivery instructions (optional)"
												className="resize-none"
											/>
										</motion.div>
									)}
								</CardContent>
							</Card>
						</motion.div>

						{/* Payment Method */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<Card>
								<CardHeader>
									<CardTitle className="text-blue-900">
										Payment Method
									</CardTitle>
								</CardHeader>
								<CardContent>
									<RadioGroup
										value={paymentMethod}
										onValueChange={setPaymentMethod}
									>
										<div className="space-y-3">
											<Label
												htmlFor="momo"
												className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
													paymentMethod === "momo"
														? "border-blue-600 bg-blue-50"
														: "border-slate-200 hover:border-slate-300"
												}`}
											>
												<RadioGroupItem value="momo" id="momo" />
												<Smartphone className="w-5 h-5 text-yellow-500" />
												<div className="flex-1">
													<span className="font-medium">Mobile Money</span>
													<p className="text-sm text-muted-foreground">
														MTN, Vodafone, AirtelTigo
													</p>
												</div>
											</Label>
											<Label
												htmlFor="card"
												className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
													paymentMethod === "card"
														? "border-blue-600 bg-blue-50"
														: "border-slate-200 hover:border-slate-300"
												}`}
											>
												<RadioGroupItem value="card" id="card" />
												<CreditCard className="w-5 h-5 text-blue-500" />
												<div className="flex-1">
													<span className="font-medium">Debit/Credit Card</span>
													<p className="text-sm text-muted-foreground">
														Visa, Mastercard
													</p>
												</div>
											</Label>
											<Label
												htmlFor="cash"
												className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
													paymentMethod === "cash"
														? "border-blue-600 bg-blue-50"
														: "border-slate-200 hover:border-slate-300"
												}`}
											>
												<RadioGroupItem value="cash" id="cash" />
												<Banknote className="w-5 h-5 text-green-500" />
												<div className="flex-1">
													<span className="font-medium">Cash on Delivery</span>
													<p className="text-sm text-muted-foreground">
														Pay when you receive
													</p>
												</div>
											</Label>
										</div>
									</RadioGroup>

									{paymentMethod === "momo" && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											className="mt-6"
										>
											<Label htmlFor="phone" className="text-sm font-medium">
												Mobile Money Number
											</Label>
											<Input
												id="phone"
												placeholder="0XX XXX XXXX"
												className="mt-1"
												type="tel"
											/>
										</motion.div>
									)}
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* Right Column - Order Summary */}
					<div className="lg:col-span-1">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="sticky top-24"
						>
							<Card>
								<CardHeader>
									<CardTitle className="text-blue-900">Order Summary</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Subtotal</span>
											<span>GHC {totalPrice.toFixed(2)}</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">
												Delivery Fee
											</span>
											<span>
												{deliveryFee > 0
													? `GHC ${deliveryFee.toFixed(2)}`
													: "Free"}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Service Fee</span>
											<span>GHC {serviceFee.toFixed(2)}</span>
										</div>
									</div>

									<Separator />

									<div className="flex justify-between font-bold text-lg">
										<span className="text-blue-900">Total</span>
										<span className="text-blue-600">
											GHC {finalTotal.toFixed(2)}
										</span>
									</div>

									<motion.div
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Button
											className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700"
											onClick={handlePlaceOrder}
										>
											Place Order
										</Button>
									</motion.div>

									<p className="text-xs text-center text-muted-foreground">
										By placing this order, you agree to our Terms of Service and
										Privacy Policy.
									</p>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
