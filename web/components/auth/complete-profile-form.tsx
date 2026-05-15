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

const campuses = ["Legon", "Main Campus", "Kumasi", "Cape Coast", "Berekuso"] as const

function hasValue(value?: string | null) {
	return Boolean(value && value.trim().length > 0)
}

const schema = z.object({
	phone: z.string().optional(),
	university: z.string().optional(),
	campus: z.string().optional(),
	studentId: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function CompleteProfileForm() {
	const { user, refreshUser } = useAuth()
	const router = useRouter()
	const updateProfileMutation = useUpdateProfile()

	const missing = useMemo(() => ({
		phone: !hasValue(user?.phone),
		university: !hasValue(user?.university),
		campus: !hasValue(user?.campus),
		studentId: Boolean(user?.isStudent) && !hasValue(user?.studentId),
	}), [user])

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "onBlur",
		defaultValues: {
			phone: user?.phone || "",
			university: user?.university || "KNUST",
			campus: user?.campus || "Kumasi",
			studentId: user?.studentId || "",
		},
	})

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
		if (missing.studentId && (values.studentId?.trim().length ?? 0) < 3) {
			form.setError("studentId", { message: "Student ID must be at least 3 characters." })
			return
		}

		try {
			await updateProfileMutation.mutateAsync({
				phone: missing.phone ? phone : undefined,
				university: missing.university ? university : undefined,
				campus: missing.campus ? campus : undefined,
				studentId: missing.studentId ? values.studentId?.trim() : undefined,
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
								<Select value={field.value} onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger className="h-12 w-full px-4">
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
										<SelectTrigger className="h-12 w-full px-4">
											<SelectValue placeholder="Select campus" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{campuses.map((c) => (
											<SelectItem key={c} value={c}>{c}</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{missing.studentId && (
					<FormField
						control={form.control}
						name="studentId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Student ID</FormLabel>
								<FormControl>
									<Input placeholder="UGBS123456" className="rounded-full p-6" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<Button
					type="submit"
					disabled={updateProfileMutation.isPending}
					className="w-full rounded-full p-6 text-base"
				>
					{updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Complete profile
				</Button>
			</form>
		</Form>
	)
}
