"use client"

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useUpdateProfile } from "@/hooks/queries/use-user"
import { getUserLocationValue } from "@/lib/user-location"
import { useAuth } from "@/providers/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const universities = [
	"University of Ghana",
	"KNUST",
	"University of Cape Coast",
	"Ashesi University",
] as const

const CAMPUS_MAP: Record<string, string[]> = {
	"KNUST": ["Kumasi", "Obuasi"],
	"University of Ghana": ["Legon Main", "Korle-bu", "Accra City", "Kumasi City", "Takoradi City"],
	"University of Cape Coast": ["Cape Coast"],
	"Ashesi University": ["Berekuso"],
}

function getCampuses(university?: string): string[] {
	return CAMPUS_MAP[university ?? ""] ?? []
}

function hasValue(value?: string | null) {
	return Boolean(value && value.trim().length > 0)
}

const schema = z.object({
	phone: z.string().optional(),
	university: z.string().optional(),
	campus: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function CompleteProfileForm() {
	const { user, refreshUser } = useAuth()
	const router = useRouter()
	const updateProfileMutation = useUpdateProfile()
	const currentUniversity = getUserLocationValue(user?.university)
	const currentCampus = getUserLocationValue(user?.campus)

	const missing = useMemo(() => ({
		phone: !hasValue(user?.phone),
		university: !hasValue(currentUniversity),
		campus: !hasValue(currentCampus),
	}), [currentCampus, currentUniversity, user?.phone])

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "onBlur",
		defaultValues: {
			phone: user?.phone || "",
			university: currentUniversity || "KNUST",
			campus: currentCampus || "Kumasi",
		},
	})

	const selectedUniversity = form.watch("university") ?? currentUniversity
	const campusOptions = getCampuses(selectedUniversity)

	const onSubmit = async (values: FormData) => {
		const phone = values.phone?.trim() ?? ""
		const university = values.university?.trim() ?? ""
		const campus = values.campus?.trim() ?? ""

		if (missing.phone && phone.length < 8) {
			form.setError("phone", { message: "Enter a valid phone number." })
			return
		}
		if (missing.university && !university) {
			form.setError("university", { message: "Select your university." })
			return
		}
		if (missing.campus && !campus) {
			form.setError("campus", { message: "Select your campus." })
			return
		}
		try {
			await updateProfileMutation.mutateAsync({
				phone: missing.phone ? phone : undefined,
				university: missing.university ? university : undefined,
				campus: missing.campus ? campus : undefined,
			})
			await refreshUser()
			toast.success("Profile completed!")
			router.replace("/")
		} catch {
			toast.error("Failed to save your details. Please try again.")
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				noValidate
				className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200"
			>
				{missing.phone && (
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone number</FormLabel>
								<FormControl>
									<Input
										type="tel"
										placeholder="+233201234567"
										autoFocus
										className="rounded-full p-6"
										{...field}
									/>
								</FormControl>
								<FormDescription>Used for delivery updates and order contact.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{missing.university && (
					<FormField
						control={form.control}
						name="university"
						render={({ field }) => (
							<FormItem>
								<FormLabel>University</FormLabel>
								<Select
									value={field.value}
									onValueChange={(val) => {
										field.onChange(val)
										form.setValue("campus", "")
									}}
								>
									<FormControl>
										<SelectTrigger className="h-auto w-full rounded-full px-6 py-6">
											<SelectValue placeholder="Select university" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{universities.map((u) => (
											<SelectItem key={u} value={u}>{u}</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{missing.campus && (
					<FormField
						control={form.control}
						name="campus"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Campus</FormLabel>
								<Select value={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger className="h-auto w-full rounded-full px-6 py-6">
											<SelectValue placeholder="Select campus" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{campusOptions.map((c) => (
											<SelectItem key={c} value={c} >{c}</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<Button
					type="submit"
					disabled={updateProfileMutation.isPending}
					className="w-full rounded-full p-6 text-base my-6"
				>
					{updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Complete profile
				</Button>
			</form>
		</Form>
	)
}
