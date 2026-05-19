"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MessageCircle, Phone, Store, MapPin, Star, Send, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useStartConversation } from "@/hooks/queries/use-conversations"
import type { ProductSeller } from "@/components/main/product-card"

type Props = {
	seller: ProductSeller
	location: string
	store?: { id: string; name: string }
	productId?: string
	productTitle?: string
	productImage?: string
	productPrice?: string
}

function SellerAvatar({ seller, size = "md" }: { seller: ProductSeller; size?: "sm" | "md" }) {
	const dim = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
	const imageSize = size === "sm" ? 32 : 40
	if (seller.avatarUrl) {
		return (
			<Image
				src={seller.avatarUrl}
				alt={seller.name}
				width={imageSize}
				height={imageSize}
				className={cn("shrink-0 rounded-full object-cover", dim)}
			/>
		)
	}
	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center rounded-full bg-vm-tangerine/10 font-bold text-vm-tangerine",
				dim
			)}
		>
			{seller.name.charAt(0).toUpperCase()}
		</div>
	)
}

function SellerRating({ rating }: { rating: string }) {
	const num = parseFloat(rating)
	if (!num || num === 0) {
		return <span className="text-xs text-muted-foreground">New seller</span>
	}
	return (
		<div className="flex items-center gap-1">
			<Star className="h-3 w-3 fill-vm-tangerine text-vm-tangerine" />
			<span className="text-xs font-semibold">{num.toFixed(1)}</span>
		</div>
	)
}

// ── Compose dialog ─────────────────────────────────────────────────────────────
type ComposeDialogProps = {
	open: boolean
	onClose: () => void
	seller: ProductSeller
	productId?: string
	productTitle?: string
	productImage?: string
	productPrice?: string
}

function ComposeDialog({
	open,
	onClose,
	seller,
	productId,
	productTitle,
	productImage,
	productPrice,
}: ComposeDialogProps) {
	const router = useRouter()
	const [text, setText] = React.useState("")
	const textareaRef = React.useRef<HTMLTextAreaElement>(null)
	const { mutate: startConversation, isPending } = useStartConversation()

	// Reset draft and refocus when dialog opens
	React.useEffect(() => {
		if (open) {
			setText("")
			setTimeout(() => textareaRef.current?.focus(), 50)
		}
	}, [open])

	const handleSend = () => {
		const message = text.trim()
		if (!message || isPending) return

		startConversation(
			{
				other_user_id: seller.id,
				...(productId && { product_id: productId }),
				initial_message: message,
			},
			{
				onSuccess: (data) => {
					const conversationId = (data as { data?: { id?: string }; id?: string })?.data?.id
						?? (data as { id?: string })?.id

					onClose()
					if (conversationId) {
						router.push(`/messages/${conversationId}`)
					} else {
						router.push("/messages")
					}
				},
				onError: () => {
					toast.error("Couldn't start conversation. Try again.")
				},
			}
		)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="max-w-md gap-0 p-0 overflow-hidden">
				<DialogHeader className="px-5 py-4 border-b border-border">
					<DialogTitle className="flex items-center gap-3 text-base font-semibold">
						<SellerAvatar seller={seller} size="sm" />
						<span>Message {seller.name}</span>
					</DialogTitle>
				</DialogHeader>

				<div className="px-5 py-4 space-y-4">
					{/* Product context */}
					{productTitle && (
						<div className="flex items-center gap-2.5 rounded-lg bg-muted/70 px-3 py-2">
							{productImage ? (
								<Image
									src={productImage}
									alt=""
									width={36}
									height={36}
									className="h-9 w-9 rounded-md object-cover shrink-0"
								/>
							) : (
								<Package className="h-5 w-5 shrink-0 text-muted-foreground" />
							)}
							<div className="min-w-0 flex-1">
								<p className="text-[10px] uppercase tracking-wider text-muted-foreground">
									About this listing
								</p>
								<p className="truncate text-sm font-medium leading-tight">{productTitle}</p>
								{productPrice && (
									<p className="text-xs font-bold text-vm-tangerine mt-0.5">
										GHS {Number(productPrice).toLocaleString()}
									</p>
								)}
							</div>
						</div>
					)}

					{/* Message input */}
					<div>
						<Textarea
							ref={textareaRef}
							value={text}
							onChange={(e) => setText(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder={`Hi ${seller.name.split(" ")[0]}, is this still available?`}
							rows={4}
							className="resize-none text-sm leading-relaxed"
							disabled={isPending}
						/>
						<p className="mt-1.5 text-[10px] text-muted-foreground/60">
							Enter to send · Shift+Enter for new line
						</p>
					</div>

					{/* Actions */}
					<div className="flex gap-2">
						<Button
							variant="outline"
							className="flex-1"
							onClick={onClose}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button
							className="flex-1 gap-2 bg-vm-tangerine text-vm-tangerine-foreground hover:bg-vm-tangerine/90 disabled:opacity-50"
							disabled={!text.trim() || isPending}
							onClick={handleSend}
						>
							{isPending ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-vm-tangerine-foreground/30 border-t-vm-tangerine-foreground" />
									Sending…
								</>
							) : (
								<>
									<Send className="h-4 w-4" />
									Send Message
								</>
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

// ── SellerCard ─────────────────────────────────────────────────────────────────
export function SellerCard({ seller, location, store, productId, productTitle, productImage, productPrice }: Props) {
	const [composeOpen, setComposeOpen] = React.useState(false)

	return (
		<>
			<div className="rounded-xl border border-border bg-card p-4">
				{/* Row 1: avatar + name + rating */}
				<div className="flex items-center gap-3">
					<SellerAvatar seller={seller} />
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-semibold leading-tight">{seller.name}</p>
						<div className="mt-0.5">
							<SellerRating rating={seller.rating} />
						</div>
					</div>
				</div>

				{/* Row 2: location + store pills */}
				<div className="mt-3 flex flex-wrap gap-1.5">
					<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
						<MapPin className="h-3 w-3 shrink-0" />
						<span className="truncate max-w-48">{location}</span>
					</span>
					{store && (
						<span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
							<Store className="h-3 w-3 shrink-0" />
							<span className="truncate max-w-48">{store.name}</span>
						</span>
					)}
				</div>

				{/* Row 3: action buttons */}
				<div className="mt-3 flex gap-2">
					<Button
						variant="outline"
						size="sm"
						className="flex-1 vm-button gap-1.5 text-xs h-9"
						onClick={() => setComposeOpen(true)}
					>
						<MessageCircle className="h-3.5 w-3.5" />
						Message
					</Button>
					{store && (
						<Button
							size="sm"
							className="flex-1 gap-1.5 text-xs h-9 bg-vm-tangerine vm-button text-vm-tangerine-foreground hover:bg-vm-tangerine/90"
							asChild
						>
							<Link href={`/stores/${store.id}`}>
								<Store className="h-3.5 w-3.5" />
								View Store
							</Link>
						</Button>
					)}
				</div>
			</div>

			<ComposeDialog
				open={composeOpen}
				onClose={() => setComposeOpen(false)}
				seller={seller}
				productId={productId}
				productTitle={productTitle}
				productImage={productImage}
				productPrice={productPrice}
			/>
		</>
	)
}
