"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const locations = [
	{ id: "main-campus", name: "Main Campus", address: "University Main Campus" },
	{ id: "north-campus", name: "North Campus", address: "University North Campus" },
	{ id: "south-campus", name: "South Campus", address: "University South Campus" },
	{ id: "off-campus", name: "Off Campus", address: "Near University" },
];

export function LocationSelector() {
	const [selectedLocation, setSelectedLocation] = useState(locations[0]);
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					className={cn(
						"h-9 px-3 text-sm font-medium text-muted-foreground hover:text-foreground",
						"hidden sm:flex items-center gap-2"
					)}
				>
					<MapPin className="h-4 w-4" />
					<span className="max-w-[120px] truncate">{selectedLocation.name}</span>
					<ChevronDown className="h-3 w-3 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-0" align="start">
				<div className="p-2">
					<div className="px-3 py-2 text-sm font-semibold text-foreground border-b border-border">
						Select Location
					</div>
					<div className="py-1">
						{locations.map((location) => (
							<button
								key={location.id}
								onClick={() => {
									setSelectedLocation(location);
									setOpen(false);
								}}
								className={cn(
									"w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
									"hover:bg-accent hover:text-accent-foreground",
									selectedLocation.id === location.id &&
										"bg-primary/10 text-primary font-medium"
								)}
							>
								<div className="font-medium">{location.name}</div>
								<div className="text-xs text-muted-foreground">
									{location.address}
								</div>
							</button>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

