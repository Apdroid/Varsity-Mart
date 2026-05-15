"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, X, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { ProductImage } from "@/components/main/product-card"
import Image from "next/image"

type Props = {
	images: ProductImage[]
	title: string
	views: number
}

export function ProductGallery({ images, title, views }: Props) {
	const [selected, setSelected] = React.useState(0)
	const [lightboxOpen, setLightboxOpen] = React.useState(false)
	const [lightboxIndex, setLightboxIndex] = React.useState(0)

	const current = images[selected]

	const openLightbox = (i: number) => {
		setLightboxIndex(i)
		setLightboxOpen(true)
	}

	const lightboxGo = (dir: 1 | -1) =>
		setLightboxIndex((i) => (i + dir + images.length) % images.length)

	React.useEffect(() => {
		if (!lightboxOpen) return
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") lightboxGo(-1)
			if (e.key === "ArrowRight") lightboxGo(1)
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [lightboxOpen])

	return (
		<div className="flex gap-8">

			{images.length > 1 && (
				<div className="mt-3 grid grid-cols-5 gap-2 md:grid-cols-1">
					{images.map((img, i) => (
						<button
							key={img.id}
							type="button"
							onClick={() => setSelected(i)}
							className={cn(
								"relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
								i === selected
									? "border-vm-tangerine"
									: "border-transparent opacity-60 hover:opacity-100"
							)}
						>
							<Image
								width={1200}
								height={1200}
								src={img.thumbnail_url}
								alt={`Image ${i + 1}`}
								className="h-full w-full object-cover"
							/>
						</button>
					))}
				</div>
			)}

			{/* Main image */}
			<div
				className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-muted"
				onClick={() => openLightbox(selected)}
			>
				<Image

					width={1200}
					height={1200}
					src={current.optimized_url}
					alt={title}
					className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
				/>

				{/* Views overlay */}
				<div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
					<Eye className="h-3.5 w-3.5" />
					{views.toLocaleString()} views
				</div>

				{/* Image counter */}
				{images.length > 1 && (
					<div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-sm">
						{selected + 1} / {images.length}
					</div>
				)}
			</div>

			{/* Thumbnails */}
			{/* Lightbox */}
			<Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
				<DialogContent className="max-w-3xl border-0 bg-black/95 p-0">
					<div className="relative flex items-center justify-center">
						<Image

							width={1200}
							height={1200}
							src={images[lightboxIndex]?.url}
							alt={`${title} — image ${lightboxIndex + 1}`}
							className="max-h-[80vh] w-full object-contain"
						/>

						{images.length > 1 && (
							<>
								<button
									type="button"
									onClick={() => lightboxGo(-1)}
									className="absolute left-3 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40"
								>
									<ChevronLeft className="h-5 w-5" />
								</button>
								<button
									type="button"
									onClick={() => lightboxGo(1)}
									className="absolute right-3 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40"
								>
									<ChevronRight className="h-5 w-5" />
								</button>
							</>
						)}

						<DialogClose className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40">
							<X className="h-4 w-4" />
						</DialogClose>

						<div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
							{lightboxIndex + 1} / {images.length}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
