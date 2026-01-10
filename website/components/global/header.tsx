import { ShoppingBagIcon, ShoppingBasket, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Activity } from "react";
import Announcements from "../header/announcements";
import { CountryPicker } from "../header/country-picker";
import { SearchBar } from "../header/header-search";
import { UniversityPicker } from "../header/university-picker";
import UserDropdown from "../header/user-dropdown";
import { HeaderCategories } from "../header/header-categories";
import Logo from "./logo";
import { ThemeToggle } from "./theme-button";

const Links = [
	{
		name: "Products",
	},
	{
		name: "Stores",
	},
	{
		name: "Restaurants",
	},
	{
		name: "Food Stalls",
	},
];

export default function Header({
	showAnnouncement = true,
}: {
	showAnnouncement?: boolean;
}) {
	return (
		<header className="bg-background">
			<Activity mode={showAnnouncement ? "visible" : "hidden"}>
				<Announcements />
			</Activity>
			<nav className="bg-transparent max-w-global px-4 py-6 mx-auto my-0 flex gap-6 justify-between items-center md:border-b-primary/10 md:border-b-2">
				<Logo />
				<div className="hidden md:flex w-full items-center justify-between">
					<SearchBar />
					<ul className="nav-links flex gap-8 px-4">
						{Links.map((item) => (
							<li key={item.name} className="py-2">
								<Link href="/link" className="font-medium text-foreground/70 hover:text-primary transition-colors">
									<small>{item.name}</small>
								</Link>
							</li>
						))}
					</ul>

					<div className="pickers items-center flex gap-4 px-2">
						<UniversityPicker />
						<CountryPicker />
					</div>
				</div>
				<div className="end items-center flex gap-6 px-2">
					<UserDropdown />
					<ShoppingCart className="text-foreground/60" />
					<ThemeToggle />
				</div>
			</nav>
			<div className="md:hidden px-4">
				<SearchBar />
			</div>
			<HeaderCategories />
		</header>
	);
}
