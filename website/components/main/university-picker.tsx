"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const universities = [
	{
		id: 1,
		name: "KNUST",
		full: "Kwame Nkrumah University of Science and Technology",
	},
	{ id: 2, name: "University of Ghana", full: "University of Ghana, Legon" },
	{ id: 3, name: "HTU", full: "Ho Technical University" },
	{ id: 4, name: "KTU", full: "Koforidua Technical University" },
	{ id: 5, name: "UPSA", full: "University of Professional Studies Accra" },
	{ id: 6, name: "GIJ", full: "Ghana Institute of Journalism" },
	{ id: 7, name: "Ashesi University", full: "Ashesi University" },
	{
		id: 8,
		name: "Accra Institute of Technology",
		full: "Accra Institute of Technology",
	},
];

export function UniversityPicker() {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState(universities[0]);

	return (
		<div className="relative">
			<button
				onClick={() => setOpen(!open)}
				className="flex items-center gap-2 px-4 py-2   bg-background hover:bg-accent transition-colors"
			>
				<small >{selected.name}</small>
				<ChevronDown className="w-4 h-4 opacity-50" />
			</button>

			{open && (
				<div className="absolute top-full left-0 mt-2 w-80 border border-border rounded-lg bg-background shadow-lg z-50">
					{universities.map((uni) => (
						<button
							key={uni.id}
							onClick={() => {
								setSelected(uni);
								setOpen(false);
							}}
							className="w-full px-4 py-3 hover:bg-accent transition-colors text-left border-b border-border last:border-b-0"
						>
							<div className="text-sm font-medium">{uni.name}</div>
							<div className="text-xs opacity-60">{uni.full}</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
