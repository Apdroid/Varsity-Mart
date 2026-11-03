"use client"

import * as React from "react"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type TimePickerProps = {
	/** 24-hour time string, "HH:MM" (e.g. "08:00", "20:30") */
	value?: string
	onChange: (value: string) => void
	className?: string
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1) // 1–12
const MINUTES = ["00", "15", "30", "45"]
const PERIODS = ["AM", "PM"] as const

type Period = (typeof PERIODS)[number]

// Parse a 24h "HH:MM" string into 12h parts.
function parse(value?: string): { hour: number; minute: string; period: Period } {
	if (!value || !value.includes(":")) {
		return { hour: 8, minute: "00", period: "AM" }
	}
	const [hStr, mStr] = value.split(":")
	const h24 = Number(hStr)
	const period: Period = h24 >= 12 ? "PM" : "AM"
	const hour = h24 % 12 || 12
	// Snap the minute to the nearest available option.
	const minute = MINUTES.includes(mStr) ? mStr : "00"
	return { hour, minute, period }
}

// Compose 12h parts back into a 24h "HH:MM" string.
function compose(hour: number, minute: string, period: Period): string {
	let h24 = hour % 12
	if (period === "PM") h24 += 12
	return `${String(h24).padStart(2, "0")}:${minute}`
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
	const { hour, minute, period } = parse(value)

	const update = (next: { hour?: number; minute?: string; period?: Period }) => {
		onChange(
			compose(
				next.hour ?? hour,
				next.minute ?? minute,
				next.period ?? period
			)
		)
	}

	return (
		<div className={cn("grid grid-cols-3 gap-2", className)}>
			<Select
				value={String(hour)}
				onValueChange={(v) => update({ hour: Number(v) })}
			>
				<SelectTrigger aria-label="Hour">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{HOURS.map((h) => (
						<SelectItem key={h} value={String(h)}>
							{h}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select value={minute} onValueChange={(v) => update({ minute: v })}>
				<SelectTrigger aria-label="Minute">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{MINUTES.map((m) => (
						<SelectItem key={m} value={m}>
							{m}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Select
				value={period}
				onValueChange={(v) => update({ period: v as Period })}
			>
				<SelectTrigger aria-label="AM or PM">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{PERIODS.map((p) => (
						<SelectItem key={p} value={p}>
							{p}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
