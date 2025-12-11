"use client";
import { Backpack, BookOpen, Coffee, Home, Laptop } from "lucide-react";
import { useEffect, useState } from "react";
export default function StudentCategories() {
	const [isDark, setIsDark] = useState(false);
	useEffect(() => {
		if (localStorage.getItem("theme") === "dark") {
			setIsDark(true);
		} else {
			setIsDark(false);
		}
	}, [isDark]);
	const categories = [
		{
			name: "Textbooks",
			icon: BookOpen,
			color: "bg-blue-100",

			dark: "bg-rose-900/20",

			iconColor: "text-blue-600",
		},
		{
			name: "Electronics",
			icon: Laptop,
			dark: "bg-rose-900/20",
			color: "bg-purple-100",
			iconColor: "text-purple-600",
		},
		{
			name: "Food & Snacks",
			icon: Coffee,
			color: "bg-amber-100",
			dark: "bg-rose-900/20",
			iconColor: "text-amber-600",
		},
		{
			name: "Supplies",
			icon: Backpack,
			color: "bg-green-100",
			dark: "bg-rose-900/20",
			iconColor: "text-green-600",
		},
		{
			name: "Dorm & Living",
			icon: Home,
			color: "bg-rose-100",
			dark: "bg-rose-900",
			iconColor: "text-rose-600",
		},
	];

	return (
		<div className="p-8 mx-auto max-w-7xl">
			<h1 className="text-3xl font-bold  mb-8">Top categories</h1>

			<div className="flex flex-wrap gap-4">
				{categories.map((category) => (
					<button
						type="button"
						key={category.name}
						className={`${isDark ? category.dark : category.color} rounded-2xl px-6 py-4 flex items-center justify-between gap-8 min-w-55 hover:opacity-80 transition-opacity`}
					>
						<span className="text-gray-800 font-medium text-lg">{category.name}</span>
						<div
							className={`${category.iconColor} bg-accent bg-opacity-60 rounded-full p-2.5`}
						>
							<category.icon size={24} />
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
