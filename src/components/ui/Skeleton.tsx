import { clsx } from "clsx";

type SkeletonVariant = "text" | "circle" | "card";

interface SkeletonProps {
	className?: string;
	width?: string | number;
	height?: string | number;
	rounded?: boolean;
	variant?: SkeletonVariant;
}

const variantStyles: Record<SkeletonVariant, string> = {
	text: "h-4 rounded",
	circle: "rounded-full",
	card: "rounded-xl h-32",
};

export function Skeleton({
	className,
	width,
	height,
	rounded = false,
	variant = "text",
}: SkeletonProps) {
	const inlineStyle: React.CSSProperties = {};
	if (width !== undefined) {
		inlineStyle.width = typeof width === "number" ? `${width}px` : width;
	}
	if (height !== undefined) {
		inlineStyle.height = typeof height === "number" ? `${height}px` : height;
	}

	return (
		<div
			className={clsx(
				"shimmer",
				"bg-[oklch(0.22_0.02_260)]",
				variantStyles[variant],
				rounded && "rounded-full",
				className,
			)}
			style={inlineStyle}
			aria-hidden="true"
		/>
	);
}

/** Convenience wrapper — renders N text skeleton rows */
export function SkeletonLines({
	lines = 3,
	className,
}: {
	lines?: number;
	className?: string;
}) {
	return (
		<div className={clsx("flex flex-col gap-2", className)}>
			{Array.from({ length: lines }).map((_, i) => (
				<Skeleton
					// biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list
					key={i}
					variant="text"
					width={i === lines - 1 ? "60%" : "100%"}
				/>
			))}
		</div>
	);
}
