import Image from "next/image";
import { cn } from "@/lib/utils";

const logoVariantSizes = {
	default: { width: 1200, height: 100 },
	auth: { width: 600, height: 50 },
	header: { width: 100, height: 30 },
	footer: { width: 120, height: 40 },
} as const;

type LogoVariant = keyof typeof logoVariantSizes;

type LogoProps = {
	variant?: LogoVariant;
	className?: string;
	alt?: string;
	priority?: boolean;
	width?: number;
	height?: number;
};

export default function Logo({
	variant = "default",
	className,
	alt = "Varsity Mart Logo",
	priority = false,
	width,
	height,
}: LogoProps) {
	const variantSize = logoVariantSizes[variant];

	return (
		<Image
			src="/vm_transparent.png"
			alt={alt}
			width={width ?? variantSize.width}
			height={height ?? variantSize.height}
			priority={priority}
			className={cn("h-auto w-auto", className)}
		/>
	);
}
