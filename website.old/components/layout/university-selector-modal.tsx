"use client";

import { GraduationCap, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { universities } from "@/data/auth/universities";
import { useUniversityStore } from "@/lib/stores/university-store";
import { cn } from "@/lib/utils";

interface UniversitySelectorModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function UniversitySelectorModal({
	open,
	onOpenChange,
}: UniversitySelectorModalProps) {
	const { selectedUniversity, selectedCampus, setUniversity } =
		useUniversityStore();
	const [tempUniversity, setTempUniversity] = useState<string>(
		selectedUniversity || "",
	);
	const [tempCampus, setTempCampus] = useState<string>(selectedCampus || "");

	const availableCampuses = tempUniversity
		? universities[tempUniversity] || []
		: [];

	// Try to detect location on mount
	useEffect(() => {
		if (!selectedUniversity && navigator.geolocation) {
			// This is a mock - in production, you'd use geolocation to find nearest university
			// For now, we'll just show the modal
		}
	}, [selectedUniversity]);

	const handleContinue = () => {
		if (tempUniversity) {
			setUniversity(tempUniversity, tempCampus);
			onOpenChange(false);
		}
	};

	const handleSkip = () => {
		// Set a default or allow browsing without university
		setUniversity("Other", "Main Campus");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 rounded-lg bg-primary/10">
							<GraduationCap className="h-6 w-6 text-primary" />
						</div>
						<div>
							<DialogTitle className="text-xl font-bold">
								Select Your University
							</DialogTitle>
							<DialogDescription className="text-sm text-muted-foreground">
								We'll personalize your experience based on your campus
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* University Selection */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">
							University
						</label>
						<Select
							value={tempUniversity}
							onValueChange={(value) => {
								setTempUniversity(value);
								setTempCampus("");
							}}
						>
							<SelectTrigger className="w-full h-11">
								<SelectValue placeholder="Select your university" />
							</SelectTrigger>
							<SelectContent>
								{Object.keys(universities).map((uni) => (
									<SelectItem key={uni} value={uni}>
										{uni}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Campus Selection */}
					{tempUniversity && availableCampuses.length > 0 && (
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">
								Campus
							</label>
							<Select value={tempCampus} onValueChange={setTempCampus}>
								<SelectTrigger className="w-full h-11">
									<SelectValue placeholder="Select your campus" />
								</SelectTrigger>
								<SelectContent>
									{availableCampuses.map((campus) => (
										<SelectItem key={campus} value={campus}>
											{campus}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					{/* Info Message */}
					<div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
						<MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
						<p className="text-xs text-muted-foreground">
							This helps us show you products, stores, and restaurants available
							on your campus. You can change this anytime.
						</p>
					</div>
				</div>

				<div className="flex gap-2 pt-4 border-t border-border">
					<Button
						variant="outline"
						onClick={handleSkip}
						className="flex-1"
					>
						Skip for Now
					</Button>
					<Button
						onClick={handleContinue}
						disabled={!tempUniversity}
						className="flex-1 bg-primary hover:bg-primary/90"
					>
						Continue
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

