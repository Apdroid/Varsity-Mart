"use client";

import { GraduationCap, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { universities } from "@/data/auth/universities";
import { useUniversityStore } from "@/lib/stores/university-store";
import { cn } from "@/lib/utils";

export function UniversityDisplay() {
	const { selectedUniversity, selectedCampus, setUniversity } =
		useUniversityStore();
	const [open, setOpen] = useState(false);
	const [tempUniversity, setTempUniversity] = useState<string>("");
	const [tempCampus, setTempCampus] = useState<string>("");

	// Initialize temp values when popover opens
	useEffect(() => {
		if (open) {
			setTempUniversity(selectedUniversity || "");
			setTempCampus(selectedCampus || "");
		}
	}, [open, selectedUniversity, selectedCampus]);

	const availableCampuses = tempUniversity
		? universities[tempUniversity] || []
		: [];

	if (!selectedUniversity) {
		return null;
	}

	const handleSave = () => {
		if (tempUniversity) {
			setUniversity(tempUniversity, tempCampus);
			setOpen(false);
		}
	};

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
					<GraduationCap className="h-4 w-4 text-primary" />
					<span className="max-w-2xl truncate">
						{selectedUniversity}
						{selectedCampus && ` - ${selectedCampus}`}
					</span>
					<ChevronDown className="h-3 w-3 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="start">
				<div className="p-4">
					<div className="mb-4">
						<h3 className="text-sm font-semibold text-foreground mb-1">
							Change University
						</h3>
						<p className="text-xs text-muted-foreground">
							Update your university to see personalized content
						</p>
					</div>

					<div className="space-y-3">
						{/* University Selection */}
						<div className="space-y-1.5">
							<label className="text-xs font-medium text-foreground">
								University
							</label>
							<select
								value={tempUniversity}
								onChange={(e) => {
									setTempUniversity(e.target.value);
									setTempCampus("");
								}}
								className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
							>
								<option value="">Select university</option>
								{Object.keys(universities).map((uni) => (
									<option key={uni} value={uni}>
										{uni}
									</option>
								))}
							</select>
						</div>

						{/* Campus Selection */}
						{tempUniversity && availableCampuses.length > 0 && (
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-foreground">
									Campus
								</label>
								<select
									value={tempCampus}
									onChange={(e) => setTempCampus(e.target.value)}
									className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
								>
									<option value="">Select campus</option>
									{availableCampuses.map((campus) => (
										<option key={campus} value={campus}>
											{campus}
										</option>
									))}
								</select>
							</div>
						)}

						<Button
							onClick={handleSave}
							disabled={!tempUniversity}
							size="sm"
							className="w-full bg-primary hover:bg-primary/90"
						>
							Save Changes
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

