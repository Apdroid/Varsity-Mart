"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
	"Electronics",
	"Fashion",
	"Books",
	"Food",
	"Services",
	"Beauty",
];

export function HeroSection() {
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
		}
	};

	return (
		<section className="relative bg-gradient-to-br from-emerald-50 via-background to-emerald-50/30 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/10 py-16 md:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="max-w-3xl mx-auto text-center">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
						Your Campus
						<span className="text-emerald-600"> Marketplace</span>
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
						Buy, sell, and discover amazing deals from verified students on your
						campus. Safe, fast, and student-friendly.
					</p>

					{/* Search Bar */}
					<form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto mb-8">
						<div className="relative flex-1">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search for anything..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 h-12 text-base rounded-full border-border"
							/>
						</div>
						<Button
							type="submit"
							size="lg"
							className="h-12 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700"
						>
							Search
						</Button>
					</form>

					{/* Quick Categories */}
					<div className="flex flex-wrap items-center justify-center gap-2">
						<span className="text-sm text-muted-foreground">Popular:</span>
						{categories.map((category) => (
							<Button
								key={category}
								variant="outline"
								size="sm"
								className="rounded-full bg-transparent"
								onClick={() =>
									router.push(`/search?category=${category.toLowerCase()}`)
								}
							>
								{category}
							</Button>
						))}
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
					{[
						{ label: "Active Listings", value: "10K+" },
						{ label: "Verified Students", value: "5K+" },
						{ label: "Campus Stores", value: "500+" },
						{ label: "Orders Delivered", value: "25K+" },
					].map((stat) => (
						<div key={stat.label} className="text-center">
							<div className="text-2xl md:text-3xl font-bold text-foreground">
								{stat.value}
							</div>
							<div className="text-sm text-muted-foreground">{stat.label}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
