"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import Image from "next/image"
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Loader2,
	MapPin,
	Package,
	Plus,
	ShoppingBag,
	Tag,
	Trash2,
	Upload,
	X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
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
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateProduct } from "@/hooks/queries/use-products"
import { useProductCategories } from "@/hooks/queries/use-categories"
import { useMyStore } from "@/hooks/queries/use-stores"
import { cn } from "@/lib/utils"

// ── Schema ────────────────────────────────────────────────────────────────────

const DELIVERY_OPTION_VALUES = ["campus_delivery", "meetup", "shipping"] as const
type DeliveryOption = (typeof DELIVERY_OPTION_VALUES)[number]

const schema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	category: z.string().min(1, "Please select a category"),
	condition: z.enum(["N", "U"] as const),
	location: z.string().min(2, "Please enter a location"),
	price: z.coerce.number().min(1, "Price must be at least 1"),
	original_price: z.coerce.number().min(1, "Original price must be at least 1"),
	stock: z.coerce.number().int().min(0).default(0),
	delivery_options: z
		.array(z.enum(DELIVERY_OPTION_VALUES))
		.min(1, "Select at least one delivery option"),
	specifications: z
		.array(
			z.object({
				key: z.string().min(1, "Name required"),
				value: z.string().min(1, "Value required"),
			})
		)
		.optional(),
	is_night_shop: z.boolean().default(false),
})

type FormData = z.infer<typeof schema>

const CONDITIONS: { value: "N" | "U"; label: string }[] = [
	{ value: "N", label: "New" },
	{ value: "U", label: "Used" },
]

const DELIVERY_OPTIONS: { value: DeliveryOption; label: string; description: string }[] = [
	{ value: "campus_delivery", label: "Campus Delivery", description: "Delivered to buyer on campus" },
	{ value: "meetup", label: "Meetup", description: "Meet at a public place" },
	{ value: "shipping", label: "Shipping", description: "Ship via courier" },
]

const STEP_FIELDS: (keyof FormData)[][] = [
	["title", "description", "category", "condition", "location"],
	["price", "original_price", "stock", "delivery_options"],
]

const STEPS = [
	{ label: "Details", icon: ShoppingBag },
	{ label: "Pricing & Photos", icon: Tag },
]

// ── Step progress ─────────────────────────────────────────────────────────────

