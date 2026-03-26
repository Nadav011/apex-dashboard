import { cn } from "@/lib/cn";

export type StatusValue =
	| "healthy"
	| "degraded"
	| "critical"
	| "running"
	| "pending"
	| "failed";

export type BadgeSize = "sm" | "md" | "lg";

interface StatusBadgeProps {
	status: StatusValue;
	size?: BadgeSize;
	className?: string;
}

const LABELS: Record<StatusValue, string> = {
	healthy: "בריא",
	degraded: "ירוד",
	critical: "קריטי",
	running: "פעיל",
	pending: "ממתין",
	failed: "נכשל",
};

const DOT_COLORS: Record<StatusValue, string> = {
	healthy: "bg-[var(--color-status-healthy)]",
	degraded: "bg-[var(--color-status-degraded)]",
	critical: "bg-[var(--color-status-critical)]",
	running: "bg-[var(--color-status-running)]",
	pending: "bg-[var(--color-text-muted)]",
	failed: "bg-[var(--color-status-critical)]",
};

const TEXT_COLORS: Record<StatusValue, string> = {
	healthy: "text-[var(--color-status-healthy)]",
	degraded: "text-[var(--color-status-degraded)]",
	critical: "text-[var(--color-status-critical)]",
	running: "text-[var(--color-status-running)]",
	pending: "text-[var(--color-text-muted)]",
	failed: "text-[var(--color-status-critical)]",
};

const BG_COLORS: Record<StatusValue, string> = {
	healthy:
		"bg-[oklch(0.72_0.19_155_/_0.12)] border border-[oklch(0.72_0.19_155_/_0.25)]",
	degraded:
		"bg-[oklch(0.78_0.16_75_/_0.12)] border border-[oklch(0.78_0.16_75_/_0.25)]",
	critical:
		"bg-[oklch(0.62_0.22_25_/_0.12)] border border-[oklch(0.62_0.22_25_/_0.25)]",
	running:
		"bg-[oklch(0.65_0.18_250_/_0.12)] border border-[oklch(0.65_0.18_250_/_0.25)]",
	pending:
		"bg-[oklch(0.55_0.02_260_/_0.12)] border border-[oklch(0.55_0.02_260_/_0.25)]",
	failed:
		"bg-[oklch(0.62_0.22_25_/_0.12)] border border-[oklch(0.62_0.22_25_/_0.25)]",
};

const SIZE_CLASSES: Record<
	BadgeSize,
	{ badge: string; dot: string; text: string }
> = {
	sm: {
		badge: "px-1.5 py-0.5 gap-1 rounded",
		dot: "size-1.5",
		text: "text-xs",
	},
	md: { badge: "px-2 py-1 gap-1.5 rounded-md", dot: "size-2", text: "text-sm" },
	lg: {
		badge: "px-3 py-1.5 gap-2 rounded-lg",
		dot: "size-2.5",
		text: "text-base",
	},
};

export function StatusBadge({
	status,
	size = "md",
	className,
}: StatusBadgeProps) {
	const sizes = SIZE_CLASSES[size];
	const isRunning = status === "running";

	return (
		<span
			className={cn(
				"inline-flex items-center font-medium",
				sizes.badge,
				sizes.text,
				BG_COLORS[status],
				TEXT_COLORS[status],
				className,
			)}
		>
			<span
				className={cn(
					"shrink-0 rounded-full",
					sizes.dot,
					DOT_COLORS[status],
					isRunning && "animate-pulse-status",
				)}
				aria-hidden="true"
			/>
			{LABELS[status]}
		</span>
	);
}
