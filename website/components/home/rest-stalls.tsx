import EstablishmentCardSideOverlay from "./overlay-card";
import { establishments } from "@/data/food/establishment-data";
export default function RestStalls() {
	return (
		<div>
			<div className="my-10 max-w-460 mx-auto">
				<h1 className="text-2xl font-bold my-6 leading-loose">
					Featured Restaurants and Fast Food Joints{" "}
					<hr className="mt-2 w-20 border-primary" />
				</h1>
				<p className="text-sm text-foreground/80 mb-6">
					Bringing together restaurants from your surroundings and also from the
					famous stores around you for easy access
				</p>
				<div className="grid grid-cols-2 mx-auto my-0 w-full md:grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-6">
					{establishments.map((item) => (
						<div key={item.name}>
							<EstablishmentCardSideOverlay product={item} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