function StepProgress({ current, total }: { current: number; total: number }) {
	return (
		<div className="mb-8">
			<div className="relative flex items-center justify-between">
				<div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-border" />
				<div
					className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-vm-tangerine transition-all duration-500"
					style={{ width: `${(current / (total - 1)) * 100}%` }}
				/>
				{STEPS.map((step, i) => {
					const done = i < current
					const active = i === current
					const Icon = step.icon
					return (
						<div key={step.label} className="relative flex flex-col items-center gap-2 z-10">
							<div
								className={cn(
									"flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300",
									done
										? "border-vm-tangerine bg-vm-tangerine text-white"
										: active
											? "border-vm-tangerine bg-background text-vm-tangerine"
											: "border-border bg-background text-muted-foreground"
								)}
							>
								{done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
							</div>
							<span
								className={cn(
									"hidden text-[11px] font-medium sm:block transition-colors",
									active ? "text-vm-tangerine" : done ? "text-foreground" : "text-muted-foreground"
								)}
							>
								{step.label}
							</span>
						</div>
					)
				})}
			</div>
			<p className="mt-4 text-center text-xs text-muted-foreground sm:hidden">
				Step {current + 1} of {total} —{" "}
				<span className="font-medium text-foreground">{STEPS[current].label}</span>
			</p>
		</div>
	)
}

// ── Image picker ──────────────────────────────────────────────────────────────

function ImagePicker({ files, onChange }: { files: File[]; onChange: (files: File[]) => void }) {
	const inputRef = React.useRef<HTMLInputElement>(null)
	const previews = React.useMemo(() => files.map((f) => URL.createObjectURL(f)), [files])

	React.useEffect(() => {
		return () => previews.forEach(URL.revokeObjectURL)
	}, [previews])

	function addFiles(added: FileList | null) {
		if (!added) return
		const all = Array.from(added)
		const valid = all.filter((f) => f.size <= 10 * 1024 * 1024)
		if (valid.length < all.length) {
			toast.warning("Some images exceed 10 MB and were skipped")
		}
		const next = [...files, ...valid].slice(0, 10)
		onChange(next)
	}

	function remove(idx: number) {
		onChange(files.filter((_, i) => i !== idx))
	}

	return (
		<div className="space-y-3">
			<div>
				<p className="text-sm font-medium">Product images</p>
				<p className="text-xs text-muted-foreground">
					Up to 10 photos — first image is the cover. Max 10 MB each. JPEG, PNG, WebP or GIF.
				</p>
			</div>
			<div className="grid grid-cols-3 gap-2">
				{previews.map((src, idx) => (
					<div
						key={src}
						className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
					>
						<Image src={src} alt={`Image ${idx + 1}`} fill className="object-cover" />
						{idx === 0 && (
							<span className="absolute left-1 top-1 rounded bg-vm-tangerine px-1.5 py-0.5 text-[10px] font-semibold text-white">
								Cover
							</span>
						)}
						<button
							type="button"
							onClick={() => remove(idx)}
							className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
						>
							<X className="h-3 w-3" />
						</button>
					</div>
				))}
				{files.length < 10 && (
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-all hover:border-vm-tangerine hover:text-vm-tangerine"
					>
						<Upload className="h-5 w-5" />
						<span className="text-[11px] font-medium">Add</span>
					</button>
				)}
			</div>
			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/gif"
				multiple
				className="hidden"
				onChange={(e) => {
					addFiles(e.target.files)
					e.target.value = ""
				}}
			/>
		</div>
	)
}

// ── Step 1: Product details ───────────────────────────────────────────────────

function StepDetails({
	form,
	categories,
	categoriesLoading,
}: {
	form: ReturnType<typeof useForm<FormData>>
	categories: { id: string; name: string }[] | undefined
	categoriesLoading: boolean
}) {
	return (
		<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
			<div>
				<h2 className="text-lg font-bold">Product details</h2>
				<p className="text-sm text-muted-foreground">Help buyers find and understand your product.</p>
			</div>

			<FormField
				control={form.control}
				name="title"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Title</FormLabel>
						<FormControl>
							<Input placeholder="e.g. Canon EOS 1500D Camera" autoFocus {...field} />
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
							<Textarea
								placeholder="Describe your product — what's included, any defects…"
								className="min-h-28 resize-none"
								{...field}
							/>
						</FormControl>
						<FormDescription>At least 10 characters</FormDescription>
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
										<SelectItem key={cat.id} value={cat.name}>
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
							<Input placeholder="e.g. KNUST Main Campus" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	)
}

// ── Step 2: Pricing & photos ──────────────────────────────────────────────────

function StepPricingPhotos({
	form,
	images,
	onImagesChange,
}: {
	form: ReturnType<typeof useForm<FormData>>
	images: File[]
	onImagesChange: (files: File[]) => void
}) {
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "specifications",
	})

	return (
		<div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
			<div>
				<h2 className="text-lg font-bold">Pricing &amp; photos</h2>
				<p className="text-sm text-muted-foreground">Set your price and add product images.</p>
			</div>

			{/* Prices */}
			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					control={form.control}
					name="price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Price (GHS)</FormLabel>
							<FormControl>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
										GHS
									</span>
									<Input type="number" min={1} step={0.01} className="pl-12" {...field} />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="original_price"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Original price (GHS)</FormLabel>
							<FormControl>
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
										GHS
									</span>
									<Input
										type="number"
										min={1}
										step={0.01}
										className="pl-12"
										placeholder="Before discount"
										{...field}
									/>
								</div>
							</FormControl>
							<FormDescription>Shows a crossed-out original price</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Stock */}
			<FormField
				control={form.control}
				name="stock"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							<span className="flex items-center gap-1">
								<Package className="h-3.5 w-3.5" />
								Stock
							</span>
						</FormLabel>
						<FormControl>
							<Input type="number" min={0} step={1} placeholder="0" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* Delivery options */}
			<FormField
				control={form.control}
				name="delivery_options"
				render={() => (
					<FormItem>
						<FormLabel>Delivery options</FormLabel>
						<FormDescription>Select all ways buyers can receive this item.</FormDescription>
						<div className="mt-2 space-y-2">
							{DELIVERY_OPTIONS.map((option) => (
								<FormField
									key={option.value}
									control={form.control}
									name="delivery_options"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<div className="flex items-center gap-3">
													<Checkbox
														className="bg-accent border border-foreground rounded-sm"
														checked={field.value?.includes(option.value)}
														defaultChecked={true}
														onCheckedChange={(checked) => {
															const current = field.value ?? []
															field.onChange(
																checked
																	? [...current, option.value]
																	: current.filter((v) => v !== option.value)
															)
														}}
													/>

													<div className="leading-none">
														<FormLabel className="font-medium">{option.label}</FormLabel>
														<p className="text-xs text-muted-foreground">{option.description}</p>
													</div>
												</div>
											</FormControl>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>

			<Separator />

			{/* Specifications */}
			<div className="space-y-3">
				<div>
					<p className="text-sm font-medium">Specifications</p>
					<p className="text-xs text-muted-foreground">
						Optional. Add key details like storage, color, model, etc.
					</p>
				</div>
				{fields.map((field, index) => (
					<div key={field.id} className="flex gap-2">
						<FormField
							control={form.control}
							name={`specifications.${index}.key`}
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormControl>
										<Input placeholder="e.g. Storage" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name={`specifications.${index}.value`}
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormControl>
										<Input placeholder="e.g. 256 GB" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<button
							type="button"
							onClick={() => remove(index)}
							className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
						>
							<Trash2 className="h-4 w-4" />
						</button>
					</div>
				))}
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => append({ key: "", value: "" })}
					className="w-full"
				>
					<Plus className="mr-1.5 h-3.5 w-3.5" />
					Add specification
				</Button>
			</div>

			<Separator />

			{/* Night Shop */}
			<FormField
				control={form.control}
				name="is_night_shop"
				render={({ field }) => (
					<FormItem className="p-4">
						<div className="flex flex-wrap justify-between">
							<div>
								<FormLabel className="text-sm font-medium">Night Shop</FormLabel>
								<p className="text-xs text-muted-foreground">
									List this product in the late-night shopping section
								</p>
							</div>
							<FormControl>
								<Switch checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
						</div>
					</FormItem>
				)}
			/>

			<Separator />

			<ImagePicker files={images} onChange={onImagesChange} />
		</div>
	)
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AddProductPage() {
	const router = useRouter()
	const [step, setStep] = React.useState(0)
	const [images, setImages] = React.useState<File[]>([])

	const { data: categories, isLoading: categoriesLoading } = useProductCategories()
	const { data: store } = useMyStore()
	const { mutateAsync: createProduct, isPending } = useCreateProduct()

	const form = useForm<FormData>({
		resolver: zodResolver(schema) as Resolver<FormData>,
		defaultValues: {
			title: "",
			description: "",
			category: "",
			condition: "N",
			location: "",
			price: 0,
			original_price: 0,
			stock: 0,
			delivery_options: [],
			specifications: [],
			is_night_shop: false,
		},
	})

	const totalSteps = STEPS.length

	async function goNext() {
		const fields = STEP_FIELDS[step]
		const valid = fields.length === 0 || (await form.trigger(fields))
		if (valid) {
			setStep((s) => Math.min(s + 1, totalSteps - 1))
			window.scrollTo({ top: 0, behavior: "smooth" })
		}
	}

	function goBack() {
		setStep((s) => Math.max(s - 1, 0))
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	async function onSubmit(values: FormData) {
		try {
			await createProduct({
				title: values.title,
				description: values.description,
				price: values.price,
				original_price: values.original_price,
				category: values.category,
				condition: values.condition,
				location: values.location,
				stock: values.stock,
				delivery_options: values.delivery_options,
				specifications: values.specifications?.filter((s) => s.key && s.value),
				is_night_shop: values.is_night_shop,
				images,
				storeId: store?.id,
			})
			toast.success("Product listed successfully!")
			router.replace("/seller/store")
		} catch {
			toast.error("Failed to create product. Please try again.")
		}
	}

	return (
		<div className="mx-auto max-w-xl px-4 pb-16 pt-8">
			<button
				type="button"
				onClick={() => (step === 0 ? router.back() : goBack())}
				className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				{step === 0 ? "Back" : "Previous step"}
			</button>

			<StepProgress current={step} total={totalSteps} />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && step < totalSteps - 1) {
							e.preventDefault()
							goNext()
						}
					}}
				>
					{step === 0 && (
						<StepDetails
							form={form}
							categories={categories}
							categoriesLoading={categoriesLoading}
						/>
					)}
					{step === 1 && (
						<StepPricingPhotos form={form} images={images} onImagesChange={setImages} />
					)}

					<div className="mt-8 flex gap-3">
						{step > 0 && (
							<Button type="button" variant="outline" className="h-11 flex-1" onClick={goBack}>
								<ArrowLeft className="mr-1.5 h-4 w-4" />
								Back
							</Button>
						)}

						{step < totalSteps - 1 ? (
							<Button
								type="button"
								className="h-11 flex-1 bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
								onClick={goNext}
							>
								Continue
								<ArrowRight className="ml-1.5 h-4 w-4" />
							</Button>
						) : (
							<Button
								type="submit"
								disabled={isPending}
								className="h-11 flex-1 bg-vm-tangerine text-white hover:bg-vm-tangerine/90"
							>
								{isPending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Listing…
									</>
								) : (
									<>
										<Check className="mr-2 h-4 w-4" />
										List product
									</>
								)}
							</Button>
						)}
					</div>
				</form>
			</Form>
		</div>
	)
}
