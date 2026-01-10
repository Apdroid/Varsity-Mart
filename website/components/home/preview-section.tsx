export default function PreviewSection({
	title,
	children,
	description,
}: {
	title: string;
	description?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="my-10 max-w-460 mx-auto px-4">
			<h1 className="md:text-2xl font-bold my-6">
				{title} <hr className="mt-2 w-10 md:w-20 border-primary/90" />
			</h1>
			<p className="text-xs md:text-sm text-foreground/80 mb-6">
				{description}
			</p>
			<div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-6">
				{children}
			</div>
		</div>
	);
}
