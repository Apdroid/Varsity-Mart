"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
	AlertTriangle,
	ArrowLeft,
	Loader2,
	MapPin,
	Package,
	Save,
	Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/queries/use-products"
import { useProductCategories } from "@/hooks/queries/use-categories"
import type { ProductCondition } from "@/lib/api/types"

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	category: z.string().min(1, "Please select a category"),
	condition: z.enum(["new", "like_new", "good", "fair", "poor"] as const),
	location: z.string().min(2, "Please enter a location"),
	price: z.coerce.number().min(0.01, "Price must be greater than 0"),
	originalPrice: z.coerce.number().optional(),
	quantity: z.coerce.number().int().min(1).optional(),
	isNightShop: z.boolean().default(false),
})

type FormData = z.infer<typeof schema>

const CONDITIONS: { value: ProductCondition; label: string }[] = [
	{ value: "new", label: "New" },
	{ value: "like_new", label: "Like New" },
	{ value: "good", label: "Good" },
	{ value: "fair", label: "Fair" },
	{ value: "poor", label: "Poor" },
]

// ── Loading skeleton ──────────────────────────────────────────────────────────

function EditSkeleton() {
	return (
		<div className="mx-auto max-w-xl px-4 pb-16 pt-8 space-y-5">
			<Skeleton className="h-4 w-24" />
			<Skeleton className="h-7 w-48" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-28 w-full" />
			<div className="grid grid-cols-2 gap-4">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
			<div className="grid grid-cols-2 gap-4">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		</div>
	)
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EditProductPage() {
	const router = useRouter()
	const params = useParams()
	const id = params.id as string

	const { data: product, isLoading } = useProduct(id)
	const { data: categories, isLoading: categoriesLoading } = useProductCategories()
	const { mutateAsync: updateProduct, isPending: updating } = useUpdateProduct()
	const { mutateAsync: deleteProduct, isPending: deleting } = useDeleteProduct()

	const form = useForm<FormData>({
		resolver: zodResolver(schema) as Resolver<FormData>,
		defaultValues: {
			title: "",
			description: "",
			category: "",
			condition: "new",
			location: "",
			price: 0,
			originalPrice: undefined,
			quantity: undefined,
			isNightShop: false,
		},
	})

	const { reset } = form

	React.useEffect(() => {
		if (!product) return
		reset({
			title: product.title,
			description: product.description,
			category: typeof product.category === "string" ? product.category : product.category.id,
			condition: (product.condition as ProductCondition) ?? "new",
			location: product.location,
			price: Number(product.price),
			originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
			quantity: undefined,
			isNightShop: product.isNightShop ?? false,
		})
	}, [product, reset])

	async function onSubmit(values: FormData) {
		try {
			await updateProduct({
				id,
				data: {
					title: values.title,
					description: values.description,
					price: values.price,
					originalPrice: values.originalPrice || undefined,
					category: values.category,
					condition: values.condition as ProductCondition,
					location: values.location,
					quantity: values.quantity || undefined,
					isNightShop: values.isNightShop,
				},
			})
			toast.success("Product updated successfully.")
			router.back()
		} catch {
			toast.error("Failed to update product. Please try again.")
		}
	}

	async function handleDelete() {
		try {
			await deleteProduct(id)
			toast.success("Product deleted.")
			router.replace("/seller/store")
		} catch {
			toast.error("Failed to delete product. Please try again.")
		}
	}

	if (isLoading) return <EditSkeleton />

	if (!product) {
		return (
			<div className="mx-auto max-w-xl px-4 py-24 text-center">
				<p className="font-medium">Product not found.</p>
				<Button variant="outline" className="mt-4" onClick={() => router.back()}>
					Go back
				</Button>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-xl px-4 pb-16 pt-8">
			<button
				type="button"
				onClick={() => router.back()}
				className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				Back
			</button>

			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold font-heading">Edit product</h1>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60">
							<Trash2 className="h-3.5 w-3.5" />
							Delete
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-destructive" />
								Delete product?
							</AlertDialogTitle>
							<AlertDialogDescription>
								<strong className="font-medium text-foreground">{product.title}</strong> will be permanently removed from your store. This cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDelete}
								disabled={deleting}
								className="bg-destructive text-white hover:bg-destructive/90"
							>
								{deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
								Delete product
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea className="min-h-28 resize-none" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder={categoriesLoading ? "Loading…" : "Select"} />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{(categories ?? []).map((cat) => (
												<SelectItem key={cat.id} value={cat.id}>
													{cat.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="condition"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Condition</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{CONDITIONS.map((c) => (
												<SelectItem key={c.value} value={c.value}>
													{c.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<span className="flex items-center gap-1">
										<MapPin className="h-3.5 w-3.5" />
										Location
									</span>
								</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Separator />

					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price (GHS)</FormLabel>
									<FormControl>
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">GHS</span>
											<Input type="number" min={0} step={0.01} className="pl-12" {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="originalPrice"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Original price
										<span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
									</FormLabel>
									<FormControl>
										<div className="relative">
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">GHS</span>
											<Input type="number" min={0} step={0.01} className="pl-12" placeholder="Strikethrough price" {...field} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="quantity"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<span className="flex items-center gap-1">
										<Package className="h-3.5 w-3.5" />
										Quantity in stock
										<span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>
									</span>
								</FormLabel>
								<FormControl>
									<Input type="number" min={1} step={1} placeholder="e.g. 5" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="isNightShop"
						render={({ field }) => (
							<FormItem className="flex items-center justify-between rounded-xl border border-border p-4">
								<div>
									<FormLabel className="text-sm font-medium">Night Shop</FormLabel>
									<p className="text-xs text-muted-foreground">List in the late-night shopping section</p>
								</div>
								<FormControl>
									<Switch checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						disabled={updating}
						className="w-full h-11 bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
					>
						{updating ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Saving…
							</>
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Save changes
							</>
						)}
					</Button>
				</form>
			</Form>
		</div>
	)
}
