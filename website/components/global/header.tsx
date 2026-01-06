import { Activity } from "react";
import Announcements from "../main/announcements";
import Logo from "./logo";
import { SearchBar } from "../main/header-search";
import Link from "next/link";
import { UniversityPicker } from "../main/university-picker";
import { CountryPicker } from "../main/country-picker";
import UserDropdown from "../main/user-dropdown";

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
		<header>
			<Activity mode={showAnnouncement ? "visible" : "hidden"}>
				<Announcements />
			</Activity>
			<nav className="bg-transparent max-w-global p-4 mx-auto my-0 flex gap-6 items-center ">
				<Logo />
				<SearchBar />
				<ul className="nav-links flex gap-6">
					{Links.map((item) => (
						<li key={item.name}>
							<Link href="/link">
								<small>{item.name}</small>
							</Link>
						</li>
					))}
				</ul>
				<div className="pickers items-center flex">
					<UniversityPicker />
					<CountryPicker />
				</div>
				<UserDropdown />
			</nav>
		</header>
	);
}
