import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent } from "@/components/ui/card";
import { stats, team, values } from "@/data/about";

export const metadata: Metadata = {
	title: "About Us | VarsityMart",
	description:
		"Learn about VarsityMart - the premier marketplace for university students",
};

export default function AboutPage() {
	return (
		<MainLayout>
			<div className="container mx-auto px-4 py-12">
				{/* Hero Section */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h1 className="text-4xl md:text-5xl font-bold mb-6">About VarsityMart</h1>
					<p className="text-xl text-muted-foreground">
						VarsityMart is a Ghanaian&apos; leading student marketplace, connecting
						university students to buy, sell, and discover products and services
						within their campus community.
					</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
					{stats.map((stat) => (
						<Card key={stat.label} className="text-center">
							<CardContent className="pt-6">
								<p className="text-3xl md:text-4xl font-bold text-blue-600 ">
									{stat.value}
								</p>
								<p className="text-muted-foreground mt-1">{stat.label}</p>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Mission */}
				<div className="bg-blue-600 text-white rounded-2xl p-8 md:p-12 mb-16">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
						<p className="text-lg opacity-90">
							To empower university students across the world by creating a trusted,
							convenient, and affordable marketplace that makes campus life easier. We
							believe every student deserves access to quality products and the
							opportunity to earn while they learn.
						</p>
					</div>
				</div>

				{/* Values */}
				<div className="mb-16">
					<h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
						Our Values
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{values.map((value) => (
							<Card key={value.title} className="text-center">
								<CardContent className="pt-6">
									<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
										<value.icon className="h-6 w-6 text-blue-600" />
									</div>
									<h3 className="font-semibold mb-2">{value.title}</h3>
									<p className="text-sm text-muted-foreground">{value.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Team */}
				<div className="mb-16">
					<h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
						Meet Our Team
					</h2>
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{team.map((member) => (
							<Card key={member.name} className="text-center overflow-hidden">
								<div className="aspect-square bg-muted">
									<Image
										src={member.image || "/placeholder.svg"}
										alt={member.name}
										width={400}
										height={400}
										className="w-full h-full object-cover"
									/>
								</div>
								<CardContent className="pt-4">
									<h3 className="font-semibold">{member.name}</h3>
									<p className="text-sm text-muted-foreground">{member.role}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* CTA */}
				<div className="text-center bg-muted rounded-2xl p-8 md:p-12">
					<ShoppingBag className="h-12 w-12 text-blue-600 mx-auto mb-4" />
					<h2 className="text-2xl md:text-3xl font-bold mb-4">
						Join VarsityMart Today
					</h2>
					<p className="text-muted-foreground mb-6 max-w-xl mx-auto">
						Whether you want to buy, sell, or discover amazing deals on campus,
						VarsityMart is your go-to marketplace.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/auth/register"
							className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
						>
							Get Started
						</a>
						<a
							href="/products"
							className="inline-flex items-center justify-center px-6 py-3 border rounded-lg hover:bg-accent transition-colors font-medium"
						>
							Browse Products
						</a>
					</div>
				</div>

			</div>
		</MainLayout>
	);
}
