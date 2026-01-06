"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const countries = [
	{ code: "GH", name: "Ghana", flag: "🇬🇭" },
	// { code: "US", name: "United States", flag: "🇺🇸" },
	// { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
	// { code: "CA", name: "Canada", flag: "🇨🇦" },
	// { code: "AU", name: "Australia", flag: "🇦🇺" },
	// { code: "ZA", name: "South Africa", flag: "🇿🇦" },
];

export function CountryPicker() {
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState(countries[0]);

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex items-center gap-2 px-2 py-2   bg-background hover:bg-accent transition-colors"
			>
				<span className="text-sm">{selected.flag}</span>
				<small >{selected.name}</small>
				<ChevronDown className="w-4 h-4 opacity-50" />
			</button>

			{open && (
				<div className="absolute top-full left-0 mt-2 w-64 border border-border rounded-lg bg-background shadow-lg z-50">
					{countries.map((country) => (
						<button
							type="button"
							key={country.code}
							onClick={() => {
								setSelected(country);
								setOpen(false);
							}}
							className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left border-b border-border last:border-b-0"
						>
							<span className="text-2xl">{country.flag}</span>
							<span className="text-sm">{country.name}</span>
						</button>
					))}

					<button
						type="button"
						className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors text-left border-b border-border last:border-b-0"
					>
						<span className="text-xs">
							🇳🇬 🇺🇸 <br />
							Other Countries Coming Soon
						</span>
					</button>
				</div>
			)}
		</div>
	);
}
