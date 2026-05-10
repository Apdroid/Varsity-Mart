"use client";
import { motion } from "motion/react";
import WorldMap from "@/components/ui/world-map";

export function GlobeSection() {
	return (
		<div className="max-w-7xl mx-auto py-40 w-full">
			<div className="max-w-7xl mx-auto text-center">
				<p className="font-bold text-xl md:text-4xl dark:text-white text-black">
					Global{" "}
					<span className="text-primary">
						{"Connectivity".split("").map((word, idx) => (
							<motion.span
								key={idx}
								className="inline-block"
								initial={{ x: -10, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ duration: 0.3, delay: idx * 0.04 }}
							>
								{word}
							</motion.span>
						))}
					</span>
				</p>
				<p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
					Universities and institutions worldwide use our platform to buy and sell
					various resources, fostering a connected global community.
				</p>
			</div>
			<WorldMap
				dots={[
					{
						start: {
							lat: 64.2008,
							lng: -149.4937,
						}, // Alaska (Fairbanks)
						end: {
							lat: 34.0522,
							lng: -118.2437,
						}, // Los Angeles
					},
					{
						start: { lat: 6.6008, lng: 0.4713 }, // Ho
						end: { lat: 5.6037, lng: -0.187 }, // Accra
					},
					{
						start: { lat: 5.6037, lng: -0.187 }, // Accra
						end: { lat: 5.1054, lng: -1.2466 }, // Cape Coast
					},
					{
						start: { lat: 5.1054, lng: -1.2466 }, // Cape Coast
						end: { lat: 6.6885, lng: -1.6244 }, // Kumasi
					},
					{
						start: { lat: 6.6885, lng: -1.6244 }, // Kumasi
						end: { lat: 6.6008, lng: 0.4713 }, // Ho
					},
					{
						start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
						end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
					},
					{
						start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
						end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
					},
					{
						start: { lat: 51.5074, lng: -0.1278 }, // London
						end: { lat: 28.6139, lng: 77.209 }, // New Delhi
					},
					{
						start: { lat: 28.6139, lng: 77.209 }, // New Delhi
						end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
					},
					{
						start: { lat: 28.6139, lng: 77.209 }, // New Delhi
						end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
					},
				]}
			/>
		</div>
	);
}
