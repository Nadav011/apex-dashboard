import { cn } from "@/lib/cn";

type BadgeVariant =
	| "success"
	| "warning"
	| "error"
	| "info"
	| "default"
	| "purple";

interface BadgeProps {
	children: React.ReactNode;
	variant?: BadgeVariant;
	className?: string;
}

const VARIANTS: Record<BadgeVariant, string> = {
	success:
		"bg-[oklch(0.72_0.19_155/0.12)] text-[var(--color-accent-green)] border-[oklch(0.72_0.19_155/0.25)]",
	warning:
		"bg-[oklch(0.78_0.16_75/0.12)] text-[var(--color-accent-amber)] border-[oklch(0.78_0.16_75/0.25)]",
	error:
		"bg-[oklch(0.62_0.22_25/0.12)] text-[var(--color-accent-red)] border-[oklch(0.62_0.22_25/0.25)]",
	info: "bg-[oklch(0.65_0.18_250/0.12)] text-[var(--color-accent-blue)] border-[oklch(0.65_0.18_250/0.25)]",
	purple:
		"bg-[oklch(0.62_0.2_290/0.12)] text-[var(--color-accent-purple)] border-[oklch(0.62_0.2_290/0.25)]",
	default:
		"bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
};

export function Badge({
	children,
	variant = "default",
	className,
}: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border",
				VARIANTS[variant],
				className,
			)}
		>
			{children}
		</span>
	);
}
